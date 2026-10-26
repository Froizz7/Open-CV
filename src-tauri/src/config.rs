use crate::ai::{ProviderConfig, ProviderType};
use crate::crypto::SecretVault;
use crate::models::Resume;
use crate::settings::{AIUsageSettings, PrivacySettings, SecuritySettings};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub provider: ProviderType,
    #[serde(skip_serializing, default)]
    pub gemini_api_key: Option<String>,
    #[serde(skip_serializing, default)]
    pub openai_api_key: Option<String>,
    #[serde(skip_serializing, default)]
    pub claude_api_key: Option<String>,
    #[serde(skip_serializing, default)]
    pub custom_api_key: Option<String>,
    pub active_model: Option<String>,
    pub custom_base_url: Option<String>,
    pub default_tone: Option<String>,
    pub theme: Option<String>,
    pub language: Option<String>,
    #[serde(default)]
    pub security: SecuritySettings,
    #[serde(default)]
    pub privacy: PrivacySettings,
    #[serde(default)]
    pub ai_usage: AIUsageSettings,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            provider: ProviderType::Gemini,
            gemini_api_key: None,
            openai_api_key: None,
            claude_api_key: None,
            custom_api_key: None,
            active_model: Some("gemini-3.8-flash".to_string()),
            custom_base_url: None,
            default_tone: None,
            theme: Some("dark".to_string()),
            language: Some("en".to_string()),
            security: SecuritySettings::default(),
            privacy: PrivacySettings::default(),
            ai_usage: AIUsageSettings::default(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderStatus {
    pub provider: ProviderType,
    pub has_key: bool,
    pub source: String,
    pub masked_key: Option<String>,
    pub active_model: String,
    pub base_url: Option<String>,
    pub theme: String,
    pub language: String,
    pub configured_providers: Vec<ProviderType>,
    pub security: SecuritySettings,
    pub privacy: PrivacySettings,
    pub ai_usage: AIUsageSettings,
}

pub struct ConfigManager;

impl ConfigManager {
    pub fn get_app_dir() -> PathBuf {
        let base_dir = dirs::document_dir()
            .or_else(dirs::config_dir)
            .or_else(dirs::data_dir)
            .unwrap_or_else(|| PathBuf::from("."));
        let app_dir = base_dir.join("Open-CV");
        if !app_dir.exists() {
            let _ = fs::create_dir_all(&app_dir);
        }
        app_dir
    }

    fn config_file_path() -> PathBuf {
        Self::get_app_dir().join("config.json")
    }

    fn profile_file_path() -> PathBuf {
        Self::get_app_dir().join("cv_profile.json")
    }

    pub fn load_config() -> AppConfig {
        let path = Self::config_file_path();
        if path.exists() {
            if let Ok(content) = fs::read_to_string(&path) {
                if let Ok(mut config) = serde_json::from_str::<AppConfig>(&content) {
                    let mut migrated = false;
                    if let Some(k) = config.gemini_api_key.take() {
                        let _ = SecretVault::set_key("gemini", &k);
                        migrated = true;
                    }
                    if let Some(k) = config.openai_api_key.take() {
                        let _ = SecretVault::set_key("openai", &k);
                        migrated = true;
                    }
                    if let Some(k) = config.claude_api_key.take() {
                        let _ = SecretVault::set_key("claude", &k);
                        migrated = true;
                    }
                    if let Some(k) = config.custom_api_key.take() {
                        let _ = SecretVault::set_key("custom", &k);
                        migrated = true;
                    }
                    if migrated {
                        let _ = Self::save_config(&config);
                    }
                    return config;
                }
            }
        }
        AppConfig::default()
    }

    pub fn save_config(config: &AppConfig) -> Result<(), String> {
        let path = Self::config_file_path();
        let content = serde_json::to_string_pretty(config)
            .map_err(|e| format!("Serialization error: {}", e))?;
        fs::write(path, content).map_err(|e| format!("Failed to write config file: {}", e))?;
        Ok(())
    }

    pub fn list_configured_providers() -> Vec<ProviderType> {
        let mut list = Vec::new();
        if SecretVault::has_key("gemini") || std::env::var("GEMINI_API_KEY").is_ok() {
            list.push(ProviderType::Gemini);
        }
        if SecretVault::has_key("openai") || std::env::var("OPENAI_API_KEY").is_ok() {
            list.push(ProviderType::OpenAi);
        }
        if SecretVault::has_key("claude") || std::env::var("ANTHROPIC_API_KEY").is_ok() {
            list.push(ProviderType::Claude);
        }
        if SecretVault::has_key("custom") || std::env::var("CUSTOM_LLM_API_KEY").is_ok() {
            list.push(ProviderType::Custom);
        }
        list.push(ProviderType::Ollama);
        list.push(ProviderType::LmStudio);
        list
    }

    pub fn resolve_active_provider(config: &AppConfig) -> (ProviderConfig, ProviderStatus) {
        let current_theme = config.theme.clone().unwrap_or_else(|| "dark".to_string());
        let current_lang = config.language.clone().unwrap_or_else(|| "en".to_string());
        let configured = Self::list_configured_providers();

        match config.provider {
            ProviderType::Gemini => {
                let (key, src) = Self::resolve_key("gemini", "GEMINI_API_KEY");
                let model = config
                    .active_model
                    .clone()
                    .unwrap_or_else(|| "gemini-3.8-flash".to_string());
                (
                    ProviderConfig {
                        provider: ProviderType::Gemini,
                        api_key: key.clone(),
                        model: model.clone(),
                        base_url: None,
                    },
                    ProviderStatus {
                        provider: ProviderType::Gemini,
                        has_key: key.is_some(),
                        source: src.to_string(),
                        masked_key: key.as_deref().map(Self::mask_key),
                        active_model: model,
                        base_url: None,
                        theme: current_theme,
                        language: current_lang,
                        configured_providers: configured,
                        security: config.security.clone(),
                        privacy: config.privacy.clone(),
                        ai_usage: config.ai_usage.clone(),
                    },
                )
            }
            ProviderType::OpenAi => {
                let (key, src) = Self::resolve_key("openai", "OPENAI_API_KEY");
                let model = config
                    .active_model
                    .clone()
                    .unwrap_or_else(|| "gpt-6-astra".to_string());
                (
                    ProviderConfig {
                        provider: ProviderType::OpenAi,
                        api_key: key.clone(),
                        model: model.clone(),
                        base_url: None,
                    },
                    ProviderStatus {
                        provider: ProviderType::OpenAi,
                        has_key: key.is_some(),
                        source: src.to_string(),
                        masked_key: key.as_deref().map(Self::mask_key),
                        active_model: model,
                        base_url: None,
                        theme: current_theme,
                        language: current_lang,
                        configured_providers: configured,
                        security: config.security.clone(),
                        privacy: config.privacy.clone(),
                        ai_usage: config.ai_usage.clone(),
                    },
                )
            }
            ProviderType::Claude => {
                let (key, src) = Self::resolve_key("claude", "ANTHROPIC_API_KEY");
                let model = config
                    .active_model
                    .clone()
                    .unwrap_or_else(|| "claude-sonnet-5-5".to_string());
                (
                    ProviderConfig {
                        provider: ProviderType::Claude,
                        api_key: key.clone(),
                        model: model.clone(),
                        base_url: None,
                    },
                    ProviderStatus {
                        provider: ProviderType::Claude,
                        has_key: key.is_some(),
                        source: src.to_string(),
                        masked_key: key.as_deref().map(Self::mask_key),
                        active_model: model,
                        base_url: None,
                        theme: current_theme,
                        language: current_lang,
                        configured_providers: configured,
                        security: config.security.clone(),
                        privacy: config.privacy.clone(),
                        ai_usage: config.ai_usage.clone(),
                    },
                )
            }
            ProviderType::Ollama => {
                let model = config
                    .active_model
                    .clone()
                    .unwrap_or_else(|| "llama3.3:latest".to_string());
                let url = config
                    .custom_base_url
                    .clone()
                    .unwrap_or_else(|| "http://localhost:11434/v1".to_string());
                (
                    ProviderConfig {
                        provider: ProviderType::Ollama,
                        api_key: None,
                        model: model.clone(),
                        base_url: Some(url.clone()),
                    },
                    ProviderStatus {
                        provider: ProviderType::Ollama,
                        has_key: true,
                        source: "local".to_string(),
                        masked_key: None,
                        active_model: model,
                        base_url: Some(url),
                        theme: current_theme,
                        language: current_lang,
                        configured_providers: configured,
                        security: config.security.clone(),
                        privacy: config.privacy.clone(),
                        ai_usage: config.ai_usage.clone(),
                    },
                )
            }
            ProviderType::LmStudio => {
                let model = config
                    .active_model
                    .clone()
                    .unwrap_or_else(|| "local-model".to_string());
                let url = config
                    .custom_base_url
                    .clone()
                    .unwrap_or_else(|| "http://localhost:1234/v1".to_string());
                (
                    ProviderConfig {
                        provider: ProviderType::LmStudio,
                        api_key: None,
                        model: model.clone(),
                        base_url: Some(url.clone()),
                    },
                    ProviderStatus {
                        provider: ProviderType::LmStudio,
                        has_key: true,
                        source: "local".to_string(),
                        masked_key: None,
                        active_model: model,
                        base_url: Some(url),
                        theme: current_theme,
                        language: current_lang,
                        configured_providers: configured,
                        security: config.security.clone(),
                        privacy: config.privacy.clone(),
                        ai_usage: config.ai_usage.clone(),
                    },
                )
            }
            ProviderType::Custom => {
                let (key, src) = Self::resolve_key("custom", "CUSTOM_LLM_API_KEY");
                let model = config
                    .active_model
                    .clone()
                    .unwrap_or_else(|| "custom-model".to_string());
                let url = config
                    .custom_base_url
                    .clone()
                    .unwrap_or_else(|| "http://localhost:8000/v1".to_string());
                (
                    ProviderConfig {
                        provider: ProviderType::Custom,
                        api_key: key.clone(),
                        model: model.clone(),
                        base_url: Some(url.clone()),
                    },
                    ProviderStatus {
                        provider: ProviderType::Custom,
                        has_key: key.is_some(),
                        source: src.to_string(),
                        masked_key: key.as_deref().map(Self::mask_key),
                        active_model: model,
                        base_url: Some(url),
                        theme: current_theme,
                        language: current_lang,
                        configured_providers: configured,
                        security: config.security.clone(),
                        privacy: config.privacy.clone(),
                        ai_usage: config.ai_usage.clone(),
                    },
                )
            }
        }
    }

    fn resolve_key(vault_id: &str, env_name: &str) -> (Option<String>, &'static str) {
        if let Some(k) = SecretVault::get_key(vault_id) {
            if !k.trim().is_empty() {
                return (Some(k.trim().to_string()), "vault");
            }
        }
        if let Ok(env_k) = std::env::var(env_name) {
            if !env_k.trim().is_empty() {
                return (Some(env_k.trim().to_string()), "env");
            }
        }
        (None, "none")
    }

    pub fn mask_key(key: &str) -> String {
        let trimmed = key.trim();
        if trimmed.len() <= 6 {
            "********".to_string()
        } else {
            let start = &trimmed[..3];
            let end = &trimmed[trimmed.len() - 2..];
            format!("{}********{}", start, end)
        }
    }

    pub fn save_profile(profile: &Resume) -> Result<(), String> {
        let path = Self::profile_file_path();
        let content = serde_json::to_string_pretty(profile)
            .map_err(|e| format!("Profile serialization error: {}", e))?;
        fs::write(path, content).map_err(|e| format!("Failed to save profile: {}", e))?;
        Ok(())
    }

    pub fn load_profile() -> Result<Option<Resume>, String> {
        let path = Self::profile_file_path();
        if !path.exists() {
            return Ok(None);
        }
        let content = fs::read_to_string(&path)
            .map_err(|e| format!("Failed to read profile: {}", e))?;
        let profile = serde_json::from_str::<Resume>(&content)
            .map_err(|e| format!("Invalid profile format: {}", e))?;
        Ok(Some(profile))
    }

    pub fn clear_cache() -> Result<(), String> {
        let cache_dir = Self::get_app_dir().join("cache");
        if cache_dir.exists() {
            let _ = fs::remove_dir_all(&cache_dir);
        }
        let _ = fs::create_dir_all(&cache_dir);
        Ok(())
    }

    pub fn clear_temp_files() -> Result<(), String> {
        let temp_dir = Self::get_app_dir().join("temp");
        if temp_dir.exists() {
            let _ = fs::remove_dir_all(&temp_dir);
        }
        let _ = fs::create_dir_all(&temp_dir);
        Ok(())
    }

    pub fn wipe_all_data() -> Result<(), String> {
        let app_dir = Self::get_app_dir();
        if app_dir.exists() {
            let _ = fs::remove_dir_all(&app_dir);
        }
        let _ = fs::create_dir_all(&app_dir);
        Ok(())
    }
}
