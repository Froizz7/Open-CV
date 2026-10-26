use crate::ai::UniversalAiClient;
use crate::models::Resume;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JobOfferInput {
    pub id: String,
    pub title: String,
    pub company: String,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JobMatchItem {
    pub id: String,
    pub title: String,
    pub company: String,
    pub match_score: u32,
    pub matched_skills: Vec<String>,
    pub missing_skills: Vec<String>,
    pub strengths: Vec<String>,
    pub gaps: Vec<String>,
    pub recommendations: Vec<String>,
    pub ranking: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JobComparisonResult {
    pub ranked_jobs: Vec<JobMatchItem>,
    pub best_match_id: String,
    pub global_summary: String,
}

pub struct JobMatcher;

impl JobMatcher {
    pub async fn compare(
        client: &UniversalAiClient,
        profile: &Resume,
        offers: Vec<JobOfferInput>,
    ) -> Result<JobComparisonResult, String> {
        if offers.len() < 2 {
            return Err("Veuillez fournir au moins 2 offres d'emploi pour la comparaison (jusqu'à 5).".to_string());
        }
        if offers.len() > 5 {
            return Err("Le comparateur accepte un maximum de 5 offres simultanées.".to_string());
        }

        let resume_json = serde_json::to_string(profile).unwrap_or_default();
        let offers_json = serde_json::to_string(&offers).unwrap_or_default();

        let prompt = format!(
            "Compare rigoureusement le profil candidat suivant avec les {} offres d'emploi fournies.\n\nPROFIL CANDIDAT:\n{}\n\nOFFRES D'EMPLOI:\n{}\n\nPour chaque offre, évalue la compatibilité avec un score déterministe (0 à 100), liste les compétences validées, les compétences manquantes, les forces, les écarts et 2 recommandations concrètes.\nClasse les offres de la meilleure à la moins adaptée.\n\nRéponds STRICTEMENT par un JSON valide conforme au format :\n{{\n  \"ranked_jobs\": [\n    {{\n      \"id\": \"...\",\n      \"title\": \"...\",\n      \"company\": \"...\",\n      \"match_score\": 88,\n      \"matched_skills\": [\"Rust\", \"TypeScript\"],\n      \"missing_skills\": [\"AWS Lambda\"],\n      \"strengths\": [\"Forte expérience frontend et système\"],\n      \"gaps\": [\"Manque d'expérience cloud avancée\"],\n      \"recommendations\": [\"Mettre en avant le projet X\", \"Ajouter la certification Y\"],\n      \"ranking\": 1\n    }}\n  ],\n  \"best_match_id\": \"...\",\n  \"global_summary\": \"Synthèse comparative globale...\"\n}}",
            offers.len(), resume_json, offers_json
        );

        let system_prompt = "Tu es un recruteur technique expert et un algorithme d'appariement d'offres (Job Matcher). Tu analyses les correspondances de manière objective et structurée.";
        let raw_response = client.call_chat(system_prompt, &prompt).await.map_err(|e| e.to_string())?;

        let cleaned = Self::clean_json_str(&raw_response);
        let mut result: JobComparisonResult = serde_json::from_str(&cleaned)
            .map_err(|e| format!("Erreur parsing comparaison d'offres: {} (brut: {})", e, raw_response))?;

        result.ranked_jobs.sort_by(|a, b| b.match_score.cmp(&a.match_score));
        for (idx, item) in result.ranked_jobs.iter_mut().enumerate() {
            item.ranking = (idx + 1) as u32;
        }

        if let Some(first) = result.ranked_jobs.first() {
            result.best_match_id = first.id.clone();
        }

        Ok(result)
    }

    fn clean_json_str(s: &str) -> String {
        let mut trimmed = s.trim();
        if trimmed.starts_with("```json") {
            trimmed = &trimmed[7..];
        } else if trimmed.starts_with("```") {
            trimmed = &trimmed[3..];
        }
        if trimmed.ends_with("```") {
            trimmed = &trimmed[..trimmed.len() - 3];
        }
        trimmed.trim().to_string()
    }
}
