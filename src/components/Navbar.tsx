import React from "react";
import {
  Sparkles,
  Save,
  Printer,
  Layers,
  Settings,
  ShieldCheck,
  Scale,
  Award,
} from "lucide-react";
import { ProviderStatus } from "../types/ats";
import { Language, Translations } from "../i18n/translations";

export type NavTab = "editor" | "ai" | "atstest" | "jobmatch" | "interview" | "letter";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  providerStatus: ProviderStatus;
  onOpenSettings: () => void;
  onSaveProfile: () => void;
  onPrint: () => void;
  isSaving: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  t: Translations;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onSaveProfile,
  onPrint,
  isSaving,
  theme,
  t,
}) => {
  const isDark = theme === "dark";

  return (
    <header
      className={`no-print sticky top-0 z-40 px-5 py-2.5 flex items-center justify-between border-b transition-colors ${
        isDark
          ? "bg-[#09090c] border-zinc-800/80 text-white"
          : "bg-white border-zinc-200 text-zinc-900 shadow-sm"
      }`}
    >
      <div className="flex items-center space-x-2.5 select-none">
        <img src="/logo.png" alt="Open-CV" className="w-7 h-7 rounded-lg object-contain shadow-sm" />
        <span className="font-extrabold text-sm tracking-tight">
          Open-CV
        </span>
      </div>

      <nav
        className={`flex items-center p-1 rounded-xl border space-x-1 ${
          isDark
            ? "bg-zinc-950/80 border-zinc-800"
            : "bg-zinc-100 border-zinc-200"
        }`}
      >
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "editor"
              ? isDark
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "bg-white text-zinc-900 shadow-sm font-semibold"
              : isDark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.tabs.profile}</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "ai"
              ? isDark
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "bg-white text-zinc-900 shadow-sm font-semibold"
              : isDark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t.tabs.ai || "IA"}</span>
        </button>

        <button
          onClick={() => setActiveTab("atstest")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "atstest"
              ? isDark
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "bg-white text-zinc-900 shadow-sm font-semibold"
              : isDark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t.tabs.atsTest}</span>
        </button>

        <button
          onClick={() => setActiveTab("jobmatch")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "jobmatch"
              ? isDark
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "bg-white text-zinc-900 shadow-sm font-semibold"
              : isDark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-blue-500" />
          <span>{t.tabs.jobMatch || "Job Match"}</span>
        </button>

        <button
          onClick={() => setActiveTab("interview")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "interview"
              ? isDark
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "bg-white text-zinc-900 shadow-sm font-semibold"
              : isDark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.tabs.interview || "Entretien"}</span>
        </button>

        <button
          onClick={() => setActiveTab("letter")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "letter"
              ? isDark
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "bg-white text-zinc-900 shadow-sm font-semibold"
              : isDark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>{t.tabs.coverLetter}</span>
        </button>
      </nav>

      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenSettings}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isDark
              ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800"
              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300"
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-zinc-400" />
          <span>{t.settings.title || "Paramètres"}</span>
        </button>

        <button
          onClick={onSaveProfile}
          disabled={isSaving}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? t.actions.saving : t.actions.save}</span>
        </button>

        <button
          onClick={onPrint}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t.actions.exportPdf}</span>
        </button>
      </div>
    </header>
  );
};
