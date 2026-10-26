pub mod ai;
pub mod commands;
pub mod config;
pub mod crypto;
pub mod interview;
pub mod job_match;
pub mod mcp;
pub mod models;
pub mod security;
pub mod settings;

use config::{AppConfig, ConfigManager};
use settings::RateLimiter;
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct AppState {
    pub config: Arc<RwLock<AppConfig>>,
    pub rate_limiter: RateLimiter,
}

pub fn run() {
    let loaded_config = ConfigManager::load_config();
    let state = AppState {
        config: Arc::new(RwLock::new(loaded_config)),
        rate_limiter: RateLimiter::new(),
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            commands::get_provider_status,
            commands::save_provider_config,
            commands::remove_provider_api_key,
            commands::test_provider_connection,
            commands::save_app_settings,
            commands::save_security_settings,
            commands::save_privacy_settings,
            commands::save_ai_usage_settings,
            commands::clear_cache,
            commands::clear_temp_files,
            commands::wipe_all_data,
            commands::scan_security_text,
            commands::save_resume_profile,
            commands::load_resume_profile,
            commands::analyze_resume_ats,
            commands::generate_ats_cover_letter,
            commands::generate_ai_resume,
            commands::parse_resume_from_raw_text,
            commands::generate_interview_questions,
            commands::evaluate_interview_answer,
            commands::compare_multiple_jobs,
            commands::mcp_list_tools,
            commands::mcp_call_tool
        ])
        .run(tauri::generate_context!())
        .expect("Erreur lors du lancement de l'application OpenCV Tauri");
}
