use crate::ai::UniversalAiClient;
use crate::models::Resume;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InterviewQuestion {
    pub id: u32,
    pub question: String,
    pub category: String,
    pub context: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InterviewAnswerEvaluation {
    pub score: u32,
    pub strengths: Vec<String>,
    pub improvements: Vec<String>,
    pub suggested_reformulation: String,
    pub pedagogy_notes: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InterviewSessionState {
    pub questions: Vec<InterviewQuestion>,
    pub current_index: usize,
    pub answers: Vec<String>,
    pub evaluations: Vec<InterviewAnswerEvaluation>,
    pub is_completed: bool,
}

impl InterviewQuestion {
    pub async fn generate_batch(
        client: &UniversalAiClient,
        profile: &Resume,
        target_role: &str,
        interview_type: &str,
    ) -> Result<Vec<InterviewQuestion>, String> {
        let resume_json = serde_json::to_string(profile).unwrap_or_default();
        let prompt = format!(
            "Génère une liste de 5 questions d'entretien pertinentes pour un candidat visant le poste '{}'. Type d'entretien : '{}'.\nProfil candidat : {}\n\nRéponds STRICTEMENT par un tableau JSON commençant par '[' et finissant par ']' :\n[\n  {{\"id\": 1, \"question\": \"...\", \"category\": \"...\", \"context\": \"...\"}}\n]",
            target_role, interview_type, resume_json
        );

        let system_prompt = "Tu es un recruteur senior expert en entretiens techniques et comportementaux. Tu réponds UNIQUEMENT par un tableau JSON valide au format [ { ... } ]. Aucun commentaire ou texte hors JSON.";
        let raw_response = client.call_chat(system_prompt, &prompt).await.map_err(|e| e.to_string())?;

        Self::parse_questions_robust(&raw_response)
    }

    pub fn parse_questions_robust(raw: &str) -> Result<Vec<InterviewQuestion>, String> {
        let cleaned = Self::clean_json_str(raw);

        if let Ok(list) = serde_json::from_str::<Vec<InterviewQuestion>>(&cleaned) {
            if !list.is_empty() {
                return Ok(list);
            }
        }

        let wrapped = format!("[{}]", cleaned);
        if let Ok(list) = serde_json::from_str::<Vec<InterviewQuestion>>(&wrapped) {
            if !list.is_empty() {
                return Ok(list);
            }
        }

        if let Ok(val) = serde_json::from_str::<serde_json::Value>(&cleaned) {
            if let Some(arr) = val.get("questions")
                .or_else(|| val.get("items"))
                .or_else(|| val.get("interview_questions"))
                .or_else(|| val.get("data"))
            {
                if let Ok(list) = serde_json::from_value::<Vec<InterviewQuestion>>(arr.clone()) {
                    if !list.is_empty() {
                        return Ok(list);
                    }
                }
            }
        }

        if let Some(start) = cleaned.find('[') {
            if let Some(end) = cleaned.rfind(']') {
                if end > start {
                    let slice = &cleaned[start..=end];
                    if let Ok(list) = serde_json::from_str::<Vec<InterviewQuestion>>(slice) {
                        if !list.is_empty() {
                            return Ok(list);
                        }
                    }
                }
            }
        }

        if let Some(start) = cleaned.find('{') {
            if let Some(end) = cleaned.rfind('}') {
                if end >= start {
                    let slice = &cleaned[start..=end];
                    let wrapped_slice = format!("[{}]", slice);
                    if let Ok(list) = serde_json::from_str::<Vec<InterviewQuestion>>(&wrapped_slice) {
                        if !list.is_empty() {
                            return Ok(list);
                        }
                    }
                }
            }
        }

        serde_json::from_str::<Vec<InterviewQuestion>>(&cleaned)
            .map_err(|e| format!("Erreur parsing questions: {} (brut: {})", e, raw))
    }

    pub async fn evaluate_candidate_answer(
        client: &UniversalAiClient,
        question: &str,
        candidate_answer: &str,
        profile: &Resume,
    ) -> Result<InterviewAnswerEvaluation, String> {
        let resume_json = serde_json::to_string(profile).unwrap_or_default();
        let prompt = format!(
            "Question d'entretien : \"{}\"\nRéponse du candidat : \"{}\"\nProfil du candidat : {}\n\nÉvalue pédagogiquement cette réponse selon la méthode STAR. Ne fabrique AUCUNE fausse expérience que le candidat n'a pas.\n\nRéponds STRICTEMENT par un objet JSON valide commençant par '{{' et finissant par '}}' :\n{{\n  \"score\": 85,\n  \"strengths\": [\"point fort 1\", \"point fort 2\"],\n  \"improvements\": [\"axe 1\", \"axe 2\"],\n  \"suggested_reformulation\": \"Reformulation exemplaire au format STAR...\",\n  \"pedagogy_notes\": \"Conseil concret pour l'oral...\"\n}}",
            question, candidate_answer, resume_json
        );

        let system_prompt = "Tu es un coach en recrutement bienveillant mais rigoureux. Tu réponds UNIQUEMENT en JSON valide commençant par '{' et finissant par '}'.";
        let raw_response = client.call_chat(system_prompt, &prompt).await.map_err(|e| e.to_string())?;

        Self::parse_evaluation_robust(&raw_response)
    }

    pub fn parse_evaluation_robust(raw: &str) -> Result<InterviewAnswerEvaluation, String> {
        let cleaned = Self::clean_json_str(raw);

        if let Ok(eval) = serde_json::from_str::<InterviewAnswerEvaluation>(&cleaned) {
            return Ok(eval);
        }

        if let Some(start) = cleaned.find('{') {
            if let Some(end) = cleaned.rfind('}') {
                if end > start {
                    let slice = &cleaned[start..=end];
                    if let Ok(eval) = serde_json::from_str::<InterviewAnswerEvaluation>(slice) {
                        return Ok(eval);
                    }
                }
            }
        }

        serde_json::from_str(&cleaned)
            .map_err(|e| format!("Erreur parsing évaluation: {} (brut: {})", e, raw))
    }

    fn clean_json_str(s: &str) -> String {
        let trimmed = s.trim();
        if let Some(pos) = trimmed.find("```json") {
            let rest = &trimmed[pos + 7..];
            if let Some(end_pos) = rest.find("```") {
                return rest[..end_pos].trim().to_string();
            }
        }
        if let Some(pos) = trimmed.find("```") {
            let rest = &trimmed[pos + 3..];
            if let Some(end_pos) = rest.find("```") {
                return rest[..end_pos].trim().to_string();
            }
        }
        trimmed.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_comma_separated_objects_without_array_brackets() {
        let raw = r#"{ "id": 1, "question": "Question 1", "category": "Tech", "context": "Ctx 1" }, { "id": 2, "question": "Question 2", "category": "Behav", "context": "Ctx 2" }"#;
        let res = InterviewQuestion::parse_questions_robust(raw);
        assert!(res.is_ok(), "Expected success, got {:?}", res);
        let list = res.unwrap();
        assert_eq!(list.len(), 2);
        assert_eq!(list[0].id, 1);
        assert_eq!(list[1].id, 2);
    }

    #[test]
    fn test_parse_wrapped_object_questions() {
        let raw = r#"{"questions": [{ "id": 1, "question": "Q1", "category": "Tech", "context": "C1" }]}"#;
        let res = InterviewQuestion::parse_questions_robust(raw);
        assert!(res.is_ok());
        assert_eq!(res.unwrap().len(), 1);
    }
}
