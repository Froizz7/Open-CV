use serde::de::{self, Deserializer};
use serde::{Deserialize, Serialize};
use serde_json::Value;

pub fn deserialize_flexible_u32<'de, D>(deserializer: D) -> Result<u32, D::Error>
where
    D: Deserializer<'de>,
{
    let val = Value::deserialize(deserializer)?;
    match val {
        Value::Number(n) => {
            if let Some(u) = n.as_u64() {
                Ok(u as u32)
            } else if let Some(f) = n.as_f64() {
                Ok(f.round() as u32)
            } else {
                Ok(0)
            }
        }
        Value::String(s) => s.trim().parse::<u32>().map_err(de::Error::custom),
        _ => Ok(0),
    }
}


#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Resume {
    pub basics: Basics,
    #[serde(default)]
    pub work: Vec<WorkExperience>,
    #[serde(default)]
    pub education: Vec<Education>,
    #[serde(default)]
    pub skills: Vec<SkillGroup>,
    #[serde(default)]
    pub projects: Vec<Project>,
    #[serde(default)]
    pub section_order: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Basics {
    pub name: String,
    pub label: String,
    pub email: String,
    pub phone: String,
    #[serde(default)]
    pub url: String,
    pub summary: String,
    pub location: Location,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Location {
    #[serde(default)]
    pub city: String,
    #[serde(default)]
    pub country_code: String,
    #[serde(default)]
    pub region: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct WorkExperience {
    pub name: String,
    pub position: String,
    #[serde(default)]
    pub url: String,
    pub start_date: String,
    #[serde(default)]
    pub end_date: String,
    pub summary: String,
    #[serde(default)]
    pub highlights: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Education {
    pub institution: String,
    pub area: String,
    pub study_type: String,
    pub start_date: String,
    #[serde(default)]
    pub end_date: String,
    #[serde(default)]
    pub score: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SkillGroup {
    pub name: String,
    #[serde(default)]
    pub level: String,
    #[serde(default)]
    pub keywords: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub name: String,
    pub description: String,
    #[serde(default)]
    pub highlights: Vec<String>,
    #[serde(default)]
    pub keywords: Vec<String>,
    #[serde(default)]
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AtsAnalysisResult {
    #[serde(default, deserialize_with = "deserialize_flexible_u32")]
    pub overall_score: u32,
    #[serde(default)]
    pub summary: String,
    #[serde(default)]
    pub matched_keywords: Vec<String>,
    #[serde(default)]
    pub missing_keywords: Vec<String>,
    #[serde(default)]
    pub star_improvements: Vec<StarImprovement>,
    #[serde(default)]
    pub strengths: Vec<String>,
    #[serde(default)]
    pub weaknesses: Vec<String>,
    #[serde(default)]
    pub section_critique: SectionCritique,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct StarImprovement {
    #[serde(default)]
    pub original_text: String,
    #[serde(default)]
    pub improved_text: String,
    #[serde(default)]
    pub impact_metric: String,
    #[serde(default)]
    pub rationale: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SectionCritique {
    #[serde(default, deserialize_with = "deserialize_flexible_u32")]
    pub experience_score: u32,
    #[serde(default)]
    pub experience_feedback: String,
    #[serde(default, deserialize_with = "deserialize_flexible_u32")]
    pub skills_score: u32,
    #[serde(default)]
    pub skills_feedback: String,
    #[serde(default, deserialize_with = "deserialize_flexible_u32")]
    pub education_score: u32,
    #[serde(default)]
    pub education_feedback: String,
    #[serde(default, deserialize_with = "deserialize_flexible_u32")]
    pub formatting_score: u32,
    #[serde(default)]
    pub formatting_feedback: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CoverLetterRequest {
    pub profile: Resume,
    pub job_description: String,
    #[serde(default)]
    pub company_name: Option<String>,
    #[serde(default)]
    pub hiring_manager: Option<String>,
    #[serde(default)]
    pub tone: Option<String>,
    #[serde(default)]
    pub custom_instructions: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CoverLetterResult {
    #[serde(default)]
    pub salutation: String,
    #[serde(default)]
    pub intro: String,
    #[serde(default)]
    pub body_paragraphs: Vec<String>,
    #[serde(default)]
    pub conclusion: String,
    #[serde(default)]
    pub sign_off: String,
    #[serde(default)]
    pub full_markdown: String,
}

#[derive(Debug, Serialize)]
pub struct GeminiGenerateContentPayload {
    pub contents: Vec<GeminiContent>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system_instruction: Option<GeminiSystemInstruction>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub generation_config: Option<GeminiGenerationConfig>,
}

#[derive(Debug, Serialize)]
pub struct GeminiSystemInstruction {
    pub parts: Vec<GeminiPart>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeminiContent {
    pub parts: Vec<GeminiPart>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct GeminiPart {
    #[serde(default)]
    pub text: Option<String>,
    #[serde(default)]
    pub thought: Option<serde_json::Value>,
}

#[derive(Debug, Serialize)]
pub struct GeminiGenerationConfig {
    pub response_mime_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub response_schema: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f32>,
}

#[derive(Debug, Deserialize)]
pub struct GeminiApiResponse {
    pub candidates: Option<Vec<GeminiCandidate>>,
    pub error: Option<GeminiApiErrorDetail>,
}

#[derive(Debug, Deserialize)]
pub struct GeminiCandidate {
    pub content: Option<GeminiCandidateContent>,
    #[serde(rename = "finishReason")]
    pub finish_reason: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct GeminiCandidateContent {
    pub parts: Vec<GeminiPart>,
}

#[derive(Debug, Deserialize)]
pub struct GeminiApiErrorDetail {
    pub code: i32,
    pub message: String,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcRequest {
    pub jsonrpc: String,
    pub id: u64,
    pub method: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub params: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcResponse {
    pub jsonrpc: String,
    pub id: Option<u64>,
    pub result: Option<serde_json::Value>,
    pub error: Option<JsonRpcError>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcError {
    pub code: i64,
    pub message: String,
    pub data: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpTool {
    pub name: String,
    pub description: Option<String>,
    #[serde(rename = "inputSchema")]
    pub input_schema: Option<serde_json::Value>,
}
