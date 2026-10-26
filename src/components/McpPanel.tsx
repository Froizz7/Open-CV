import React, { useState } from "react";
import {
  Bot,
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Code2,
  HelpCircle,
} from "lucide-react";
import { safeInvoke } from "../utils/tauri";
import { McpTool } from "../types/mcp";

export const McpPanel: React.FC = () => {
  const [command, setCommand] = useState<string>("npx");
  const [argsStr, setArgsStr] = useState<string>(
    "-y @modelcontextprotocol/server-filesystem C:\\Users\\Froizz\\Documents\\GitHub\\Open-CV"
  );
  const [tools, setTools] = useState<McpTool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTool, setSelectedTool] = useState<string>("");
  const [toolArgsJson, setToolArgsJson] = useState<string>(
    '{\n  "path": "C:\\\\Users\\\\Froizz\\\\Documents\\\\GitHub\\\\Open-CV"\n}'
  );
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [isCallingTool, setIsCallingTool] = useState<boolean>(false);

  const handleListTools = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const args = argsStr.split(/\s+/).filter(Boolean);
      const res = await safeInvoke<McpTool[]>("mcp_list_tools", {
        command,
        args,
      });
      setTools(res);
      if (res.length > 0) {
        setSelectedTool(res[0].name);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallTool = async () => {
    if (!selectedTool) return;
    setIsCallingTool(true);
    setToolOutput(null);
    setError(null);

    try {
      const args = argsStr.split(/\s+/).filter(Boolean);
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgsJson);
      } catch {
        throw new Error("Tool arguments must be valid JSON.");
      }

      const res = await safeInvoke<unknown>("mcp_call_tool", {
        command,
        args,
        toolName: selectedTool,
        arguments: parsedArgs,
      });

      setToolOutput(JSON.stringify(res, null, 2));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsCallingTool(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 p-4 space-y-4 overflow-hidden text-zinc-900 dark:text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-white p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <Bot className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Client MCP (Model Context Protocol) via Stdio
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Interrogez des serveurs MCP locaux pour alimenter votre profil en contexte externe
            </p>
          </div>
        </div>

        <div className="text-[11px] bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-lg flex items-center space-x-1 font-mono">
          <span>JSON-RPC 2.0 stdio</span>
        </div>
      </div>

      <div className="bg-white dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-zinc-700 dark:text-zinc-300">
        <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Le protocole standard <strong className="text-zinc-800 dark:text-zinc-200">MCP</strong> permet à l'application de dialoguer directement avec vos serveurs d'outils locaux (par exemple inspecter des fichiers de projets ou lire des documents PDF).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-3">
          <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Commande Exécutable
          </label>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-200 font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            placeholder="npx, python, node..."
          />
        </div>

        <div className="md:col-span-7">
          <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Arguments CLI du Serveur MCP
          </label>
          <input
            type="text"
            value={argsStr}
            onChange={(e) => setArgsStr(e.target.value)}
            className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-200 font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            placeholder="-y @modelcontextprotocol/server-filesystem /path"
          />
        </div>

        <div className="md:col-span-2 flex items-end">
          <button
            onClick={handleListTools}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-1.5 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span>Connecter</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-3 flex items-start space-x-2 text-xs text-rose-800 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="overflow-x-auto font-mono text-[11px]">{error}</div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <div className="bg-white dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex flex-col space-y-2 overflow-hidden">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />
              <span>Outils Découverts ({tools.length})</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {tools.length === 0 ? (
              <p className="text-xs text-zinc-500 italic text-center py-8">
                Cliquez sur "Connecter" pour interroger le serveur MCP (tools/list).
              </p>
            ) : (
              tools.map((t) => (
                <div
                  key={t.name}
                  onClick={() => setSelectedTool(t.name)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedTool === t.name
                      ? "bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white"
                      : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs font-semibold">
                    <span>{t.name}</span>
                    {selectedTool === t.name && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </div>
                  {t.description && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {t.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex flex-col space-y-2 overflow-hidden">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />
              <span>Exécution ({selectedTool || "Aucun outil"})</span>
            </span>
            <button
              onClick={handleCallTool}
              disabled={isCallingTool || !selectedTool}
              className="bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-2.5 py-1 rounded-md text-xs font-semibold transition-all disabled:opacity-50 flex items-center space-x-1"
            >
              {isCallingTool ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Play className="w-3 h-3" />
              )}
              <span>Appeler</span>
            </button>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-600 dark:text-zinc-400">Arguments JSON</label>
            <textarea
              rows={3}
              value={toolArgsJson}
              onChange={(e) => setToolArgsJson(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-mono text-zinc-900 dark:text-zinc-200 resize-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
            />
          </div>

          <div className="flex-1 flex flex-col min-h-0 space-y-1">
            <label className="block text-[11px] text-zinc-600 dark:text-zinc-400">Résultat JSON-RPC</label>
            <pre className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-300 overflow-auto whitespace-pre-wrap">
              {toolOutput || "La réponse retournée par le serveur MCP s'affichera ici..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
