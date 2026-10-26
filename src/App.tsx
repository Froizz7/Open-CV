import React, { useState, useEffect } from "react";
import { Navbar, NavTab } from "./components/Navbar";
import { Sidebar, SidebarSection } from "./components/Sidebar";
import { ResumeForm } from "./components/ResumeForm";
import { AtsResumePreview, TemplateId } from "./components/AtsResumePreview";
import { AtsTestPanel } from "./components/AtsTestPanel";
import { CoverLetterGenerator } from "./components/CoverLetterGenerator";
import { AiAssistantPanel } from "./components/AiAssistantPanel";
import { JobMatchPanel } from "./components/JobMatchPanel";
import { InterviewSimulator } from "./components/InterviewSimulator";
import { SettingsModal } from "./components/SettingsModal";
import { initialResume } from "./data/sampleResume";
import { Resume } from "./types/resume";
import { AtsAnalysisResult, CoverLetterResult, ProviderStatus, ProviderType } from "./types/ats";
import { safeInvoke } from "./utils/tauri";
import { Language, translations } from "./i18n/translations";
import { CheckCircle, AlertCircle } from "lucide-react";
import { parseResumeFile } from "./utils/resumeImport";

export const App: React.FC = () => {
  const [resume, setResume] = useState<Resume>(initialResume);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [targetRole, setTargetRole] = useState<string>("");
  const [atsResult, setAtsResult] = useState<AtsAnalysisResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("opencv_theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("opencv_theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    localStorage.setItem("opencv_theme", newTheme);
    safeInvoke("save_app_settings", { theme: newTheme, language }).catch(() => {});
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    handleThemeChange(nextTheme);
  };

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("opencv_lang") as Language) || "en";
  });
  const t = translations[language] || translations.en;

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem("opencv_lang", newLang);
    safeInvoke("save_app_settings", { theme, language: newLang }).catch(() => {});
  };

  const [activeTab, setActiveTab] = useState<NavTab>("editor");
  const [activeSection, setActiveSection] = useState<SidebarSection>("basics");
  const [template, setTemplate] = useState<TemplateId>(() => {
    return (localStorage.getItem("opencv_template") as TemplateId) || "minimal";
  });
  const [showPhoto, setShowPhoto] = useState<boolean>(true);

  const handleTemplateChange = (newTpl: TemplateId) => {
    setTemplate(newTpl);
    localStorage.setItem("opencv_template", newTpl);
  };

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [providerStatus, setProviderStatus] = useState<ProviderStatus>({
    provider: "gemini",
    has_key: false,
    source: "none",
    active_model: "gemini-3.8-flash",
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        const status = await safeInvoke<ProviderStatus>("get_provider_status");
        setProviderStatus(status);
        if (status.theme === "light" || status.theme === "dark") {
          setTheme(status.theme);
        }
        if (status.language && ["fr", "en", "es", "de", "it", "pt", "nl"].includes(status.language)) {
          setLanguage(status.language as Language);
        }
      } catch (err) {
        console.warn("Could not check AI provider status:", err);
      }

      try {
        const saved = await safeInvoke<Resume | null>("load_resume_profile");
        if (saved && saved.basics && saved.basics.name && saved.basics.name.trim()) {
          setResume(saved);
        } else {
          setResume(initialResume);
        }
      } catch (err) {
        console.warn("Could not load stored profile:", err);
        setResume(initialResume);
      }
    };

    initApp();
  }, []);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await safeInvoke("save_resume_profile", { profile: resume });
      showNotification("success", "Profil CV enregistré avec succès.");
    } catch (err) {
      showNotification("error", `Échec de sauvegarde: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToSample = () => {
    setResume(initialResume);
    showNotification("success", "Modèle exemple IA (John Doe) chargé.");
  };

  const handleImportResume = async (file: File) => {
    setIsImporting(true);
    showNotification("success", `Lecture du fichier ${file.name}...`);
    try {
      const res = await parseResumeFile(file, isReady);
      if (res.error) {
        showNotification("error", res.error);
      } else if (res.resume) {
        setResume(res.resume);
        safeInvoke("save_resume_profile", { profile: res.resume });
        showNotification("success", `CV importé avec succès depuis ${file.name} !`);
      }
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : String(err));
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveProvider = async (
    provider: ProviderType,
    apiKey: string | undefined,
    model: string,
    baseUrl?: string
  ) => {
    const newStatus = await safeInvoke<ProviderStatus>("save_provider_config", {
      provider,
      apiKey: apiKey || null,
      model,
      baseUrl: baseUrl || null,
    });
    setProviderStatus(newStatus);
    showNotification("success", "Configuration enregistrée avec succès.");
  };

  const handleRemoveApiKey = async (provider: ProviderType) => {
    const newStatus = await safeInvoke<ProviderStatus>("remove_provider_api_key", {
      provider,
    });
    setProviderStatus(newStatus);
    showNotification("success", "Clé d'API retirée avec succès.");
  };

  const handleAnalyzeAts = async () => {
    if (!jobDescription.trim()) {
      showNotification("error", "Veuillez renseigner la description de l'offre d'emploi.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await safeInvoke<AtsAnalysisResult>("analyze_resume_ats", {
        profile: resume,
        jobDescription,
      });
      setAtsResult(result);
      showNotification("success", "Audit ATS complété avec succès !");
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : String(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = async (tone: string, customInstructions: string) => {
    if (!jobDescription.trim()) {
      showNotification("error", "Veuillez renseigner la description de l'offre d'emploi.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await safeInvoke<CoverLetterResult>("generate_ats_cover_letter", {
        request: {
          profile: resume,
          job_description: jobDescription,
          tone,
          custom_instructions: customInstructions,
        },
      });
      setCoverLetter(result);
      showNotification("success", "Lettre de motivation générée avec succès !");
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const executePrint = () => {
      document.title = "";
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 500);
    };

    if (activeTab !== "editor") {
      setActiveTab("editor");
      setTimeout(executePrint, 200);
    } else {
      executePrint();
    }
  };

  const isReady =
    providerStatus.has_key ||
    providerStatus.provider === "ollama" ||
    providerStatus.provider === "lm_studio";

  return (
    <div className="flex flex-col h-screen bg-zinc-100 dark:bg-[#070709] text-zinc-900 dark:text-zinc-100 font-sans antialiased overflow-hidden transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        providerStatus={providerStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSaveProfile={handleSaveProfile}
        onPrint={handlePrint}
        isSaving={isSaving}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        t={t}
      />

      {notification && (
        <div
          className={`no-print fixed top-16 right-5 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold animate-in slide-in-from-top duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        {activeTab === "editor" ? (
          <div className="resume-editor-container flex-1 flex overflow-hidden">
            <Sidebar
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              experienceCount={resume.work?.length ?? 0}
              educationCount={resume.education?.length ?? 0}
              skillsCount={resume.skills?.length ?? 0}
              t={t}
              theme={theme}
              onResetSample={handleResetToSample}
              onImportResume={handleImportResume}
              isImporting={isImporting}
            />
            <div className="no-print w-[500px] border-r border-zinc-200 dark:border-zinc-800/80 overflow-y-auto bg-white dark:bg-[#0b0b0e] p-6 transition-colors">
              <ResumeForm
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                resume={resume}
                onChange={setResume}
                t={t}
                theme={theme}
              />
            </div>
            <div className="preview-outer-container flex-1 bg-zinc-200/70 dark:bg-zinc-950 overflow-y-auto p-8 flex justify-center items-start transition-colors">
              <AtsResumePreview
                resume={resume}
                t={t}
                template={template}
                onTemplateChange={handleTemplateChange}
                showPhoto={showPhoto}
                onTogglePhoto={() => setShowPhoto(!showPhoto)}
                theme={theme}
                onPrint={handlePrint}
              />
            </div>
          </div>
        ) : activeTab === "ai" ? (
          <div className="h-full w-full overflow-hidden">
            <AiAssistantPanel
              resume={resume}
              onResumeChange={setResume}
              coverLetter={coverLetter}
              onCoverLetterChange={setCoverLetter}
              onNavigateTab={(tab) => setActiveTab(tab)}
              isReady={isReady}
              onOpenSettings={() => setIsSettingsOpen(true)}
              t={t}
              theme={theme}
            />
          </div>
        ) : activeTab === "atstest" ? (
          <div className="h-full w-full overflow-hidden">
            <AtsTestPanel
              resume={resume}
              onResumeChange={setResume}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              atsResult={atsResult}
              onAnalyze={handleAnalyzeAts}
              isAnalyzing={isAnalyzing}
              hasApiKey={isReady}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onSwitchToPreview={() => setActiveTab("editor")}
              t={t}
              theme={theme}
            />
          </div>
        ) : activeTab === "jobmatch" ? (
          <div className="h-full w-full overflow-y-auto">
            <JobMatchPanel
              resume={resume}
              theme={theme}
              language={language}
              t={t}
            />
          </div>
        ) : activeTab === "interview" ? (
          <div className="h-full w-full overflow-y-auto">
            <InterviewSimulator
              resume={resume}
              theme={theme}
              language={language}
              t={t}
            />
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden">
            <CoverLetterGenerator
              resume={resume}
              jobDescription={jobDescription}
              coverLetter={coverLetter}
              onGenerate={handleGenerateCoverLetter}
              isGenerating={isGenerating}
              onLetterUpdate={setCoverLetter}
              t={t}
            />
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        status={providerStatus}
        onSaveProvider={handleSaveProvider}
        onRemoveApiKey={handleRemoveApiKey}
        theme={theme}
        onThemeChange={handleThemeChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        t={t}
      />
    </div>
  );
};
