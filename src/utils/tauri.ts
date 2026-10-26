import { invoke as tauriInvoke } from "@tauri-apps/api/core";

export const isTauriEnvironment = (): boolean => {
  return typeof window !== "undefined" && Boolean((window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__);
};

export async function safeInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauriEnvironment()) {
    return await tauriInvoke<T>(cmd, args);
  }

  if (cmd === "get_provider_status") {
    return {
      provider: "gemini",
      has_key: false,
      source: "none",
      masked_key: undefined,
      active_model: "gemini-3.8-flash",
      base_url: undefined,
      theme: "dark",
      language: "en",
      configured_providers: [],
      security: {
        enable_prompt_injection_check: true,
        enable_document_sanitization: true,
        developer_mode_alerts: false,
        strict_ats_validation: true,
      },
      privacy: {
        save_analysis_history: true,
        history_retention_days: 30,
        save_imported_resumes: true,
        temp_files_retention_hours: 24,
      },
      ai_usage: {
        profile: "balanced",
        max_requests_per_hour: 60,
        max_concurrent_requests: 2,
        min_request_delay_ms: 1000,
        max_document_size_kb: 200,
      },
    } as unknown as T;
  }
  
  if (cmd === "load_resume_profile") {
    const saved = localStorage.getItem("opencv_profile");
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch {
        return null as unknown as T;
      }
    }
    return null as unknown as T;
  }

  if (cmd === "save_resume_profile") {
    if (args && args.profile) {
      localStorage.setItem("opencv_profile", JSON.stringify(args.profile));
    }
    return undefined as unknown as T;
  }

  if (cmd === "test_provider_connection") {
    return {
      success: true,
      message: "Test de connexion réussi (mock)",
      latency_ms: 120,
    } as unknown as T;
  }

  if (cmd === "clear_cache" || cmd === "clear_temp_files" || cmd === "wipe_all_data" || cmd === "save_app_settings" || cmd === "save_security_settings" || cmd === "save_privacy_settings" || cmd === "save_ai_usage_settings") {
    return undefined as unknown as T;
  }

  throw new Error(
    `La commande '${cmd}' nécessite d'exécuter l'application avec Tauri.`
  );
}
