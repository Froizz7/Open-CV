import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Printer,
  Wand2,
  Send,
  Loader2,
  Building,
  UserCheck,
} from "lucide-react";
import { Resume } from "../types/resume";
import { CoverLetterResult } from "../types/ats";
import { Translations } from "../i18n/translations";

interface CoverLetterGeneratorProps {
  resume: Resume;
  jobDescription: string;
  coverLetter: CoverLetterResult | null;
  onGenerate: (tone: string, company: string, manager: string, custom: string) => void;
  isGenerating: boolean;
  onLetterUpdate: (updated: CoverLetterResult) => void;
  t: Translations;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  jobDescription,
  coverLetter,
  onGenerate,
  isGenerating,
  onLetterUpdate,
  t,
}) => {
  const [tone, setTone] = useState<string>("Professionnel, direct et orienté impact");
  const [company, setCompany] = useState<string>("Société Recruteuse");
  const [manager, setManager] = useState<string>("Responsable du Recrutement");
  const [customInstructions, setCustomInstructions] = useState<string>(
    "Mettre en avant mes résultats en optimisation opérationnelle et ma capacité à coordonner des projets complexes."
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter.full_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = "";
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 p-4 space-y-4 overflow-hidden text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
              {t.tabs.coverLetter}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {coverLetter && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.actions.copied : t.actions.copy}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.actions.printLetter}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        <div className="lg:col-span-5 flex flex-col space-y-3 bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 overflow-y-auto">
          <div>
            <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t.form.company}
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                placeholder={t.form.company}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t.form.contact} / Recruiter
            </label>
            <div className="relative">
              <UserCheck className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                placeholder="Hiring Manager..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
            >
              <option value="Professional, direct and impact-oriented">
                Professional & Impact-Oriented
              </option>
              <option value="Dynamic & Startup Spirit">
                Dynamic & Startup Spirit
              </option>
              <option value="Executive & Strategic">
                Executive & Strategic
              </option>
              <option value="Technical & Precise">
                Technical & Precise
              </option>
            </select>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <label className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t.form.roleSummary}
            </label>
            <textarea
              rows={4}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="flex-1 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 resize-none"
              placeholder="..."
            />
          </div>

          <button
            onClick={() => onGenerate(tone, company, manager, customInstructions)}
            disabled={isGenerating || !jobDescription.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black py-2.5 rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white dark:text-black" />
                <span>{t.actions.generating}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>{t.actions.generateLetter}</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 flex flex-col bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 overflow-hidden">
          {coverLetter ? (
            <div className="flex-1 flex flex-col space-y-3 min-h-0">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-300">
                  {t.tabs.coverLetter}
                </span>
                <span className="text-[11px] text-zinc-500">
                  Markdown
                </span>
              </div>

              <textarea
                value={coverLetter.full_markdown}
                onChange={(e) =>
                  onLetterUpdate({ ...coverLetter, full_markdown: e.target.value })
                }
                className="flex-1 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 text-xs text-zinc-900 dark:text-zinc-100 font-sans leading-relaxed focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 resize-none"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                <Send className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {t.actions.generateLetter}
              </p>
              <p className="text-[11px] text-zinc-500 max-w-sm">
                {t.appSubtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
