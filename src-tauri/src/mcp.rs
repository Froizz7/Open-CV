use crate::models::{JsonRpcRequest, JsonRpcResponse, McpTool};
use serde_json::json;
use std::process::Stdio;
use std::time::Duration;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::{Child, ChildStdin, ChildStdout, Command};
use tokio::time::timeout;

pub struct McpProcessClient {
    child: Child,
    stdin: ChildStdin,
    reader: BufReader<ChildStdout>,
    request_counter: u64,
}

impl McpProcessClient {
    pub async fn spawn(command_str: &str, args: &[String]) -> Result<Self, String> {
        let mut cmd = Command::new(command_str);
        cmd.args(args);
        cmd.stdin(Stdio::piped());
        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::inherit());

        #[cfg(target_os = "windows")]
        {
            const CREATE_NO_WINDOW: u32 = 0x08000000;
            cmd.creation_flags(CREATE_NO_WINDOW);
        }

        let mut child = cmd
            .spawn()
            .map_err(|e| format!("Impossible de lancer le serveur MCP ('{}'): {}", command_str, e))?;

        let stdin = child
            .stdin
            .take()
            .ok_or_else(|| "Impossible d'accéder au flux stdin du serveur MCP".to_string())?;

        let stdout = child
            .stdout
            .take()
            .ok_or_else(|| "Impossible d'accéder au flux stdout du serveur MCP".to_string())?;

        let reader = BufReader::new(stdout);

        let mut client = Self {
            child,
            stdin,
            reader,
            request_counter: 0,
        };

        client.perform_initialize().await?;

        Ok(client)
    }

    async fn send_request_raw(
        &mut self,
        method: &str,
        params: Option<serde_json::Value>,
    ) -> Result<serde_json::Value, String> {
        self.request_counter += 1;
        let id = self.request_counter;

        let req = JsonRpcRequest {
            jsonrpc: "2.0".to_string(),
            id,
            method: method.to_string(),
            params,
        };

        let mut json_str = serde_json::to_string(&req)
            .map_err(|e| format!("Erreur d'encodage JSON-RPC: {}", e))?;
        json_str.push('\n');

        self.stdin
            .write_all(json_str.as_bytes())
            .await
            .map_err(|e| format!("Erreur d'écriture stdin MCP: {}", e))?;
        self.stdin
            .flush()
            .await
            .map_err(|e| format!("Erreur de flush stdin MCP: {}", e))?;

        let read_future = async {
            let mut line = String::new();
            loop {
                line.clear();
                let bytes_read = self
                    .reader
                    .read_line(&mut line)
                    .await
                    .map_err(|e| format!("Erreur de lecture stdout MCP: {}", e))?;

                if bytes_read == 0 {
                    return Err("Le serveur MCP a fermé le flux stdout de manière inattendue".to_string());
                }

                let trimmed = line.trim();
                if trimmed.is_empty() {
                    continue;
                }

                if let Ok(resp) = serde_json::from_str::<JsonRpcResponse>(trimmed) {
                    if resp.id == Some(id) {
                        if let Some(err) = resp.error {
                            return Err(format!(
                                "Erreur JSON-RPC MCP ({}) : {}",
                                err.code, err.message
                            ));
                        }
                        return Ok(resp.result.unwrap_or(serde_json::Value::Null));
                    }
                }
            }
        };

        timeout(Duration::from_secs(15), read_future)
            .await
            .map_err(|_| "Timeout (15s) en attente de la réponse du serveur MCP".to_string())?
    }

    async fn send_notification(&mut self, method: &str, params: Option<serde_json::Value>) -> Result<(), String> {
        let notif = json!({
            "jsonrpc": "2.0",
            "method": method,
            "params": params
        });

        let mut json_str = serde_json::to_string(&notif)
            .map_err(|e| format!("Erreur encodage notification: {}", e))?;
        json_str.push('\n');

        self.stdin
            .write_all(json_str.as_bytes())
            .await
            .map_err(|e| format!("Erreur d'envoi notification MCP: {}", e))?;
        self.stdin
            .flush()
            .await
            .map_err(|e| format!("Erreur flush notification: {}", e))?;

        Ok(())
    }

    async fn perform_initialize(&mut self) -> Result<(), String> {
        let init_params = json!({
            "protocolVersion": "2024-11-05",
            "capabilities": {
                "roots": { "listChanged": false },
                "sampling": {}
            },
            "clientInfo": {
                "name": "OpenCV-Desktop",
                "version": "0.1.0"
            }
        });

        self.send_request_raw("initialize", Some(init_params)).await?;
        self.send_notification("notifications/initialized", None).await?;
        Ok(())
    }

    pub async fn list_tools(&mut self) -> Result<Vec<McpTool>, String> {
        let result = self.send_request_raw("tools/list", Some(json!({}))).await?;
        if let Some(tools_arr) = result.get("tools").and_then(|t| t.as_array()) {
            let tools: Vec<McpTool> = serde_json::from_value(serde_json::Value::Array(tools_arr.clone()))
                .unwrap_or_default();
            Ok(tools)
        } else {
            Ok(vec![])
        }
    }

    pub async fn call_tool(
        &mut self,
        tool_name: &str,
        arguments: serde_json::Value,
    ) -> Result<serde_json::Value, String> {
        let params = json!({
            "name": tool_name,
            "arguments": arguments
        });

        let res = self.send_request_raw("tools/call", Some(params)).await?;
        Ok(res)
    }

    pub async fn shutdown(mut self) {
        let _ = self.child.kill().await;
    }
}
