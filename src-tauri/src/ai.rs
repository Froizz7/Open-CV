use crate::models::{
    AtsAnalysisResult, CoverLetterRequest, CoverLetterResult, GeminiApiResponse,
    GeminiContent, GeminiGenerateContentPayload, GeminiGenerationConfig, GeminiPart,
    GeminiSystemInstruction, Resume,
};
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::time::Duration;
use thiserror::Error;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum ProviderType {
    Gemini,
    OpenAi,
    Claude,
    Ollama,
    LmStudio,
    Custom,
}

impl Default for ProviderType {
    fn default() -> Self {
        ProviderType::Gemini
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderConfig {
    pub provider: ProviderType,
    pub api_key: Option<String>,
    pub model: String,
    pub base_url: Option<String>,
}

impl Default for ProviderConfig {
    fn default() -> Self {
        Self {
            provider: ProviderType::Gemini,
            api_key: None,
            model: "gemini-3.8-flash".to_string(),
            base_url: None,
        }
    }
}

#[derive(Error, Debug)]
pub enum AiError {
    #[error("Clé d'API manquante pour le fournisseur sélectionné ({0}).")]
    MissingApiKey(String),

    #[error("Erreur réseau lors de l'appel LLM: {0}")]
    Network(#[from] reqwest::Error),

    #[error("Le fournisseur LLM a retourné une erreur ({code}): {message}")]
    Api { code: i32, message: String },

    #[error("Réponse vide ou invalide du modèle")]
    EmptyResponse,

    #[error("Échec du décodage JSON de la réponse : {0}. Contenu brut: {1}")]
    JsonParse(serde_json::Error, String),
}

pub const ATS_SYSTEM_PROMPT: &str = r#"Tu es le moteur d'analyse ATS (Applicant Tracking System) et Recruteur Technique Senior de référence.
Ton rôle est d'analyser rigoureusement le profil d'un candidat (fourni au format JSON standard) face à une offre d'emploi ciblée.

DIRECTIVES D'ANALYSE ATS :
1. Parsing & Extraction : Analyse les compétences techniques, méthodologies, outils, certifications et années d'expérience requises par l'offre.
2. Détection de Mots-clés :
   - matched_keywords : Les termes précis de l'offre présents explicitement dans le profil.
   - missing_keywords : Les termes clés essentiels de l'offre absents ou mal formulés dans le profil.
3. Scoring objectif (overall_score entre 0 et 100) :
   - 90-100 : Correspondance quasi-parfaite, mots-clés validés, fort impact mesurable.
   - 75-89  : Bonne adéquation, quelques termes secondaires manquants.
   - 60-74  : Profil pertinent mais manque de quantification ou alignement partiel.
   - < 60   : Écarts majeurs sur les compétences requises.
4. Suggestions STAR (Situation, Tâche, Action, Résultat) :
   - Identifie 3 à 5 descriptions ou puces d'expérience actuelles trop passives ou vagues.
   - Reformule-les selon le standard STAR avec verbes d'action percutants et métriques d'impact chiffrées (ex: réduction de latence %, augmentation de CA, volume d'utilisateurs).
5. Critique par section (Score /100 + conseils précis) pour l'expérience, les compétences, la formation et la mise en page ATS.

RÈGLE ABSOLUE : Réponds STRICTEMENT par un objet JSON valide conforme au schéma, sans AUCUN markdown additionnel (pas de ```json)."#;

pub const RESUME_GENERATOR_SYSTEM_PROMPT: &str = r#"You are an executive resume writer and ATS specialist.
Generate a comprehensive, highly impactful, ATS-optimized resume profile in valid JSON strictly matching the schema:
{
  "basics": {
    "name": "Full Name",
    "label": "Target Job Title",
    "email": "email@example.com",
    "phone": "+1 234 567 8900",
    "url": "https://linkedin.com/in/username",
    "image": "",
    "summary": "Punchy professional summary with metrics and core expertise",
    "location": { "city": "City", "countryCode": "Country", "region": "Region" }
  },
  "work": [
    {
      "name": "Company Name",
      "position": "Job Title",
      "url": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "summary": "Key mission scope",
      "highlights": ["STAR accomplishment with concrete quantified metrics", "STAR bullet 2", "STAR bullet 3"]
    }
  ],
  "education": [
    {
      "institution": "University / School",
      "area": "Major / Field",
      "studyType": "Degree (e.g. Master, Bachelor)",
      "startDate": "YYYY",
      "endDate": "YYYY"
    }
  ],
  "skills": [
    { "name": "Category (e.g. Technical Skills, Languages, Methodologies)", "keywords": ["Keyword1", "Keyword2"] }
  ]
}
RESPOND EXCLUSIVELY WITH A VALID JSON OBJECT MATCHING THIS SCHEMA, NO MARKDOWN TICKS."#;

pub const COVER_LETTER_SYSTEM_PROMPT: &str = r#"Tu es un expert en recrutement exécutif et en rédaction de candidatures à fort impact.
Ton rôle est de générer une lettre de motivation percutante, moderne, ultra-ciblée et optimisée pour franchir les filtres ATS.

DIRECTIVES DE RÉDACTION :
1. Accroche percutante : Dès l'introduction, établir un pont clair entre le candidat et le besoin stratégique de l'entreprise.
2. Argumentation par la preuve : Valoriser 2 ou 3 réalisations concrètes avec des résultats quantifiés alignés avec l'offre.
3. Culture & Valeur ajoutée : Montrer la compréhension des enjeux du poste sans tomber dans les banalités.
4. Clôture proactive : Appel à l'action invitant à l'entretien.
5. Version full_markdown prête à l'envoi.

RÈGLE ABSOLUE : Réponds STRICTEMENT par un objet JSON valide conforme au schéma, sans markdown d'encadrement."#;

pub struct UniversalAiClient {
    client: reqwest::Client,
    config: ProviderConfig,
}

impl UniversalAiClient {
    pub fn new(config: ProviderConfig) -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(60))
            .build()
            .unwrap_or_default();

        Self { client, config }
    }

    pub async fn analyze_ats(
        &self,
        resume: &Resume,
        job_description: &str,
    ) -> Result<AtsAnalysisResult, AiError> {
        let resume_json = serde_json::to_string_pretty(resume).unwrap_or_default();
        let prompt = format!(
            "### PROFIL DU CANDIDAT (JSON RESUME) :\n{}\n\n### DESCRIPTION DU POSTE CIBLÉ :\n{}\n\nEffectue l'audit ATS complet et génère le rapport JSON structuré.",
            resume_json, job_description
        );

        let schema = json!({
            "type": "object",
            "properties": {
                "overall_score": { "type": "integer" },
                "summary": { "type": "string" },
                "matched_keywords": { "type": "array", "items": { "type": "string" } },
                "missing_keywords": { "type": "array", "items": { "type": "string" } },
                "star_improvements": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "original_text": { "type": "string" },
                            "improved_text": { "type": "string" },
                            "impact_metric": { "type": "string" },
                            "rationale": { "type": "string" }
                        },
                        "required": ["original_text", "improved_text", "impact_metric", "rationale"]
                    }
                },
                "strengths": { "type": "array", "items": { "type": "string" } },
                "weaknesses": { "type": "array", "items": { "type": "string" } },
                "section_critique": {
                    "type": "object",
                    "properties": {
                        "experience_score": { "type": "integer" },
                        "experience_feedback": { "type": "string" },
                        "skills_score": { "type": "integer" },
                        "skills_feedback": { "type": "string" },
                        "education_score": { "type": "integer" },
                        "education_feedback": { "type": "string" },
                        "formatting_score": { "type": "integer" },
                        "formatting_feedback": { "type": "string" }
                    },
                    "required": [
                        "experience_score", "experience_feedback",
                        "skills_score", "skills_feedback",
                        "education_score", "education_feedback",
                        "formatting_score", "formatting_feedback"
                    ]
                }
            },
            "required": [
                "overall_score", "summary", "matched_keywords", "missing_keywords",
                "star_improvements", "strengths", "weaknesses", "section_critique"
            ]
        });

        let raw_json = self.execute_prompt(ATS_SYSTEM_PROMPT, &prompt, Some(schema)).await?;
        let parsed: AtsAnalysisResult = serde_json::from_str(&raw_json)
            .map_err(|e| AiError::JsonParse(e, raw_json))?;

        Ok(parsed)
    }

    pub async fn generate_cover_letter(
        &self,
        req: &CoverLetterRequest,
    ) -> Result<CoverLetterResult, AiError> {
        let resume_json = serde_json::to_string_pretty(&req.profile).unwrap_or_default();
        let tone = req.tone.as_deref().unwrap_or("professionnel et percutant");
        let custom = req.custom_instructions.as_deref().unwrap_or("Aucune consigne");

        let prompt = format!(
            "### PROFIL DU CANDIDAT :\n{}\n\n### OFFRE D'EMPLOI :\n{}\n\n### TON : {}\n### CONSIGNES : {}\n\nRédige la lettre de motivation sur-mesure au format structuré JSON.",
            resume_json, req.job_description, tone, custom
        );

        let schema = json!({
            "type": "object",
            "properties": {
                "salutation": { "type": "string" },
                "intro": { "type": "string" },
                "body_paragraphs": { "type": "array", "items": { "type": "string" } },
                "conclusion": { "type": "string" },
                "sign_off": { "type": "string" },
                "full_markdown": { "type": "string" }
            },
            "required": ["salutation", "intro", "body_paragraphs", "conclusion", "sign_off", "full_markdown"]
        });

        let raw_json = self.execute_prompt(COVER_LETTER_SYSTEM_PROMPT, &prompt, Some(schema)).await?;
        let parsed: CoverLetterResult = serde_json::from_str(&raw_json)
            .map_err(|e| AiError::JsonParse(e, raw_json))?;

        Ok(parsed)
    }

    pub async fn generate_resume(
        &self,
        prompt: &str,
        target_role: Option<&str>,
        experience_level: Option<&str>,
    ) -> Result<Resume, AiError> {
        let user_prompt = format!(
            "Instructions for resume:\n{}\nTarget Role: {}\nExperience Level: {}\nReturn a complete, professional, realistic, ATS-optimized resume matching the JSON schema.",
            prompt,
            target_role.unwrap_or("Professional"),
            experience_level.unwrap_or("Senior")
        );

        let raw_json = self
            .execute_prompt(RESUME_GENERATOR_SYSTEM_PROMPT, &user_prompt, None)
            .await?;

        let parsed: Resume = serde_json::from_str(&raw_json)
            .map_err(|e| AiError::JsonParse(e, raw_json))?;

        Ok(parsed)
    }

    pub async fn parse_resume_from_raw_text(&self, raw_text: &str) -> Result<Resume, AiError> {
        let user_prompt = format!(
            "Parse the following resume text into a strictly valid JSON matching the Resume schema:\n\n{}\n\nReturn ONLY the JSON structure.",
            raw_text
        );

        let raw_json = self
            .execute_prompt(RESUME_GENERATOR_SYSTEM_PROMPT, &user_prompt, None)
            .await?;

        let parsed: Resume = serde_json::from_str(&raw_json)
            .map_err(|e| AiError::JsonParse(e, raw_json))?;

        Ok(parsed)
    }

    pub async fn call_chat(&self, system: &str, user: &str) -> Result<String, AiError> {
        self.execute_prompt(system, user, None).await
    }

    pub async fn test_connection(&self) -> Result<(u64, String), String> {
        let start = std::time::Instant::now();
        let ping_prompt = "Output {\"status\": \"ok\"}";
        let res = self.execute_prompt("You are a test agent. Output strictly JSON.", ping_prompt, None).await;
        let latency = start.elapsed().as_millis() as u64;
        match res {
            Ok(_) => Ok((latency, format!("Connected successfully in {} ms", latency))),
            Err(e) => {
                let err_str = e.to_string();
                let sanitized = if err_str.contains("401") || err_str.contains("403") {
                    "Authentification échouée : clé API invalide ou non autorisée.".to_string()
                } else if err_str.contains("404") {
                    "Modèle introuvable ou point de terminaison inaccessible.".to_string()
                } else {
                    format!("Échec de connexion : {}", err_str)
                };
                Err(sanitized)
            }
        }
    }

    async fn execute_prompt(
        &self,
        system: &str,
        user: &str,
        schema: Option<serde_json::Value>,
    ) -> Result<String, AiError> {
        match self.config.provider {
            ProviderType::Gemini => self.call_gemini(system, user, schema).await,
            ProviderType::OpenAi => self.call_openai_compatible(system, user, None).await,
            ProviderType::Claude => self.call_claude(system, user).await,
            ProviderType::Ollama => {
                let default_url = "http://localhost:11434/v1".to_string();
                self.call_openai_compatible(system, user, Some(&default_url)).await
            }
            ProviderType::LmStudio => {
                let default_url = "http://localhost:1234/v1".to_string();
                self.call_openai_compatible(system, user, Some(&default_url)).await
            }
            ProviderType::Custom => self.call_openai_compatible(system, user, None).await,
        }
    }

    async fn call_gemini(
        &self,
        system: &str,
        user: &str,
        schema: Option<serde_json::Value>,
    ) -> Result<String, AiError> {
        let api_key = self
            .config
            .api_key
            .as_deref()
            .filter(|k| !k.trim().is_empty())
            .ok_or_else(|| AiError::MissingApiKey("Google Gemini".to_string()))?;

        let model = if self.config.model.trim().is_empty() {
            "gemini-3.8-flash"
        } else {
            &self.config.model
        };

        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
            model, api_key
        );

        let payload = GeminiGenerateContentPayload {
            contents: vec![GeminiContent {
                role: Some("user".to_string()),
                parts: vec![GeminiPart {
                    text: Some(user.to_string()),
                    thought: None,
                }],
            }],
            system_instruction: Some(GeminiSystemInstruction {
                parts: vec![GeminiPart {
                    text: Some(system.to_string()),
                    thought: None,
                }],
            }),
            generation_config: Some(GeminiGenerationConfig {
                response_mime_type: "application/json".to_string(),
                response_schema: schema,
                temperature: Some(0.2),
            }),
        };

        let resp = self.client.post(&url).json(&payload).send().await?;
        let status = resp.status();
        let body = resp.text().await?;

        if !status.is_success() {
            return Err(AiError::Api {
                code: status.as_u16() as i32,
                message: body,
            });
        }

        let parsed: GeminiApiResponse = serde_json::from_str(&body)
            .map_err(|e| AiError::JsonParse(e, body.clone()))?;

        let text = parsed
            .candidates
            .as_ref()
            .and_then(|candidates| candidates.first())
            .and_then(|c| c.content.as_ref())
            .map(|content| {
                content
                    .parts
                    .iter()
                    .filter_map(|p| p.text.as_deref())
                    .collect::<Vec<&str>>()
                    .join("\n")
            })
            .filter(|t| !t.trim().is_empty())
            .ok_or(AiError::EmptyResponse)?;

        Ok(extract_json_payload(&text))
    }

    async fn call_openai_compatible(
        &self,
        system: &str,
        user: &str,
        fallback_base_url: Option<&str>,
    ) -> Result<String, AiError> {
        let base_url = self
            .config
            .base_url
            .as_deref()
            .or(fallback_base_url)
            .unwrap_or("https://api.openai.com/v1");

        let endpoint = format!("{}/chat/completions", base_url.trim_end_matches('/'));

        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

        if let Some(ref key) = self.config.api_key {
            if !key.trim().is_empty() {
                if let Ok(val) = HeaderValue::from_str(&format!("Bearer {}", key.trim())) {
                    headers.insert(AUTHORIZATION, val);
                }
            }
        }

        let model = if self.config.model.trim().is_empty() {
            match self.config.provider {
                ProviderType::Ollama => "llama3.3:latest",
                ProviderType::LmStudio => "local-model",
                _ => "gpt-4o-mini",
            }
        } else {
            &self.config.model
        };

        let payload = json!({
            "model": model,
            "messages": [
                { "role": "system", "content": system },
                { "role": "user", "content": user }
            ],
            "response_format": { "type": "json_object" },
            "temperature": 0.2
        });

        let resp = self.client.post(&endpoint).headers(headers).json(&payload).send().await?;
        let status = resp.status();
        let body = resp.text().await?;

        if !status.is_success() {
            return Err(AiError::Api {
                code: status.as_u16() as i32,
                message: body,
            });
        }

        let json_resp: serde_json::Value = serde_json::from_str(&body)
            .map_err(|e| AiError::JsonParse(e, body.clone()))?;

        let text = json_resp
            .get("choices")
            .and_then(|c| c.get(0))
            .and_then(|c0| c0.get("message"))
            .and_then(|m| m.get("content"))
            .and_then(|cnt| cnt.as_str())
            .ok_or(AiError::EmptyResponse)?;

        Ok(extract_json_payload(text))
    }

    async fn call_claude(&self, system: &str, user: &str) -> Result<String, AiError> {
        let api_key = self
            .config
            .api_key
            .as_deref()
            .filter(|k| !k.trim().is_empty())
            .ok_or_else(|| AiError::MissingApiKey("Anthropic Claude".to_string()))?;

        let model = if self.config.model.trim().is_empty() {
            "claude-sonnet-5-5"
        } else {
            &self.config.model
        };

        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
        headers.insert("x-api-key", HeaderValue::from_str(api_key.trim()).map_err(|_| AiError::MissingApiKey("Invalide".into()))?);
        headers.insert("anthropic-version", HeaderValue::from_static("2023-06-01"));

        let payload = json!({
            "model": model,
            "max_tokens": 4096,
            "system": format!("{}\n\nRÈGLE STRICTE : Réponds EXCLUSIVEMENT par un objet JSON valide conforme aux directives, sans aucun mot ou markdown avant ou après.", system),
            "messages": [
                { "role": "user", "content": user }
            ],
            "temperature": 0.2
        });

        let resp = self
            .client
            .post("https://api.anthropic.com/v1/messages")
            .headers(headers)
            .json(&payload)
            .send()
            .await?;

        let status = resp.status();
        let body = resp.text().await?;

        if !status.is_success() {
            return Err(AiError::Api {
                code: status.as_u16() as i32,
                message: body,
            });
        }

        let json_resp: serde_json::Value = serde_json::from_str(&body)
            .map_err(|e| AiError::JsonParse(e, body.clone()))?;

        let text = json_resp
            .get("content")
            .and_then(|c| c.as_array())
            .and_then(|arr| arr.iter().find_map(|item| item.get("text").and_then(|t| t.as_str())))
            .ok_or(AiError::EmptyResponse)?;

        Ok(extract_json_payload(text))
    }
}

pub fn extract_json_payload(input: &str) -> String {
    let trimmed = input.trim();
    if let Some(start_idx) = trimmed.find("```") {
        let after = &trimmed[start_idx + 3..];
        let content_start = if let Some(newline_idx) = after.find('\n') {
            newline_idx + 1
        } else {
            0
        };
        let body = &after[content_start..];
        if let Some(end_idx) = body.rfind("```") {
            return body[..end_idx].trim().to_string();
        }
    }

    if let (Some(first), Some(last)) = (trimmed.find('{'), trimmed.rfind('}')) {
        if last > first {
            return trimmed[first..=last].trim().to_string();
        }
    }

    trimmed.to_string()
}
