import React, { useState } from "react";
import {
  Scale,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { Resume } from "../types/resume";
import { JobOfferInput, JobComparisonResult } from "../types/ats";
import { Translations } from "../i18n/translations";
import { safeInvoke } from "../utils/tauri";

interface JobMatchPanelProps {
  resume: Resume;
  theme: "dark" | "light";
  language: string;
  t: Translations;
}

export const JobMatchPanel: React.FC<JobMatchPanelProps> = ({
  resume,
  theme,
  t,
}) => {
  const isDark = theme === "dark";
  const i18n = t.jobMatchPanel;

  const [offers, setOffers] = useState<JobOfferInput[]>([
    {
      id: "offer-1",
      title: "Senior AI Engineer",
      company: "Tech Corp",
      description: "",
    },
    {
      id: "offer-2",
      title: "MLOps Specialist",
      company: "Scale AI",
      description: "",
    },
  ]);

  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<JobComparisonResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addOffer = () => {
    if (offers.length >= 5) return;
    const newId = `offer-${Date.now()}`;
    setOffers((prev) => [
      ...prev,
      {
        id: newId,
        title: `${i18n?.offerPrefix || "Offre #"}${prev.length + 1}`,
        company: "",
        description: "",
      },
    ]);
  };

  const removeOffer = (id: string) => {
    if (offers.length <= 2) return;
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const updateOffer = (
    id: string,
    field: keyof JobOfferInput,
    val: string
  ) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: val } : o))
    );
  };

  const handleCompare = async () => {
    for (const o of offers) {
      if (!o.description.trim()) {
        setErrorMsg(
          i18n?.errorNeedDesc || "Toutes les offres d'emploi doivent comporter une description détaillée."
        );
        return;
      }
    }
    setErrorMsg(null);
    setIsComparing(true);
    try {
      const res = await safeInvoke<JobComparisonResult>("compare_multiple_jobs", {
        profile: resume,
        offers,
      });
      setResult(res);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setIsComparing(false);
    }
  };

  const resetComparison = () => {
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-500" />
            {i18n?.title || "Job Match — Comparateur Multi-Offres"}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {i18n?.subtitle || "Comparez votre CV avec 2 à 5 offres d'emploi simultanément pour cibler la candidature la plus prometteuse."}
          </p>
        </div>
        {result && (
          <button
            onClick={resetComparison}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {i18n?.editOffers || "Modifier les offres"}
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {offers.map((offer, idx) => (
              <div
                key={offer.id}
                className={`p-5 rounded-2xl border transition ${
                  isDark
                    ? "bg-zinc-900/60 border-zinc-800 focus-within:border-emerald-500/50"
                    : "bg-white border-zinc-200 shadow-sm focus-within:border-emerald-600"
                }`}
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                    {i18n?.offerPrefix || "Offre #"}{idx + 1}
                  </span>
                  {offers.length > 2 && (
                    <button
                      onClick={() => removeOffer(offer.id)}
                      className="text-zinc-400 hover:text-red-500 p-1 transition"
                      title={i18n?.deleteOffer || "Supprimer cette offre"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                        {i18n?.jobTitleLabel || "Intitulé du poste"}
                      </label>
                      <input
                        type="text"
                        value={offer.title}
                        onChange={(e) =>
                          updateOffer(offer.id, "title", e.target.value)
                        }
                        placeholder="Ex: Senior AI Engineer"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none transition ${
                          isDark
                            ? "bg-zinc-950 border-zinc-800 text-white"
                            : "bg-zinc-50 border-zinc-200 text-zinc-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                        {i18n?.companyLabel || "Entreprise"}
                      </label>
                      <input
                        type="text"
                        value={offer.company}
                        onChange={(e) =>
                          updateOffer(offer.id, "company", e.target.value)
                        }
                        placeholder="Ex: Google, ScaleUp..."
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none transition ${
                          isDark
                            ? "bg-zinc-950 border-zinc-800 text-white"
                            : "bg-zinc-50 border-zinc-200 text-zinc-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      {i18n?.descLabel || "Description de l'offre & prérequis"}
                    </label>
                    <textarea
                      rows={6}
                      value={offer.description}
                      onChange={(e) =>
                        updateOffer(offer.id, "description", e.target.value)
                      }
                      placeholder={i18n?.descPlaceholder || "Collez ici l'intégralité du texte de l'offre d'emploi..."}
                      className={`w-full p-3 rounded-lg border text-xs outline-none transition leading-relaxed ${
                        isDark
                          ? "bg-zinc-950 border-zinc-800 text-white"
                          : "bg-zinc-50 border-zinc-200 text-zinc-900"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {offers.length < 5 && (
                <button
                  onClick={addOffer}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-dashed border-zinc-400 dark:border-zinc-700 hover:border-emerald-500 text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {i18n?.addOfferBtn?.replace("{count}", String(offers.length)) || `Ajouter une offre (${offers.length}/5)`}
                </button>
              )}
            </div>

            <button
              onClick={handleCompare}
              disabled={isComparing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition disabled:opacity-50 shadow-sm"
            >
              {isComparing ? (
                <>
                  <div className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                  <span>{i18n?.comparingTitle || "Analyse comparative en cours..."}</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>{i18n?.compareBtn?.replace("{count}", String(offers.length)) || `Lancer le comparateur (${offers.length} offres)`}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              {i18n?.globalSummaryTitle || "Synthèse comparative globale"}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {result.global_summary}
            </p>
          </div>

          <div className="space-y-5">
            {result.ranked_jobs.map((item) => {
              const isBest = item.id === result.best_match_id;
              return (
                <div
                  key={item.id}
                  className={`p-6 rounded-2xl border transition ${
                    isBest
                      ? "border-emerald-500/80 bg-emerald-500/5 shadow-md"
                      : isDark
                      ? "border-zinc-800 bg-zinc-900/50"
                      : "border-zinc-200 bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                          item.ranking === 1
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        #{item.ranking}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                            {item.title}
                          </h4>
                          {isBest && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 uppercase tracking-wide">
                              {i18n?.bestMatchBadge || "Meilleur match"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.company || "Entreprise"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xl font-black ${
                          item.match_score >= 80
                            ? "text-emerald-500"
                            : item.match_score >= 60
                            ? "text-amber-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.match_score} %
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-400">
                        {i18n?.atsMatchLabel || "Compatibilité ATS"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 block mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {i18n?.matchedSkills?.replace("{count}", String(item.matched_skills.length)) || `Compétences validées (${item.matched_skills.length})`}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.matched_skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 block mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {i18n?.missingSkills?.replace("{count}", String(item.missing_skills.length)) || `Compétences manquantes (${item.missing_skills.length})`}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.missing_skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                      <span className="font-semibold text-zinc-900 dark:text-white block mb-1">
                        {i18n?.strengthsTitle || "Points forts pour ce poste :"}
                      </span>
                      <ul className="space-y-1 text-zinc-600 dark:text-zinc-400">
                        {item.strengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                      <span className="font-semibold text-zinc-900 dark:text-white block mb-1 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        {i18n?.recommendationsTitle || "Recommandations d'ajustement :"}
                      </span>
                      <ul className="space-y-1 text-zinc-600 dark:text-zinc-400">
                        {item.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
