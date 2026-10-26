import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Save,
  Cpu,
  HelpCircle,
  Bot,
  Trash2,
  Sliders,
  Sun,
  Moon,
  Globe,
  Shield,
  Lock,
  Activity,
  FileText,
  AlertTriangle,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  ProviderStatus,
  ProviderType,
  SecuritySettings,
  PrivacySettings,
  AIUsageSettings,
  ConnectionTestResult,
} from "../types/ats";
import { Language, Translations } from "../i18n/translations";
import { McpPanel } from "./McpPanel";
import { safeInvoke } from "../utils/tauri";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ProviderStatus;
  onSaveProvider: (
    provider: ProviderType,
    key: string | undefined,
    model: string,
    baseUrl?: string
  ) => Promise<void>;
  onRemoveApiKey: (provider: ProviderType) => Promise<void>;
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: Translations;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  status,
  onSaveProvider,
  onRemoveApiKey,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  t,
}) => {
  const isDark = theme === "dark";
  const st = t.settings;
  const [activeTab, setActiveTab] = useState<"general" | "ai" | "security" | "mcp">("general");

  const [provider, setProvider] = useState<ProviderType>(status.provider || "gemini");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(status.active_model || "gemini-3.8-flash");
  const [baseUrl, setBaseUrl] = useState(status.base_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingKey, setIsRemovingKey] = useState(false);
  const [success, setSuccess] = useState(false);

  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const [security, setSecurity] = useState<SecuritySettings>({
    enable_prompt_injection_check: status.security?.enable_prompt_injection_check ?? true,
    enable_document_sanitization: status.security?.enable_document_sanitization ?? true,
    developer_mode_alerts: status.security?.developer_mode_alerts ?? false,
    strict_ats_validation: status.security?.strict_ats_validation ?? true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    save_analysis_history: status.privacy?.save_analysis_history ?? true,
    history_retention_days: status.privacy?.history_retention_days ?? 30,
    save_imported_resumes: status.privacy?.save_imported_resumes ?? true,
    temp_files_retention_hours: status.privacy?.temp_files_retention_hours ?? 24,
  });

  const [aiUsage, setAiUsage] = useState<AIUsageSettings>({
    profile: status.ai_usage?.profile ?? "balanced",
    max_requests_per_hour: status.ai_usage?.max_requests_per_hour ?? 60,
    max_concurrent_requests: status.ai_usage?.max_concurrent_requests ?? 2,
    min_request_delay_ms: status.ai_usage?.min_request_delay_ms ?? 1000,
    max_document_size_kb: status.ai_usage?.max_document_size_kb ?? 200,
  });

  const [confirmWipe, setConfirmWipe] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProvider(status.provider || "gemini");
      setModel(status.active_model || getDefaultModel(status.provider || "gemini"));
      setBaseUrl(status.base_url || getDefaultBaseUrl(status.provider || "gemini"));
      setApiKey("");
      setTestResult(null);
      if (status.security) setSecurity(status.security);
      if (status.privacy) setPrivacy(status.privacy);
      if (status.ai_usage) setAiUsage(status.ai_usage);
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  function getDefaultModel(p: ProviderType): string {
    switch (p) {
      case "gemini":
        return "gemini-3.8-flash";
      case "openai":
        return "gpt-6-astra";
      case "claude":
        return "claude-sonnet-5-5";
      case "ollama":
        return "llama3.3:latest";
      case "lm_studio":
        return "local-model";
      case "custom":
        return "custom-model";
    }
  }

  function getDefaultBaseUrl(p: ProviderType): string {
    switch (p) {
      case "ollama":
        return "http://localhost:11434/v1";
      case "lm_studio":
        return "http://localhost:1234/v1";
      case "custom":
        return "https://openrouter.ai/api/v1";
      default:
        return "";
    }
  }

  function getApiKeyUrl(p: ProviderType): string {
    switch (p) {
      case "gemini":
        return "https://aistudio.google.com/app/apikey";
      case "openai":
        return "https://platform.openai.com/api-keys";
      case "claude":
        return "https://console.anthropic.com/settings/keys";
      case "custom":
        return "https://openrouter.ai/keys";
      default:
        return "";
    }
  }

  const handleProviderChange = (newProvider: ProviderType) => {
    setProvider(newProvider);
    setModel(getDefaultModel(newProvider));
    setBaseUrl(getDefaultBaseUrl(newProvider));
    setApiKey("");
    setTestResult(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProvider(
        provider,
        apiKey.trim() ? apiKey.trim() : undefined,
        model.trim(),
        baseUrl.trim() ? baseUrl.trim() : undefined
      );
      await safeInvoke("save_security_settings", { settings: security });
      await safeInvoke("save_privacy_settings", { settings: privacy });
      await safeInvoke("save_ai_usage_settings", { settings: aiUsage });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 700);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveKey = async (p: ProviderType) => {
    setIsRemovingKey(true);
    try {
      await onRemoveApiKey(p);
      setApiKey("");
      setTestResult(null);
    } finally {
      setIsRemovingKey(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await safeInvoke<ConnectionTestResult>("test_provider_connection", {
        provider,
        apiKey: apiKey.trim() ? apiKey.trim() : undefined,
        model: model.trim(),
        baseUrl: baseUrl.trim() ? baseUrl.trim() : undefined,
      });
      setTestResult(res);
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : String(err),
        latency_ms: 0,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const applyProfile = (prof: "strict" | "balanced" | "custom") => {
    if (prof === "strict") {
      setAiUsage({
        profile: "strict",
        max_requests_per_hour: 20,
        max_concurrent_requests: 1,
        min_request_delay_ms: 3000,
        max_document_size_kb: 50,
      });
    } else if (prof === "balanced") {
      setAiUsage({
        profile: "balanced",
        max_requests_per_hour: 60,
        max_concurrent_requests: 2,
        min_request_delay_ms: 1000,
        max_document_size_kb: 200,
      });
    } else {
      setAiUsage((prev) => ({ ...prev, profile: "custom" }));
    }
  };

  const handleClearCache = async () => {
    try {
      await safeInvoke("clear_cache");
      setActionNotice("Cache vidé avec succès.");
      setTimeout(() => setActionNotice(null), 3000);
    } catch {
      setActionNotice("Erreur lors du nettoyage du cache.");
    }
  };

  const handleClearTemp = async () => {
    try {
      await safeInvoke("clear_temp_files");
      setActionNotice("Fichiers temporaires supprimés avec succès.");
      setTimeout(() => setActionNotice(null), 3000);
    } catch {
      setActionNotice("Erreur lors du nettoyage des fichiers temporaires.");
    }
  };

  const handleWipeAll = async () => {
    try {
      await safeInvoke("wipe_all_data");
      localStorage.clear();
      setConfirmWipe(false);
      onClose();
      window.location.reload();
    } catch {
      setActionNotice("Erreur lors de la suppression totale des données.");
    }
  };

  const resetAllToDefaults = () => {
    setSecurity({
      enable_prompt_injection_check: true,
      enable_document_sanitization: true,
      developer_mode_alerts: false,
      strict_ats_validation: true,
    });
    setPrivacy({
      save_analysis_history: true,
      history_retention_days: 30,
      save_imported_resumes: true,
      temp_files_retention_hours: 24,
    });
    applyProfile("balanced");
    setActionNotice("Paramètres restaurés aux valeurs sécurisées par défaut.");
    setTimeout(() => setActionNotice(null), 3000);
  };

  const isLocalProvider = provider === "ollama" || provider === "lm_studio";
  const apiKeyUrl = getApiKeyUrl(provider);

  const languagesList: { id: Language; label: string; flag: string }[] = [
    { id: "en", label: "English", flag: "US" },
    { id: "fr", label: "Français", flag: "FR" },
    { id: "es", label: "Español", flag: "ES" },
    { id: "de", label: "Deutsch", flag: "DE" },
    { id: "it", label: "Italiano", flag: "IT" },
    { id: "pt", label: "Português", flag: "PT" },
    { id: "nl", label: "Nederlands", flag: "NL" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100 transition-colors">
        <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">{st.title || "Paramètres"}</h3>
              <p className="text-[11px] text-zinc-500">
                {st.subtitle || "Configuration générale, modèles d'IA et sécurité"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTab === "general"
                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{st.generalTab || "Général"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTab === "ai"
                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{st.aiTab || "Modèles IA"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTab === "security"
                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>{st.securityTab || "Security & Privacy"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mcp")}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTab === "mcp"
                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{st.mcpTab || "Client MCP"}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {actionNotice && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center space-x-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Thème d'affichage</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onThemeChange("dark")}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      theme === "dark"
                        ? "bg-zinc-900 text-white border-zinc-700 shadow-sm font-bold ring-1 ring-zinc-600"
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Sombre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange("light")}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      theme === "light"
                        ? "bg-white text-zinc-950 border-zinc-400 shadow-sm font-bold ring-1 ring-zinc-400"
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Clair</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Langue de l'interface</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {languagesList.map((langItem) => {
                    const isSelected = language === langItem.id;
                    return (
                      <button
                        key={langItem.id}
                        type="button"
                        onClick={() => onLanguageChange(langItem.id)}
                        className={`flex items-center justify-between py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 border-zinc-700 dark:border-zinc-300 shadow-sm font-bold"
                            : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        <span>{langItem.label}</span>
                        <span className="text-[10px] font-mono uppercase opacity-75">{langItem.flag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Fournisseur d'IA actif
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
                  {[
                    { id: "gemini", name: "Google Gemini" },
                    { id: "openai", name: "OpenAI / ChatGPT" },
                    { id: "claude", name: "Anthropic Claude" },
                    { id: "ollama", name: "Ollama (Local)" },
                    { id: "lm_studio", name: "LM Studio (Local)" },
                    { id: "custom", name: "Custom / OpenRouter" },
                  ].map((p) => {
                    const isConfigured = status.configured_providers?.includes(p.id as ProviderType);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProviderChange(p.id as ProviderType)}
                        className={`py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-between ${
                          provider === p.id
                            ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm font-bold"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        <span>{p.name}</span>
                        {isConfigured && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isLocalProvider && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Clé d'API {provider.toUpperCase()}
                      </label>
                      {apiKeyUrl && (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const { openUrl } = await import("@tauri-apps/plugin-opener");
                              await openUrl(apiKeyUrl);
                            } catch {
                              window.open(apiKeyUrl, "_blank");
                            }
                          }}
                          className="inline-flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                          title="Obtenir votre clé API"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {status.provider === provider && status.has_key && (
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-emerald-500 font-mono">
                          Enregistrée ({status.masked_key})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKey(provider)}
                          disabled={isRemovingKey}
                          className="flex items-center space-x-1 text-[11px] text-rose-500 hover:text-rose-600 transition-colors font-medium border border-rose-300 dark:border-rose-900/60 rounded px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/30"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Retirer</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={
                      status.provider === provider && status.masked_key
                        ? status.masked_key
                        : "Collez votre clé API..."
                    }
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Modèle d'IA
                </label>
                {provider === "gemini" ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 cursor-pointer"
                  >
                    <option value="gemini-4-argon">Gemini 4 Argon (gemini-4-argon)</option>
                    <option value="gemini-3.8-flash">Gemini 3.8 Flash (gemini-3.8-flash)</option>
                    <option value="gemini-3.6-flash">Gemini 3.6 Flash (gemini-3.6-flash)</option>
                    <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite (gemini-3.5-flash-lite)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (gemini-3.1-pro-preview)</option>
                  </select>
                ) : provider === "openai" ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 cursor-pointer"
                  >
                    <option value="gpt-6-astra">GPT-6 Astra (gpt-6-astra)</option>
                    <option value="gpt-6.1-sol">GPT-6.1 Sol (gpt-6.1-sol)</option>
                    <option value="gpt-6-luna">GPT-6 Luna (gpt-6-luna)</option>
                    <option value="gpt-5.6-cyber">GPT-5.6 Cyber (gpt-5.6-cyber)</option>
                  </select>
                ) : provider === "claude" ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 cursor-pointer"
                  >
                    <option value="claude-opus-5-5">Claude Opus 5.5 (claude-opus-5-5)</option>
                    <option value="claude-fable-5-1">Claude Fable 5.1 (claude-fable-5-1)</option>
                    <option value="claude-sonnet-5-5">Claude Sonnet 5.5 (claude-sonnet-5-5)</option>
                    <option value="claude-haiku-5-5">Claude Haiku 5.5 (claude-haiku-5-5)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Nom du modèle..."
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                  />
                )}
              </div>

              {(isLocalProvider || provider === "custom") && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Adresse du serveur (Base URL)
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isTesting ? (st.testingStatus || "Test en cours...") : (st.testConnectionBtn || "Tester la connexion")}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center space-x-1.5 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-4 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                  >
                    {success ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Enregistré !</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? "Sauvegarde..." : "Enregistrer"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    testResult.success
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {testResult.success ? (
                      <Check className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.latency_ms > 0 && (
                    <span className="font-mono text-[11px] font-bold">
                      {testResult.latency_ms} ms
                    </span>
                  )}
                </div>
              )}
            </form>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {st.vaultTitle || "Coffre-fort local chiffré (AES-256-GCM)"}
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    {st.vaultDesc || "Vos secrets et clés d'API sont stockés de manière isolée dans un fichier cryptographique matériellement lié à votre session utilisateur. Aucune clé n'est enregistrée en clair sur le disque."}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  1. {st.promptInjectionTitle || "Protection des Documents & Prompts IA"}
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      id: "enable_prompt_injection_check",
                      label: st.promptInjectionTitle || "Détection des attaques par injection de prompt",
                      desc: st.promptInjectionDesc || "Analyse et bloque les tentatives de détournement de directives dans les offres ou CV.",
                      checked: security.enable_prompt_injection_check,
                      toggle: () =>
                        setSecurity((s) => ({
                          ...s,
                          enable_prompt_injection_check: !s.enable_prompt_injection_check,
                        })),
                    },
                    {
                      id: "enable_document_sanitization",
                      label: st.docSanitizationTitle || "Assainissement des documents importés",
                      desc: st.docSanitizationDesc || "Nettoie les caractères invisibles, balises de script et espaces de largeur nulle.",
                      checked: security.enable_document_sanitization,
                      toggle: () =>
                        setSecurity((s) => ({
                          ...s,
                          enable_document_sanitization: !s.enable_document_sanitization,
                        })),
                    },
                    {
                      id: "strict_ats_validation",
                      label: st.strictValidationTitle || "Validation stricte de la structure des réponses",
                      desc: st.strictValidationDesc || "Vérifie la conformité rigoureuse des structures JSON générées avant traitement.",
                      checked: security.strict_ats_validation,
                      toggle: () =>
                        setSecurity((s) => ({
                          ...s,
                          strict_ats_validation: !s.strict_ats_validation,
                        })),
                    },
                    {
                      id: "developer_mode_alerts",
                      label: st.devAlertsTitle || "Mode développeur pour alertes techniques de sécurité",
                      desc: st.devAlertsDesc || "Affiche le détail des règles et fragments suspects identifiés lors des scans.",
                      checked: security.developer_mode_alerts,
                      toggle: () =>
                        setSecurity((s) => ({
                          ...s,
                          developer_mode_alerts: !s.developer_mode_alerts,
                        })),
                    },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                    >
                      <div className="pr-3 text-xs">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={item.toggle}
                        className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  2. {st.usageLimitsTitle || "Limites d'usage & Contrôle IA"}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "strict", label: st.strictProfile || "Strict", desc: "20 req/h • 1 flux • 50 Ko" },
                    { id: "balanced", label: st.balancedProfile || "Équilibré", desc: "60 req/h • 2 flux • 200 Ko" },
                    { id: "custom", label: st.customProfile || "Personnalisé", desc: "Limites sur mesure" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyProfile(p.id as "strict" | "balanced" | "custom")}
                      className={`p-3 rounded-xl border text-left transition ${
                        aiUsage.profile === p.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                          : isDark
                          ? "border-zinc-800 bg-zinc-900/40 text-zinc-400"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600"
                      }`}
                    >
                      <div className="font-semibold text-xs text-zinc-900 dark:text-white">
                        {p.label}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {p.desc}
                      </div>
                    </button>
                  ))}
                </div>

                {aiUsage.profile === "custom" && (
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                        Requêtes max / heure
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="300"
                        value={aiUsage.max_requests_per_hour}
                        onChange={(e) =>
                          setAiUsage((u) => ({
                            ...u,
                            max_requests_per_hour: parseInt(e.target.value) || 60,
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                        Requêtes simultanées max
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={aiUsage.max_concurrent_requests}
                        onChange={(e) =>
                          setAiUsage((u) => ({
                            ...u,
                            max_concurrent_requests: parseInt(e.target.value) || 2,
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  3. {st.privacyTitle || "Confidentialité & Gestion des Fichiers"}
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs">
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {st.retentionLabel || "Durée de conservation de l'historique"}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {st.retentionDesc || "Période après laquelle l'historique d'audit est purgé."}
                      </div>
                    </div>
                    <select
                      value={privacy.history_retention_days}
                      onChange={(e) =>
                        setPrivacy((p) => ({
                          ...p,
                          history_retention_days: parseInt(e.target.value) || 30,
                        }))
                      }
                      className="px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs"
                    >
                      <option value="7">7 jours</option>
                      <option value="30">30 jours</option>
                      <option value="90">90 jours</option>
                      <option value="0">Indéfini</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleClearCache}
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      {st.clearCacheBtn || "Nettoyer le cache"}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearTemp}
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      {st.clearTempBtn || "Supprimer fichiers temporaires"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmWipe(true)}
                      className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition ml-auto"
                    >
                      {st.wipeAllBtn || "Effacer toutes les données locales"}
                    </button>
                  </div>
                </div>
              </div>

              {confirmWipe && (
                <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-xs text-red-600 dark:text-red-400 space-y-3">
                  <div className="font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {st.wipeConfirmTitle || "Confirmation de suppression complète"}
                  </div>
                  <p>
                    {st.wipeConfirmDesc || "Cette action réinitialise intégralement l'application Open-CV : vos profils enregistrés, le coffre-fort de clés d'API et les paramètres seront définitivement effacés."}
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmWipe(false)}
                      className="px-3 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleWipeAll}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm"
                    >
                      Confirmer l'effacement total
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetAllToDefaults}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{st.resetDefaultsBtn || "Restaurer les valeurs sécurisées par défaut"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsSaving(true);
                      try {
                        await safeInvoke("save_security_settings", { settings: security });
                        await safeInvoke("save_privacy_settings", { settings: privacy });
                        await safeInvoke("save_ai_usage_settings", { settings: aiUsage });
                        setActionNotice("Paramètres de sécurité enregistrés !");
                        setTimeout(() => setActionNotice(null), 2500);
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-50 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{st.saveSecurityBtn || "Sauvegarder la sécurité"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mcp" && (
            <div className="h-full">
              <McpPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
