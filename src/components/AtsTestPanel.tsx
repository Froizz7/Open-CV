import React, { useState, useMemo } from "react";
import { Resume } from "../types/resume";
import { AtsAnalysisResult } from "../types/ats";
import { Translations } from "../i18n/translations";
import {
  FileText,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Zap,
  Target,
  Sparkles,
  Briefcase,
  FileCode2,
  Loader2,
  Check,
} from "lucide-react";
import { AtsScoreReport } from "./AtsScoreReport";

interface AtsTestPanelProps {
  resume: Resume;
  onResumeChange: (updated: Resume) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  targetRole: string;
  setTargetRole: (val: string) => void;
  atsResult: AtsAnalysisResult | null;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  hasApiKey: boolean;
  onOpenSettings: () => void;
  onSwitchToPreview: () => void;
  t: Translations;
  theme: "dark" | "light";
}

const sampleJobOffer = `Poste : Responsable de Projets & Performance Opérationnelle
Entreprise : Groupe International
Lieu : Paris / Télétravail partiel

Missions :
- Piloter et coordonner la mise en œuvre de projets stratégiques transverses.
- Définir les indicateurs de performance clés (KPIs) et assurer le reporting régulier auprès de la direction générale.
- Analyser les processus opérationnels existants et mener des chantiers d'optimisation et d'automatisation.
- Accompagner le changement et animer des réunions de travail avec les parties prenantes internes et externes.
- Veiller au respect des budgets, des délais et des exigences de qualité.

Profil recherché :
- Formation supérieure (Bac+5 / Master ou équivalent en Management, Gestion ou Ingénierie).
- Minimum 3 à 5 ans d'expérience réussie en gestion de projet ou conseil opérationnel.
- Excellente maîtrise des outils de gestion (Excel avancé, ERP, outils de pilotage collaboratifs).
- Fortes compétences d'analyse, rigueur, leadership naturel et aisance relationnelle.
- Maîtrise professionnelle de l'anglais à l'écrit comme à l'oral.`;

export const AtsTestPanel: React.FC<AtsTestPanelProps> = ({
  resume,
  onResumeChange,
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
  atsResult,
  onAnalyze,
  isAnalyzing,
  hasApiKey: _hasApiKey,
  onOpenSettings: _onOpenSettings,
  onSwitchToPreview,
  t,
  theme,
}) => {
  const isDark = theme === "dark";
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "simulator">("audit");
  const [copied, setCopied] = useState(false);

  const rawTextDump = useMemo(() => {
    const lines: string[] = [];

    lines.push(resume.basics.name.toUpperCase());
    if (resume.basics.label) lines.push(resume.basics.label);

    const contactParts: string[] = [];
    if (resume.basics.email) contactParts.push(resume.basics.email);
    if (resume.basics.phone) contactParts.push(resume.basics.phone);
    if (resume.basics.location?.city) {
      contactParts.push(
        `${resume.basics.location.city}${
          resume.basics.location.countryCode ? ", " + resume.basics.location.countryCode : ""
        }`
      );
    }
    if (resume.basics.url) {
      contactParts.push(resume.basics.url);
    }
    lines.push(contactParts.join(" | "));
    lines.push("");

    if (resume.basics.summary) {
      lines.push((t.form.summary || "Summary").toUpperCase());
      lines.push(resume.basics.summary);
      lines.push("");
    }

    const order = resume.sectionOrder || ["work", "education", "skills"];
    order.forEach((sec) => {
      if (sec === "work" && resume.work && resume.work.length > 0) {
        lines.push((t.form.experiences || "Work Experience").toUpperCase());
        resume.work.forEach((w) => {
          lines.push(`${w.position} - ${w.name}`);
          lines.push(`${w.startDate} - ${w.endDate || (t.form.present || "Present")}`);
          if (w.summary) lines.push(w.summary);
          if (w.highlights && w.highlights.length > 0) {
            w.highlights.forEach((h) => lines.push(`* ${h}`));
          }
          lines.push("");
        });
      }
      if (sec === "education" && resume.education && resume.education.length > 0) {
        lines.push((t.form.education || "Education").toUpperCase());
        resume.education.forEach((e) => {
          lines.push(`${e.studyType} en ${e.area} - ${e.institution} (${e.endDate || e.startDate})`);
        });
        lines.push("");
      }
      if (sec === "skills" && resume.skills && resume.skills.length > 0) {
        lines.push((t.form.skills || "Skills").toUpperCase());
        resume.skills.forEach((s) => {
          lines.push(`${s.name}: ${s.keywords.join(", ")}`);
        });
        lines.push("");
      }
    });

    return lines.join("\n");
  }, [resume, t]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawTextDump);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checks = useMemo(() => {
    const singleColumnPass = true;
    const standardHeadersPass =
      Boolean(resume.work?.length) &&
      Boolean(resume.skills?.length) &&
      Boolean(resume.education?.length);
    const bodyContactPass = Boolean(resume.basics.email && resume.basics.phone);
    const dateFormats = (resume.work || []).map((w) => w.startDate).filter(Boolean);
    const dateConsistencyPass =
      dateFormats.length === 0 || dateFormats.every((d) => d.includes("-") || d.length === 4);
    const totalKeywords = (resume.skills || []).reduce(
      (acc, s) => acc + (s.keywords ? s.keywords.length : 0),
      0
    );
    const keywordDensityPass = totalKeywords >= 10;
    const hasBulletsWithNumbers = (resume.work || []).some((w) =>
      (w.highlights || []).some((h) => /\d+%|\d+k|\d+M|\d+\s*(€|\$|jours|heures|utilisateurs|clients)/i.test(h))
    );

    return [
      {
        id: "single-col",
        label: t.atsTest.checkSingleColumn,
        desc: "Les ATS (Workday, Taleo, Greenhouse) lisent de haut en bas sans sauts de colonnes.",
        pass: singleColumnPass,
        tip: "100% garanti par les modèles d'Open-CV.",
      },
      {
        id: "headers",
        label: t.atsTest.checkStandardHeaders,
        desc: "Noms de sections explicites et normalisés pour indexation automatique.",
        pass: standardHeadersPass,
        tip: "Expériences, Formation et Compétences bien renseignés.",
      },
      {
        id: "contacts",
        label: t.atsTest.checkBodyContact,
        desc: "Aucun email ni téléphone enfermé dans un en-tête ou pied-de-page inaccessible.",
        pass: bodyContactPass,
        tip: "Email et téléphone présents.",
      },
      {
        id: "dates",
        label: t.atsTest.checkDateConsistency,
        desc: "Dates sous format normé (AAAA-MM ou AAAA).",
        pass: dateConsistencyPass,
        tip: "Toutes les dates respectent un format standard.",
      },
      {
        id: "star-metrics",
        label: (t.form.starBullets || "STAR Impact"),
        desc: "Pourcentages, métriques et résultats concrets valorisés pour l'algorithme.",
        pass: hasBulletsWithNumbers,
        tip: "Ex: Réduction de 25% des coûts, 50k requêtes/s.",
      },
      {
        id: "keywords",
        label: `${t.form.keywords} (${totalKeywords})`,
        desc: "Minimum 10 mots-clés techniques indexables.",
        pass: keywordDensityPass,
        tip: "Nombre de mots-clés optimal pour le ranking.",
      },
    ];
  }, [resume, t]);

  return (
    <div className="flex flex-col h-full space-y-3 overflow-hidden text-zinc-900 dark:text-zinc-100">
      <div
        className={`flex items-center justify-between p-2 rounded-xl border shrink-0 ${
          isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
        }`}
      >
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold tracking-tight">
            {t.atsTest.title}
          </span>
        </div>

        <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setActiveSubTab("audit")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              activeSubTab === "audit"
                ? isDark
                  ? "bg-zinc-800 text-white shadow-sm font-semibold"
                  : "bg-white text-zinc-900 shadow-sm font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tabs.jobOffer}</span>
            {atsResult && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-500 font-bold">
                {atsResult.overall_score}/100
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("simulator")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              activeSubTab === "simulator"
                ? isDark
                  ? "bg-zinc-800 text-white shadow-sm font-semibold"
                  : "bg-white text-zinc-900 shadow-sm font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.atsTest.notepadTitle}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {activeSubTab === "audit" ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
            <div
              className={`lg:col-span-5 h-full flex flex-col p-4 rounded-2xl border overflow-hidden space-y-3 ${
                isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-bold">{t.tabs.jobOffer}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setJobDescription(sampleJobOffer);
                    setTargetRole("Responsable de Projets & Performance Opérationnelle");
                  }}
                  className="flex items-center space-x-1 text-[11px] px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-colors"
                >
                  <FileCode2 className="w-3 h-3" />
                  <span>{t.actions.resetSample}</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                  {t.form.jobTitle}
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Ex: Senior Developer..."
                  className="w-full rounded-lg px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-zinc-500">
                    {t.form.roleSummary}
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {jobDescription.length} car.
                  </span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder={t.atsTest.subtitle}
                  className="flex-1 w-full rounded-xl p-3 text-xs leading-relaxed resize-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono"
                />
              </div>

              <button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-xs bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.actions.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{t.actions.launchAudit}</span>
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-7 h-full flex flex-col min-h-0">
              {atsResult ? (
                <AtsScoreReport
                  result={atsResult}
                  resume={resume}
                  onResumeChange={onResumeChange}
                  onSwitchToPreview={onSwitchToPreview}
                  t={t}
                />
              ) : (
                <div
                  className={`flex flex-col items-center justify-center h-full rounded-2xl border p-8 text-center space-y-3 ${
                    isDark ? "bg-[#0d0d11] border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 shadow-sm"
                  }`}
                >
                  <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                    <Target className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold">
                    {t.atsTest.title}
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
                    {t.atsTest.subtitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-y-auto">
            <div
              className={`lg:col-span-5 p-4 rounded-2xl border space-y-3 overflow-y-auto ${
                isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold">{t.atsTest.checklistTitle}</h3>
              </div>

              <div className="space-y-2.5">
                {checks.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      c.pass
                        ? isDark
                          ? "bg-zinc-950/60 border-zinc-800"
                          : "bg-zinc-50 border-zinc-200"
                        : "bg-amber-950/20 border-amber-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{c.label}</span>
                      {c.pass ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-500 font-bold text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>OK</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-400 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Check</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      {c.desc}
                    </p>
                    <div className="text-[10px] text-zinc-400 flex items-center space-x-1 pt-0.5">
                      <Info className="w-3 h-3 text-zinc-500" />
                      <span>{c.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`lg:col-span-7 p-4 rounded-2xl border flex flex-col min-h-0 space-y-3 ${
                isDark ? "bg-[#0d0d11] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-xs font-bold">
                    {t.atsTest.notepadTitle}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {t.atsTest.notepadDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? t.atsTest.copiedText : t.atsTest.copyText}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={rawTextDump}
                className="flex-1 w-full rounded-xl p-3 font-mono text-[11px] leading-relaxed resize-none bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
