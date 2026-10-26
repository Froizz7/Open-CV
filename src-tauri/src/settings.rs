use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecuritySettings {
    pub enable_prompt_injection_check: bool,
    pub enable_document_sanitization: bool,
    pub developer_mode_alerts: bool,
    pub strict_ats_validation: bool,
}

impl Default for SecuritySettings {
    fn default() -> Self {
        Self {
            enable_prompt_injection_check: true,
            enable_document_sanitization: true,
            developer_mode_alerts: false,
            strict_ats_validation: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrivacySettings {
    pub save_analysis_history: bool,
    pub history_retention_days: u32,
    pub save_imported_resumes: bool,
    pub temp_files_retention_hours: u32,
}

impl Default for PrivacySettings {
    fn default() -> Self {
        Self {
            save_analysis_history: true,
            history_retention_days: 30,
            save_imported_resumes: true,
            temp_files_retention_hours: 24,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIUsageSettings {
    pub profile: String,
    pub max_requests_per_hour: u32,
    pub max_concurrent_requests: u32,
    pub min_request_delay_ms: u64,
    pub max_document_size_kb: u32,
}

impl Default for AIUsageSettings {
    fn default() -> Self {
        Self {
            profile: "balanced".to_string(),
            max_requests_per_hour: 60,
            max_concurrent_requests: 2,
            min_request_delay_ms: 1000,
            max_document_size_kb: 200,
        }
    }
}

impl AIUsageSettings {
    pub fn apply_profile(&mut self, profile_name: &str) {
        match profile_name.to_lowercase().as_str() {
            "strict" => {
                self.profile = "strict".to_string();
                self.max_requests_per_hour = 20;
                self.max_concurrent_requests = 1;
                self.min_request_delay_ms = 3000;
                self.max_document_size_kb = 50;
            }
            "balanced" => {
                self.profile = "balanced".to_string();
                self.max_requests_per_hour = 60;
                self.max_concurrent_requests = 2;
                self.min_request_delay_ms = 1000;
                self.max_document_size_kb = 200;
            }
            "custom" => {
                self.profile = "custom".to_string();
            }
            _ => {}
        }
    }
}

#[derive(Clone)]
pub struct RateLimiter {
    state: Arc<Mutex<RateLimiterState>>,
}

struct RateLimiterState {
    history: Vec<Instant>,
    last_call: Option<Instant>,
    active_requests: u32,
}

impl RateLimiter {
    pub fn new() -> Self {
        Self {
            state: Arc::new(Mutex::new(RateLimiterState {
                history: Vec::new(),
                last_call: None,
                active_requests: 0,
            })),
        }
    }

    pub async fn check_and_acquire(&self, limits: &AIUsageSettings, payload_bytes: usize) -> Result<RequestGuard, String> {
        let max_bytes = (limits.max_document_size_kb as usize) * 1024;
        if payload_bytes > max_bytes {
            return Err(format!(
                "Payload size ({} KB) exceeds maximum allowed limit ({} KB). Adjust limit in Settings > AI Usage.",
                payload_bytes / 1024,
                limits.max_document_size_kb
            ));
        }

        let mut lock = self.state.lock().await;

        if lock.active_requests >= limits.max_concurrent_requests {
            return Err(format!(
                "Concurrent request limit reached ({}/{}). Please wait for active requests to complete.",
                lock.active_requests, limits.max_concurrent_requests
            ));
        }

        let now = Instant::now();
        let one_hour_ago = now.checked_sub(Duration::from_secs(3600)).unwrap_or(now);
        lock.history.retain(|&t| t > one_hour_ago);

        if lock.history.len() >= limits.max_requests_per_hour as usize {
            return Err(format!(
                "Hourly rate limit reached ({}/{} requests per hour).",
                lock.history.len(),
                limits.max_requests_per_hour
            ));
        }

        if let Some(last) = lock.last_call {
            let elapsed_ms = now.duration_since(last).as_millis() as u64;
            if elapsed_ms < limits.min_request_delay_ms {
                let wait_ms = limits.min_request_delay_ms - elapsed_ms;
                tokio::time::sleep(Duration::from_millis(wait_ms)).await;
            }
        }

        let call_time = Instant::now();
        lock.last_call = Some(call_time);
        lock.history.push(call_time);
        lock.active_requests += 1;

        Ok(RequestGuard {
            state: self.state.clone(),
        })
    }
}

pub struct RequestGuard {
    state: Arc<Mutex<RateLimiterState>>,
}

impl Drop for RequestGuard {
    fn drop(&mut self) {
        let state = self.state.clone();
        tokio::spawn(async move {
            let mut lock = state.lock().await;
            if lock.active_requests > 0 {
                lock.active_requests -= 1;
            }
        });
    }
}
