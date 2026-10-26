use crate::ai::{ProviderType, UniversalAiClient};
use crate::config::{ConfigManager, ProviderStatus};
use crate::crypto::SecretVault;
use crate::interview::{InterviewAnswerEvaluation, InterviewQuestion};
use crate::job_match::{JobComparisonResult, JobMatcher, JobOfferInput};
use crate::mcp::McpProcessClient;
use crate::models::{AtsAnalysisResult, CoverLetterRequest, CoverLetterResult, McpTool, Resume};
use crate::security::{SecurityInspector, SecurityScanReport};
use crate::settings::{AIUsageSettings, PrivacySettings, SecuritySettings};
use crate::AppState;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionTestResult {
    pub success: bool,
    pub message: String,
    pub latency_ms: u64,
}

#[tauri::command]
pub async fn get_provider_status(state: State<'_, AppState>) -> Result<ProviderStatus, String> {
    let cfg = state.config.read().await;
    let (_, status) = ConfigManager::resolve_active_provider(&cfg);
    Ok(status)
}

#[tauri::command]
pub async fn save_provider_config(
    state: State<'_, AppState>,
    provider: ProviderType,
    api_key: Option<String>,
    model: String,
    base_url: Option<String>,
) -> Result<ProviderStatus, String> {
    let mut cfg = state.config.write().await;
    cfg.provider = provider.clone();
    cfg.active_model = Some(model.trim().to_string());
    cfg.custom_base_url = base_url.map(|u| u.trim().to_string()).filter(|u| !u.is_empty());

    let provider_vault_id = match provider {
        ProviderType::Gemini => "gemini",
        ProviderType::OpenAi => "openai",
        ProviderType::Claude => "claude",
        ProviderType::Custom => "custom",
        ProviderType::Ollama | ProviderType::LmStudio => "",
    };

    if !provider_vault_id.is_empty() {
        if let Some(key) = api_key {
            let clean = key.trim();
            if clean.is_empty() {
                let _ = SecretVault::remove_key(provider_vault_id);
            } else {
                SecretVault::set_key(provider_vault_id, clean)?;
            }
        }
    }

    ConfigManager::save_config(&cfg)?;
    let (_, status) = ConfigManager::resolve_active_provider(&cfg);
    Ok(status)
}

#[tauri::command]
pub async fn remove_provider_api_key(
    state: State<'_, AppState>,
    provider: ProviderType,
) -> Result<ProviderStatus, String> {
    let provider_vault_id = match provider {
        ProviderType::Gemini => "gemini",
        ProviderType::OpenAi => "openai",
        ProviderType::Claude => "claude",
        ProviderType::Custom => "custom",
        ProviderType::Ollama | ProviderType::LmStudio => "",
    };

    if !provider_vault_id.is_empty() {
        SecretVault::remove_key(provider_vault_id)?;
    }

    let cfg = state.config.read().await;
    let (_, status) = ConfigManager::resolve_active_provider(&cfg);
    Ok(status)
}

#[tauri::command]
pub async fn test_provider_connection(
    state: State<'_, AppState>,
    provider: ProviderType,
    api_key: Option<String>,
    model: Option<String>,
    base_url: Option<String>,
) -> Result<ConnectionTestResult, String> {
    let cfg = state.config.read().await;
    let (mut active_cfg, _) = ConfigManager::resolve_active_provider(&cfg);
    drop(cfg);

    active_cfg.provider = provider.clone();
    if let Some(m) = model {
        if !m.trim().is_empty() {
            active_cfg.model = m.trim().to_string();
        }
    }
    if let Some(u) = base_url {
        active_cfg.base_url = Some(u.trim().to_string()).filter(|s| !s.is_empty());
    }
    if let Some(k) = api_key {
        if !k.trim().is_empty() {
            active_cfg.api_key = Some(k.trim().to_string());
        }
    }

    let client = UniversalAiClient::new(active_cfg);
    match client.test_connection().await {
        Ok((latency_ms, message)) => Ok(ConnectionTestResult {
            success: true,
            message,
            latency_ms,
        }),
        Err(err) => Ok(ConnectionTestResult {
            success: false,
            message: err,
            latency_ms: 0,
        }),
    }
}

#[tauri::command]
pub async fn save_app_settings(
    state: State<'_, AppState>,
    theme: Option<String>,
    language: Option<String>,
) -> Result<(), String> {
    let mut cfg = state.config.write().await;
    if let Some(t) = theme {
        cfg.theme = Some(t);
    }
    if let Some(l) = language {
        cfg.language = Some(l);
    }
    ConfigManager::save_config(&cfg)?;
    Ok(())
}

#[tauri::command]
pub async fn save_security_settings(
    state: State<'_, AppState>,
    settings: SecuritySettings,
) -> Result<(), String> {
    let mut cfg = state.config.write().await;
    cfg.security = settings;
    ConfigManager::save_config(&cfg)?;
    Ok(())
}

#[tauri::command]
pub async fn save_privacy_settings(
    state: State<'_, AppState>,
    settings: PrivacySettings,
) -> Result<(), String> {
    let mut cfg = state.config.write().await;
    cfg.privacy = settings;
    ConfigManager::save_config(&cfg)?;
    Ok(())
}

#[tauri::command]
pub async fn save_ai_usage_settings(
    state: State<'_, AppState>,
    settings: AIUsageSettings,
) -> Result<(), String> {
    let mut cfg = state.config.write().await;
    cfg.ai_usage = settings;
    ConfigManager::save_config(&cfg)?;
    Ok(())
}

#[tauri::command]
pub async fn clear_cache() -> Result<(), String> {
    ConfigManager::clear_cache()
}

#[tauri::command]
pub async fn clear_temp_files() -> Result<(), String> {
    ConfigManager::clear_temp_files()
}

#[tauri::command]
pub async fn wipe_all_data() -> Result<(), String> {
    SecretVault::clear_all()?;
    ConfigManager::wipe_all_data()
}

#[tauri::command]
pub fn scan_security_text(text: String) -> SecurityScanReport {
    let (report, _) = SecurityInspector::inspect_text(&text);
    report
}

#[tauri::command]
pub async fn save_resume_profile(profile: Resume) -> Result<(), String> {
    ConfigManager::save_profile(&profile)
}

#[tauri::command]
pub async fn load_resume_profile() -> Result<Option<Resume>, String> {
    ConfigManager::load_profile()
}

#[tauri::command]
pub async fn analyze_resume_ats(
    state: State<'_, AppState>,
    profile: Resume,
    job_description: String,
) -> Result<AtsAnalysisResult, String> {
    if job_description.trim().is_empty() {
        return Err("La description de l'offre d'emploi ne peut pas être vide.".to_string());
    }

    let cfg = state.config.read().await;
    let (provider_cfg, status) = ConfigManager::resolve_active_provider(&cfg);
    let sec_settings = cfg.security.clone();
    let usage_settings = cfg.ai_usage.clone();
    drop(cfg);

    if !status.has_key && status.provider != ProviderType::Ollama && status.provider != ProviderType::LmStudio {
        return Err("Clé API manquante pour le fournisseur actif. Veuillez la renseigner dans les paramètres.".to_string());
    }

    let payload_size = serde_json::to_string(&profile).unwrap_or_default().len() + job_description.len();
    let _guard = state.rate_limiter.check_and_acquire(&usage_settings, payload_size).await?;

    let sanitized_job = if sec_settings.enable_document_sanitization {
        let (report, clean) = SecurityInspector::inspect_text(&job_description);
        if sec_settings.enable_prompt_injection_check && report.risk_level == "high" {
            return Err("Alerte Sécurité: Un schéma d'injection de prompt ou une directive malveillante a été détectée dans l'offre.".to_string());
        }
        clean
    } else {
        job_description
    };

    let client = UniversalAiClient::new(provider_cfg);
    let result = client
        .analyze_ats(&profile, &sanitized_job)
        .await
        .map_err(|e| format!("Erreur lors de l'audit ATS : {}", e))?;

    Ok(result)
}

#[tauri::command]
pub async fn generate_ats_cover_letter(
    state: State<'_, AppState>,
    request: CoverLetterRequest,
) -> Result<CoverLetterResult, String> {
    if request.job_description.trim().is_empty() {
        return Err("La description de l'offre d'emploi ne peut pas être vide.".to_string());
    }

    let cfg = state.config.read().await;
    let (provider_cfg, status) = ConfigManager::resolve_active_provider(&cfg);
    let usage_settings = cfg.ai_usage.clone();
    drop(cfg);

    if !status.has_key && status.provider != ProviderType::Ollama && status.provider != ProviderType::LmStudio {
        return Err("Clé API manquante pour le fournisseur actif. Veuillez la renseigner dans les paramètres.".to_string());
    }

    let payload_size = request.job_description.len() + serde_json::to_string(&request.profile).unwrap_or_default().len();
    let _guard = state.rate_limiter.check_and_acquire(&usage_settings, payload_size).await?;

    let client = UniversalAiClient::new(provider_cfg);
    let result = client
        .generate_cover_letter(&request)
        .await
        .map_err(|e| format!("Erreur lors de la génération de la lettre : {}", e))?;

    Ok(result)
}

#[tauri::command]
pub async fn generate_ai_resume(
    state: State<'_, AppState>,
    prompt: String,
    target_role: Option<String>,
    experience_level: Option<String>,
) -> Result<Resume, String> {
    if prompt.trim().is_empty() && target_role.as_deref().unwrap_or("").trim().is_empty() {
        return Err("Veuillez renseigner un intitulé de poste ou des consignes pour générer le CV.".to_string());
    }

    let cfg = state.config.read().await;
    let (provider_cfg, status) = ConfigManager::resolve_active_provider(&cfg);
    let usage_settings = cfg.ai_usage.clone();
    drop(cfg);

    if !status.has_key && status.provider != ProviderType::Ollama && status.provider != ProviderType::LmStudio {
        return Err("Clé API manquante pour le fournisseur actif. Veuillez la renseigner dans les paramètres.".to_string());
    }

    let payload_size = prompt.len() + target_role.as_deref().unwrap_or("").len();
    let _guard = state.rate_limiter.check_and_acquire(&usage_settings, payload_size).await?;

    let client = UniversalAiClient::new(provider_cfg);
    let result = client
        .generate_resume(&prompt, target_role.as_deref(), experience_level.as_deref())
        .await
        .map_err(|e| format!("Erreur lors de la génération du CV : {}", e))?;

    Ok(result)
}

#[tauri::command]
pub async fn parse_resume_from_raw_text(
    state: State<'_, AppState>,
    raw_text: String,
) -> Result<Resume, String> {
    if raw_text.trim().is_empty() {
        return Err("Le document ne contient aucun texte exploitable.".to_string());
    }

    let cfg = state.config.read().await;
    let (provider_cfg, status) = ConfigManager::resolve_active_provider(&cfg);
    let usage_settings = cfg.ai_usage.clone();
    drop(cfg);

    if !status.has_key && status.provider != ProviderType::Ollama && status.provider != ProviderType::LmStudio {
        return Err("Clé API requise pour analyser et structurer le CV importé.".to_string());
    }

    let payload_size = raw_text.len();
    let _guard = state.rate_limiter.check_and_acquire(&usage_settings, payload_size).await?;

    let client = UniversalAiClient::new(provider_cfg);
    let result = client
        .parse_resume_from_raw_text(&raw_text)
        .await
        .map_err(|e| format!("Erreur lors de l'analyse du CV : {}", e))?;

    Ok(result)
}

#[tauri::command]
pub async fn generate_interview_questions(
    state: State<'_, AppState>,
    profile: Resume,
    target_role: String,
    interview_type: String,
) -> Result<Vec<InterviewQuestion>, String> {
    let cfg = state.config.read().await;
    let (provider_cfg, status) = ConfigManager::resolve_active_provider(&cfg);
    let usage_settings = cfg.ai_usage.clone();
    drop(cfg);

    if !status.has_key && status.provider != ProviderType::Ollama && status.provider != ProviderType::LmStudio {
        return Err("Clé API manquante pour le fournisseur actif. Veuillez la renseigner dans les paramètres.".to_string());
    }

    let payload_size = serde_json::to_string(&profile).unwrap_or_default().len() + target_role.len();
    let _guard = state.rate_limiter.check_and_acquire(&usage_settings, payload_size).await?;

    let client = UniversalAiClient::new(provider_cfg);
    InterviewQuestion::generate_batch(&client, &profile, &target_role, &interview_type).await
}

#[tauri::command]
pub async fn evaluate_interview_answer(
    state: State<'_, AppState>,
    question: String,
    candidate_answer: String,
    profile: Resume,
) -> Result<InterviewAnswerEvaluation, String> {
    if candidate_answer.trim().is_empty() {
        return Err("La réponse du candidat ne peut pas être vide.".to_string());
    }

    let cfg = state.config.read().await;
    let (provider_cfg, status) = ConfigManager::resolve_active_provider(&cfg);
    let usage_settings = cfg.ai_usage.clone();
    drop(cfg);

    if !status.has_key && status.provider != ProviderType::Ollama && status.provider != ProviderType::LmStudio {
        return Err("Clé API manquante pour le fournisseur actif. Veuillez la renseigner dans les paramètres.".to_string());
    }

    let payload_size = question.len() + candidate_answer.len();
    let _guard = state.rate_limiter.check_and_acquire(&usage_settings, payload_size).await?;

    let client = UniversalAiClient::new(provider_cfg);
    InterviewQuestion::evaluate_candidate_answer(&client, &question, &candidate_answer, &profile).await
}

#[tauri::command]
pub async fn compare_multiple_jobs(
    state: State<'_, AppState>,
    profile: Resume,
    offers: Vec<JobOfferInput>,
) -> Result<JobComparisonResult, String> {
    let cfg = state.config.read().await;
    let (provider_cfg, status) = ConfigManager::resolve_active_provider(&cfg);
    let usage_settings = cfg.ai_usage.clone();
    drop(cfg);

    if !status.has_key && status.provider != ProviderType::Ollama && status.provider != ProviderType::LmStudio {
        return Err("Clé API manquante pour le fournisseur actif. Veuillez la renseigner dans les paramètres.".to_string());
    }

    let payload_size = serde_json::to_string(&profile).unwrap_or_default().len() + serde_json::to_string(&offers).unwrap_or_default().len();
    let _guard = state.rate_limiter.check_and_acquire(&usage_settings, payload_size).await?;

    let client = UniversalAiClient::new(provider_cfg);
    JobMatcher::compare(&client, &profile, offers).await
}

#[tauri::command]
pub async fn mcp_list_tools(command: String, args: Vec<String>) -> Result<Vec<McpTool>, String> {
    let mut client = McpProcessClient::spawn(&command, &args).await?;
    let tools = client.list_tools().await?;
    client.shutdown().await;
    Ok(tools)
}

#[tauri::command]
pub async fn mcp_call_tool(
    command: String,
    args: Vec<String>,
    tool_name: String,
    arguments: serde_json::Value,
) -> Result<serde_json::Value, String> {
    let mut client = McpProcessClient::spawn(&command, &args).await?;
    let result = client.call_tool(&tool_name, arguments).await?;
    client.shutdown().await;
    Ok(result)
}
