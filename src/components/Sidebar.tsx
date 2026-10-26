import React, { useRef } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  RotateCcw,
  Upload,
  Loader2,
} from "lucide-react";
import { Translations } from "../i18n/translations";

export type SidebarSection = "basics" | "work" | "education" | "skills";

interface SidebarProps {
  activeSection: SidebarSection;
  onSelectSection: (section: SidebarSection) => void;
  experienceCount: number;
  educationCount: number;
  skillsCount: number;
  t: Translations;
  theme: "dark" | "light";
  onResetSample?: () => void;
  onImportResume?: (file: File) => void;
  isImporting?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  experienceCount,
  educationCount,
  skillsCount,
  t,
  theme,
  onResetSample,
  onImportResume,
  isImporting,
}) => {
  const isDark = theme === "dark";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportResume) {
      onImportResume(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const navItems: {
    id: SidebarSection;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: "basics",
      label: t.form.contact,
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "work",
      label: t.form.experiences,
      icon: <Briefcase className="w-4 h-4" />,
      badge: experienceCount,
    },
    {
      id: "education",
      label: t.form.education,
      icon: <GraduationCap className="w-4 h-4" />,
      badge: educationCount,
    },
    {
      id: "skills",
      label: t.form.skills,
      icon: <Wrench className="w-4 h-4" />,
      badge: skillsCount,
    },
  ];

  return (
    <aside
      className={`sidebar no-print w-56 border-r flex flex-col justify-between shrink-0 select-none transition-colors ${
        isDark
          ? "bg-[#09090c] border-zinc-800/80 text-zinc-300"
          : "bg-white border-zinc-200 text-zinc-700"
      }`}
    >
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
          {t.tabs.profile}
        </div>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? isDark
                    ? "bg-zinc-800 text-white shadow-sm font-semibold"
                    : "bg-zinc-100 text-zinc-900 shadow-sm font-semibold"
                  : isDark
                  ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={isActive ? "text-emerald-400" : "text-zinc-500"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-zinc-700 text-zinc-200"
                      : "bg-zinc-800/60 text-zinc-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={`p-3 border-t ${isDark ? "border-zinc-800/40" : "border-zinc-200"}`}>
        {onImportResume && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.json,.txt,.md"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all mb-2 disabled:opacity-50 ${
                isDark
                  ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white shadow-sm"
                  : "bg-black hover:bg-zinc-800 border-zinc-900 text-white shadow-sm"
              }}`}
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.actions.importing || "Analyse en cours..."}</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.actions.importResume || "Importer un CV"}</span>
                </>
              )}
            </button>
          </>
        )}

        {onResetSample && (
          <button
            onClick={onResetSample}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all mb-2.5 ${
              isDark
                ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
                : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.actions.resetSample || "Modèle exemple"}</span>
          </button>
        )}
        <div className="text-[10px] text-zinc-500 text-center">
          ATS Optimized
        </div>
      </div>
    </aside>
  );
};
