import React from "react";
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  ArrowRight,
  PlusCircle,
  FileCheck,
  Check,
} from "lucide-react";
import { AtsAnalysisResult } from "../types/ats";
import { Resume } from "../types/resume";
import { Translations } from "../i18n/translations";

interface AtsScoreReportProps {
  result: AtsAnalysisResult;
  resume: Resume;
  onResumeChange: (updated: Resume) => void;
  onSwitchToPreview: () => void;
  t: Translations;
}

export const AtsScoreReport: React.FC<AtsScoreReportProps> = ({
  result,
  resume,
  onResumeChange,
  onSwitchToPreview,
  t,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/40 bg-emerald-950/20";
    if (score >= 65) return "text-amber-400 border-amber-500/40 bg-amber-950/20";
    return "text-rose-400 border-rose-500/40 bg-rose-950/20";
  };

  const getScoreBadgeText = (score: number) => {
    if (score >= 85) return t.ats.readyForSubmission;
    if (score >= 70) return t.ats.goodMatch;
    if (score >= 50) return t.ats.moderateMatch;
    return t.ats.poorMatch;
  };

  const addMissingKeyword = (kw: string) => {
    if (!resume.skills || resume.skills.length === 0) return;
    const updatedSkills = [...resume.skills];
    if (!updatedSkills[0].keywords.includes(kw)) {
      updatedSkills[0].keywords = [...updatedSkills[0].keywords, kw];
      onResumeChange({ ...resume, skills: updatedSkills });
    }
  };

  const applyStarImprovement = (original: string, improved: string) => {
    let replaced = false;
    const updatedWork = resume.work.map((w) => {
      const newHighlights = w.highlights.map((hl) => {
        if (hl.trim() === original.trim() || hl.includes(original) || original.includes(hl)) {
          replaced = true;
          return improved;
        }
        return hl;
      });
      return { ...w, highlights: newHighlights };
    });

    if (replaced) {
      onResumeChange({ ...resume, work: updatedWork });
    } else {
      if (updatedWork.length > 0) {
        updatedWork[0].highlights.push(improved);
        onResumeChange({ ...resume, work: updatedWork });
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 p-4 space-y-5 overflow-y-auto text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors">
      <div className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-bold shadow-lg ${getScoreColor(
              result.overall_score
            )}`}
          >
            <span className="text-2xl tracking-tight leading-none">
              {result.overall_score}
            </span>
            <span className="text-[10px] uppercase font-semibold opacity-75 mt-0.5">
              / 100
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {t.ats.overallScore}
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium mt-0.5">
              {getScoreBadgeText(result.overall_score)}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl line-clamp-2">
              {result.summary}
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToPreview}
          className="flex items-center space-x-1.5 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-3 py-2 rounded-xl text-xs font-semibold shadow-md transition-all shrink-0"
        >
          <FileCheck className="w-4 h-4" />
          <span>{t.actions.viewPreview}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.ats.matchedKeywords} ({result.matched_keywords.length})</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {t.atsTest ? t.atsTest.checklistTitle : "Keywords identified by parser:"}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {result.matched_keywords.map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60"
              >
                <Check className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>{t.ats.missingKeywords} ({result.missing_keywords.length})</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {t.actions.addKeyword} :
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {result.missing_keywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => addMissingKeyword(kw)}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                title="Add to profile"
              >
                <span>{kw}</span>
                <PlusCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 ml-0.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              {t.ats.starRecommendations}
            </h4>
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {result.star_improvements.length} suggestions
          </span>
        </div>

        <div className="space-y-3">
          {result.star_improvements.map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl p-3.5 space-y-2.5 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                    {t.ats.currentVague}
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 text-xs italic">
                    "{item.original_text}"
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      {t.ats.starOptimized}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-500/30">
                      {item.impact_metric}
                    </span>
                  </div>
                  <p className="text-zinc-900 dark:text-white text-xs font-medium">
                    "{item.improved_text}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-zinc-200 dark:border-zinc-900 text-xs">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                  💡 {item.rationale}
                </p>

                <button
                  onClick={() =>
                    applyStarImprovement(item.original_text, item.improved_text)
                  }
                  className="flex items-center space-x-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200 px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 transition-colors shrink-0"
                >
                  <span>{t.actions.applySuggestion}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          {t.ats.sectionBreakdown}
        </h4>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t.form.experiences}</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {result.section_critique.experience_score}/100
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-black dark:bg-white h-full rounded-full"
                style={{ width: `${result.section_critique.experience_score}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {result.section_critique.experience_feedback}
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t.form.skills}</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {result.section_critique.skills_score}/100
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-black dark:bg-white h-full rounded-full"
                style={{ width: `${result.section_critique.skills_score}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {result.section_critique.skills_feedback}
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t.form.education}</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {result.section_critique.education_score}/100
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-black dark:bg-white h-full rounded-full"
                style={{ width: `${result.section_critique.education_score}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {result.section_critique.education_feedback}
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{t.atsTest.checklistTitle}</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {result.section_critique.formatting_score}/100
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-black dark:bg-white h-full rounded-full"
                style={{ width: `${result.section_critique.formatting_score}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {result.section_critique.formatting_feedback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
