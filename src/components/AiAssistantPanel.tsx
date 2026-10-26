import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  FileText,
  Mail,
  CheckCircle,
  Briefcase,
  Layers,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Resume } from "../types/resume";
import { CoverLetterResult } from "../types/ats";
import { Translations } from "../i18n/translations";
import { safeInvoke } from "../utils/tauri";

interface AiAssistantPanelProps {
  resume: Resume;
  onResumeChange: (resume: Resume) => void;
  coverLetter: CoverLetterResult | null;
  onCoverLetterChange: (letter: CoverLetterResult | null) => void;
  onNavigateTab: (tab: "editor" | "letter") => void;
  isReady: boolean;
  onOpenSettings: () => void;
  t: Translations;
  theme: "dark" | "light";
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  onResumeChange,
  onCoverLetterChange,
  onNavigateTab,
  isReady,
  onOpenSettings,
  t,
  theme,
}) => {
  const isDark = theme === "dark";
  const ai = t.aiAssistant || {
    title: "Génération Intelligente par IA",
    generateResume: "Générer un CV",
    generateLetter: "Générer une Lettre",
    resumeParams: "Paramètres du CV à générer",
    resumeSubtitle: "L'IA va composer un profil complet avec expériences STAR et compétences adaptées.",
    targetRole: "Intitulé du poste recherché *",
    targetRolePlaceholder: "Ex: Lead AI Engineer, Full Stack Architect...",
    experienceLevel: "Niveau d'expérience",
    levelJunior: "Junior (0 - 2 ans)",
    levelMid: "Intermédiaire (3 - 5 ans)",
    levelSenior: "Senior (6 - 10 ans)",
    levelLead: "Lead / Manager / Exécutif (10+ ans)",
    skillsKeywords: "Compétences & Mots-clés souhaités",
    skillsPlaceholder: "Ex: PyTorch, CUDA, Kubernetes, Rust...",
    notes: "Notes de parcours & Réalisations (Optionnel)",
    notesPlaceholder: "Collez ici des éléments de votre historique, entreprises précédentes, projets clés ou chiffres marquants...",
    generatingResume: "Génération du CV par l'IA en cours...",
    generateResumeBtn: "Générer le CV optimisé",
    letterParams: "Paramètres de la Lettre",
    letterSubtitle: "Directe, personnalisée et chiffrée selon le poste visé.",
    jobDescription: "Description de l'offre d'emploi *",
    jobDescriptionPlaceholder: "Collez ici le texte de l'offre d'emploi...",
    letterTone: "Tonalité de la lettre",
    toneProfessional: "Professionnel & Impact",
    toneDirect: "Direct & Concis",
    tonePassionate: "Enthousiaste & Ambitieux",
    letterInstructions: "Directives spécifiques (Optionnel)",
    generatingLetter: "Rédaction de la lettre en cours...",
    generateLetterBtn: "Générer la Lettre",
    previewTitle: "Aperçu du résultat généré",
    previewEmptyResume: "Configurez vos paramètres à gauche et cliquez sur 'Générer le CV'.",
    previewEmptyLetter: "Renseignez l'offre d'emploi et cliquez sur 'Générer la Lettre'.",
    applyResume: "Charger dans l'éditeur",
    applyLetter: "Ouvrir dans l'éditeur de lettre",
    applied: "Chargé !",
    requiresKey: "Clé API Requise",
    configureAiBtn: "Configurer le moteur IA",
    fillRoleWarning: "Veuillez renseigner l'intitulé du poste.",
    fillOfferWarning: "Veuillez renseigner la description du poste.",
  };

  const [mode, setMode] = useState<"resume" | "letter">("resume");

  const [resumeRole, setResumeRole] = useState("");
  const [resumeLevel, setResumeLevel] = useState("Senior");
  const [resumeSkills, setResumeSkills] = useState("");
  const [resumeNotes, setResumeNotes] = useState("");
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<Resume | null>(null);

  const [letterRole, setLetterRole] = useState("");
  const [letterCompany, setLetterCompany] = useState("");
  const [letterJobDesc, setLetterJobDesc] = useState("");
  const [letterTone, setLetterTone] = useState("Professionnel & Impact");
  const [letterNotes, setLetterNotes] = useState("");
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetterResult | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleGenerateResume = async () => {
    if (!isReady) {
      onOpenSettings();
      return;
    }
    if (!resumeRole.trim()) {
      setError(ai.fillRoleWarning);
      return;
    }
    setIsGeneratingResume(true);
    setError(null);
    try {
      const fullPrompt = [
        resumeNotes ? `Instructions / Notes: ${resumeNotes}` : "",
        resumeSkills ? `Key Skills: ${resumeSkills}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const res = await safeInvoke<Resume>("generate_ai_resume", {
        prompt: fullPrompt || "Generate an impressive ATS-compliant resume.",
        targetRole: resumeRole || "Professional",
        experienceLevel: resumeLevel,
      });

      setGeneratedResume(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const handleApplyResume = () => {
    if (!generatedResume) return;
    onResumeChange(generatedResume);
    onNavigateTab("editor");
  };

  const handleGenerateLetter = async () => {
    if (!isReady) {
      onOpenSettings();
      return;
    }
    if (!letterJobDesc.trim()) {
      setError(ai.fillOfferWarning);
      return;
    }

    setIsGeneratingLetter(true);
    setError(null);
    try {
      const dummyResume: Resume = generatedResume || {
        basics: {
          name: t.form.fullName || "Candidate",
          label: letterRole || "Target Role",
          email: "",
          phone: "",
          url: "",
          image: "",
          summary: "",
          location: { city: "", countryCode: "", region: "" },
        },
        work: [],
        education: [],
        skills: [],
        projects: [],
      };

      const res = await safeInvoke<CoverLetterResult>("generate_ats_cover_letter", {
        request: {
          profile: dummyResume,
          job_description: letterJobDesc,
          company_name: letterCompany || undefined,
          hiring_manager: undefined,
          tone: letterTone,
          custom_instructions: [
            letterRole ? `Target Role: ${letterRole}` : "",
            letterNotes ? `Instructions: ${letterNotes}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      });

      setGeneratedLetter(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleApplyLetter = () => {
    if (!generatedLetter) return;
    onCoverLetterChange(generatedLetter);
    onNavigateTab("letter");
  };

  return (
    <div className="flex flex-col h-full space-y-3 overflow-hidden text-zinc-900 dark:text-zinc-100">
      <div
        className={`flex items-center justify-between p-2.5 rounded-xl border shrink-0 ${
          isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold tracking-tight">
            {ai.title}
          </span>
        </div>

        <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => {
              setMode("resume");
              setError(null);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              mode === "resume"
                ? isDark
                  ? "bg-zinc-800 text-white shadow-sm font-semibold"
                  : "bg-white text-zinc-900 shadow-sm font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{ai.generateResume}</span>
          </button>

          <button
            onClick={() => {
              setMode("letter");
              setError(null);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              mode === "letter"
                ? isDark
                  ? "bg-zinc-800 text-white shadow-sm font-semibold"
                  : "bg-white text-zinc-900 shadow-sm font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{ai.generateLetter}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xs font-bold hover:underline ml-2"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-hidden">
        {mode === "resume" ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
            <div
              className={`lg:col-span-5 h-full flex flex-col p-4 rounded-2xl border overflow-y-auto space-y-3 ${
                isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xs font-bold flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>{ai.resumeParams}</span>
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {ai.resumeSubtitle}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ai.targetRole}
                </label>
                <input
                  type="text"
                  value={resumeRole}
                  onChange={(e) => setResumeRole(e.target.value)}
                  placeholder={ai.targetRolePlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ai.experienceLevel}
                </label>
                <select
                  value={resumeLevel}
                  onChange={(e) => setResumeLevel(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                >
                  <option value="Junior">{ai.levelJunior}</option>
                  <option value="Mid-Level">{ai.levelMid}</option>
                  <option value="Senior">{ai.levelSenior}</option>
                  <option value="Lead / Executive">{ai.levelLead}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ai.skillsKeywords}
                </label>
                <input
                  type="text"
                  value={resumeSkills}
                  onChange={(e) => setResumeSkills(e.target.value)}
                  placeholder={ai.skillsPlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ai.notes}
                </label>
                <textarea
                  rows={4}
                  value={resumeNotes}
                  onChange={(e) => setResumeNotes(e.target.value)}
                  placeholder={ai.notesPlaceholder}
                  className="w-full flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateResume}
                disabled={isGeneratingResume || !resumeRole.trim()}
                className="w-full flex items-center justify-center space-x-2 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black py-2.5 rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {isGeneratingResume ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{ai.generatingResume}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{ai.generateResumeBtn}</span>
                  </>
                )}
              </button>
            </div>

            <div
              className={`lg:col-span-7 h-full flex flex-col p-4 rounded-2xl border overflow-hidden ${
                isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              {generatedResume ? (
                <div className="flex-1 flex flex-col space-y-3 min-h-0">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        {generatedResume.basics.name || "John Doe"} — {generatedResume.basics.label}
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        {generatedResume.work?.length || 0} {t.form.experiences} • {generatedResume.skills?.length || 0} {t.form.skills}
                      </p>
                    </div>

                    <button
                      onClick={handleApplyResume}
                      className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{ai.applyResume}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    {generatedResume.basics.summary && (
                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                        <span className="font-bold text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">
                          {t.form.summary}
                        </span>
                        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                          {generatedResume.basics.summary}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="font-bold text-[10px] text-zinc-500 uppercase tracking-wide block">
                        {t.form.experiences}
                      </span>
                      {generatedResume.work?.map((w, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100">
                            <span>{w.position}</span>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              {w.startDate} - {w.endDate}
                            </span>
                          </div>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            {w.name}
                          </div>
                          {w.highlights && w.highlights.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-700 dark:text-zinc-300 pt-1">
                              {w.highlights.map((h, hIdx) => (
                                <li key={hIdx}>{h}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-[10px] text-zinc-500 uppercase tracking-wide block">
                        {t.form.skills}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedResume.skills?.flatMap((s) => s.keywords).map((kw, kwIdx) => (
                          <span
                            key={kwIdx}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {ai.previewTitle}
                  </h4>
                  <p className="text-[11px] text-zinc-500 max-w-sm leading-relaxed">
                    {ai.previewEmptyResume}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
            <div
              className={`lg:col-span-5 h-full flex flex-col p-4 rounded-2xl border overflow-y-auto space-y-3 ${
                isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xs font-bold flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span>{ai.letterParams}</span>
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {ai.letterSubtitle}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {t.form.company}
                </label>
                <input
                  type="text"
                  value={letterCompany}
                  onChange={(e) => setLetterCompany(e.target.value)}
                  placeholder="Random Ai Company"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {t.form.jobTitle}
                </label>
                <input
                  type="text"
                  value={letterRole}
                  onChange={(e) => setLetterRole(e.target.value)}
                  placeholder={ai.targetRolePlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ai.letterTone}
                </label>
                <select
                  value={letterTone}
                  onChange={(e) => setLetterTone(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                >
                  <option value="Professionnel & Impact">{ai.toneProfessional}</option>
                  <option value="Direct & Concis">{ai.toneDirect}</option>
                  <option value="Enthousiaste & Ambitieux">{ai.tonePassionate}</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ai.jobDescription}
                </label>
                <textarea
                  rows={3}
                  value={letterJobDesc}
                  onChange={(e) => setLetterJobDesc(e.target.value)}
                  placeholder={ai.jobDescriptionPlaceholder}
                  className="w-full flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  {ai.letterInstructions}
                </label>
                <input
                  type="text"
                  value={letterNotes}
                  onChange={(e) => setLetterNotes(e.target.value)}
                  placeholder="e.g. Highlight LLM optimizations and distributed systems leadership..."
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateLetter}
                disabled={isGeneratingLetter || !letterJobDesc.trim()}
                className="w-full flex items-center justify-center space-x-2 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black py-2.5 rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {isGeneratingLetter ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{ai.generatingLetter}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{ai.generateLetterBtn}</span>
                  </>
                )}
              </button>
            </div>

            <div
              className={`lg:col-span-7 h-full flex flex-col p-4 rounded-2xl border overflow-hidden ${
                isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              {generatedLetter ? (
                <div className="flex-1 flex flex-col space-y-3 min-h-0">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {ai.previewTitle}
                    </span>
                    <button
                      onClick={handleApplyLetter}
                      className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{ai.applyLetter}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>

                  <textarea
                    readOnly
                    value={generatedLetter.full_markdown}
                    className="flex-1 w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs text-zinc-900 dark:text-zinc-100 font-sans leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {ai.previewTitle}
                  </h4>
                  <p className="text-[11px] text-zinc-500 max-w-sm leading-relaxed">
                    {ai.previewEmptyLetter}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
