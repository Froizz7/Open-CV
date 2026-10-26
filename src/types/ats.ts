import { Resume } from "./resume";

export interface StarImprovement {
  original_text: string;
  improved_text: string;
  impact_metric: string;
  rationale: string;
}

export interface SectionCritique {
  experience_score: number;
  experience_feedback: string;
  skills_score: number;
  skills_feedback: string;
  education_score: number;
  education_feedback: string;
  formatting_score: number;
  formatting_feedback: string;
}

export interface AtsAnalysisResult {
  overall_score: number;
  summary: string;
  matched_keywords: string[];
  missing_keywords: string[];
  star_improvements: StarImprovement[];
  strengths: string[];
  weaknesses: string[];
  section_critique: SectionCritique;
}

export interface CoverLetterRequest {
  profile: Resume;
  job_description: string;
  company_name?: string;
  hiring_manager?: string;
  tone?: string;
  custom_instructions?: string;
}

export interface CoverLetterResult {
  salutation: string;
  intro: string;
  body_paragraphs: string[];
  conclusion: string;
  sign_off: string;
  full_markdown: string;
}

export type ProviderType = "gemini" | "openai" | "claude" | "ollama" | "lm_studio" | "custom";

export interface SecuritySettings {
  enable_prompt_injection_check: boolean;
  enable_document_sanitization: boolean;
  developer_mode_alerts: boolean;
  strict_ats_validation: boolean;
}

export interface PrivacySettings {
  save_analysis_history: boolean;
  history_retention_days: number;
  save_imported_resumes: boolean;
  temp_files_retention_hours: number;
}

export interface AIUsageSettings {
  profile: "strict" | "balanced" | "custom" | string;
  max_requests_per_hour: number;
  max_concurrent_requests: number;
  min_request_delay_ms: number;
  max_document_size_kb: number;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latency_ms: number;
}

export interface SecurityFinding {
  rule: string;
  message: string;
  severity: "low" | "medium" | "high" | string;
  matched_excerpt?: string;
}

export interface SecurityScanReport {
  is_suspicious: boolean;
  risk_level: "low" | "medium" | "high" | string;
  findings: SecurityFinding[];
  original_length: number;
  sanitized_length: number;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  context: string;
}

export interface InterviewAnswerEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  suggested_reformulation: string;
  pedagogy_notes: string;
}

export interface JobOfferInput {
  id: string;
  title: string;
  company: string;
  description: string;
}

export interface JobMatchItem {
  id: string;
  title: string;
  company: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  ranking: number;
}

export interface JobComparisonResult {
  ranked_jobs: JobMatchItem[];
  best_match_id: string;
  global_summary: string;
}

export interface ProviderStatus {
  provider: ProviderType;
  has_key: boolean;
  source: string;
  masked_key?: string;
  active_model: string;
  base_url?: string;
  theme?: string;
  language?: string;
  configured_providers?: ProviderType[];
  security?: SecuritySettings;
  privacy?: PrivacySettings;
  ai_usage?: AIUsageSettings;
}

export type ApiKeyStatus = ProviderStatus;
