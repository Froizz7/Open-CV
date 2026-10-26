import React, { useState, useRef } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Plus,
  Trash2,
  FileText,
  Upload,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Resume, WorkExperience, Education, SkillGroup } from "../types/resume";
import { Translations } from "../i18n/translations";
import { SidebarSection } from "./Sidebar";

interface ResumeFormProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
  activeSection: SidebarSection;
  onSelectSection: (section: SidebarSection) => void;
  t: Translations;
  theme: "dark" | "light";
}

export const ResumeForm: React.FC<ResumeFormProps> = ({
  resume,
  onChange,
  activeSection,
  onSelectSection: _onSelectSection,
  t,
  theme,
}) => {
  const isDark = theme === "dark";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [expandedWork, setExpandedWork] = useState<number | null>(0);
  const [expandedEdu, setExpandedEdu] = useState<number | null>(0);
  const [newSkillTag, setNewSkillTag] = useState<{ [index: number]: string }>({});

  const updateBasics = (field: string, value: string) => {
    if (field in (resume.basics.location || {})) {
      onChange({
        ...resume,
        basics: {
          ...resume.basics,
          location: {
            ...resume.basics.location,
            [field]: value,
          },
        },
      });
    } else {
      onChange({
        ...resume,
        basics: {
          ...resume.basics,
          [field]: value,
        },
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("La taille du fichier ne doit pas dépasser 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange({
          ...resume,
          basics: {
            ...resume.basics,
            image: reader.result,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const currentSectionOrder: ("work" | "skills" | "education")[] =
    resume.sectionOrder || ["work", "skills", "education"];

  const moveSection = (section: "work" | "skills" | "education", direction: "up" | "down") => {
    const order = [...currentSectionOrder];
    const index = order.indexOf(section);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const [item] = order.splice(index, 1);
    order.splice(targetIndex, 0, item);
    onChange({ ...resume, sectionOrder: order });
  };

  const moveWork = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= resume.work.length) return;
    const updated = [...resume.work];
    const [item] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, item);
    onChange({ ...resume, work: updated });
    setExpandedWork(targetIndex);
  };

  const moveHighlight = (workIndex: number, hlIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? hlIndex - 1 : hlIndex + 1;
    if (targetIndex < 0 || targetIndex >= (resume.work[workIndex].highlights || []).length) return;
    const updated = [...resume.work];
    const highlights = [...(updated[workIndex].highlights || [])];
    const [item] = highlights.splice(hlIndex, 1);
    highlights.splice(targetIndex, 0, item);
    updated[workIndex].highlights = highlights;
    onChange({ ...resume, work: updated });
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= resume.education.length) return;
    const updated = [...resume.education];
    const [item] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, item);
    onChange({ ...resume, education: updated });
    setExpandedEdu(targetIndex);
  };

  const moveSkillGroup = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= resume.skills.length) return;
    const updated = [...resume.skills];
    const [item] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, item);
    onChange({ ...resume, skills: updated });
  };

  const addWork = () => {
    const newWork: WorkExperience = {
      name: t.form.company || "Company",
      position: t.form.position || "Position",
      startDate: "2023-01",
      endDate: t.form.present || "Present",
      summary: "",
      highlights: ["Accomplissement mesurable chiffré (ex: +25% de productivité)."],
    };
    onChange({ ...resume, work: [newWork, ...(resume.work || [])] });
    setExpandedWork(0);
  };

  const removeWork = (index: number) => {
    const updated = [...resume.work];
    updated.splice(index, 1);
    onChange({ ...resume, work: updated });
  };

  const updateWorkField = (index: number, field: keyof WorkExperience, value: unknown) => {
    const updated = [...resume.work];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, work: updated });
  };

  const addHighlight = (workIndex: number) => {
    const updated = [...resume.work];
    updated[workIndex].highlights = [...(updated[workIndex].highlights || []), t.form.starBullets || "Quantified STAR achievement"];
    onChange({ ...resume, work: updated });
  };

  const updateHighlight = (workIndex: number, hlIndex: number, text: string) => {
    const updated = [...resume.work];
    const newHighlights = [...updated[workIndex].highlights];
    newHighlights[hlIndex] = text;
    updated[workIndex].highlights = newHighlights;
    onChange({ ...resume, work: updated });
  };

  const removeHighlight = (workIndex: number, hlIndex: number) => {
    const updated = [...resume.work];
    const newHighlights = [...updated[workIndex].highlights];
    newHighlights.splice(hlIndex, 1);
    updated[workIndex].highlights = newHighlights;
    onChange({ ...resume, work: updated });
  };

  const addSkillGroup = () => {
    const newGroup: SkillGroup = {
      name: t.form.skills || "Skills",
      level: "Advanced",
      keywords: ["Compétence 1", "Compétence 2"],
    };
    onChange({ ...resume, skills: [...(resume.skills || []), newGroup] });
  };

  const removeSkillGroup = (index: number) => {
    const updated = [...resume.skills];
    updated.splice(index, 1);
    onChange({ ...resume, skills: updated });
  };

  const addTagToGroup = (groupIndex: number) => {
    const tag = (newSkillTag[groupIndex] || "").trim();
    if (!tag) return;
    const updated = [...resume.skills];
    if (!updated[groupIndex].keywords.includes(tag)) {
      updated[groupIndex].keywords = [...updated[groupIndex].keywords, tag];
      onChange({ ...resume, skills: updated });
    }
    setNewSkillTag({ ...newSkillTag, [groupIndex]: "" });
  };

  const removeTagFromGroup = (groupIndex: number, tagIndex: number) => {
    const updated = [...resume.skills];
    const kw = [...updated[groupIndex].keywords];
    kw.splice(tagIndex, 1);
    updated[groupIndex].keywords = kw;
    onChange({ ...resume, skills: updated });
  };

  const addEducation = () => {
    const newEdu: Education = {
      institution: t.form.school || "University",
      studyType: t.form.degree || "Degree",
      area: t.form.area || "Field of Study",
      startDate: "2020-09",
      endDate: "2022-06",
    };
    onChange({ ...resume, education: [newEdu, ...(resume.education || [])] });
    setExpandedEdu(0);
  };

  const removeEducation = (index: number) => {
    const updated = [...resume.education];
    updated.splice(index, 1);
    onChange({ ...resume, education: updated });
  };

  const updateEducationField = (index: number, field: keyof Education, value: string) => {
    const updated = [...resume.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, education: updated });
  };

  return (
    <div
      className={`no-print flex flex-col h-full rounded-2xl border p-4 space-y-4 overflow-y-auto transition-colors ${
        isDark
          ? "bg-[#0d0d11] border-zinc-800/80 text-zinc-100"
          : "bg-white border-zinc-200 text-zinc-900 shadow-sm"
      }`}
    >
      <div
        className={`p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 ${
          isDark ? "bg-zinc-950/80 border-zinc-800" : "bg-zinc-50 border-zinc-200"
        }`}
      >
        <span className="text-[11px] font-semibold text-zinc-400">
          {t.form.sectionOrder || "Section order on resume"}:
        </span>
        <div className="flex items-center space-x-1.5">
          {currentSectionOrder.map((sec, sIdx) => {
            const label =
              sec === "work"
                ? t.form.experiences
                : sec === "skills"
                ? t.form.skills
                : t.form.education;
            return (
              <div
                key={sec}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-[11px] font-medium ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                    : "bg-white border-zinc-300 text-zinc-800 shadow-xs"
                }`}
              >
                <span>{label}</span>
                <button
                  type="button"
                  disabled={sIdx === 0}
                  onClick={() => moveSection(sec, "up")}
                  className="p-0.5 hover:text-white disabled:opacity-20 transition-colors"
                  title="Move left"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={sIdx === currentSectionOrder.length - 1}
                  onClick={() => moveSection(sec, "down")}
                  className="p-0.5 hover:text-white disabled:opacity-20 transition-colors"
                  title="Move right"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {activeSection === "basics" && (
        <div className="space-y-4">
          <div className="pb-3 border-b border-zinc-800/60">
            <h2 className="text-sm font-bold tracking-tight text-zinc-100 flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>{t.form.contact}</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {t.form.contactSubtitle || "Contact information & professional summary"}
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-3.5 ${
              isDark ? "bg-zinc-950/60 border-zinc-800/80" : "bg-zinc-50 border-zinc-200"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {t.form.fullName} *
                </label>
                <input
                  type="text"
                  value={resume.basics.name}
                  onChange={(e) => updateBasics("name", e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {t.form.jobTitle} *
                </label>
                <input
                  type="text"
                  value={resume.basics.label}
                  onChange={(e) => updateBasics("label", e.target.value)}
                  placeholder="Job"
                  className="w-full rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {t.form.email} *
                </label>
                <input
                  type="email"
                  value={resume.basics.email}
                  onChange={(e) => updateBasics("email", e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {t.form.phone}
                </label>
                <input
                  type="tel"
                  value={resume.basics.phone}
                  onChange={(e) => updateBasics("phone", e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {t.form.city}
                </label>
                <input
                  type="text"
                  value={resume.basics.location?.city || ""}
                  onChange={(e) => updateBasics("city", e.target.value)}
                  placeholder="Los Angeles, United States"
                  className="w-full rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {t.form.linkedin}
                </label>
                <input
                  type="text"
                  value={resume.basics.url || ""}
                  onChange={(e) => updateBasics("url", e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  className="w-full rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/40 flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-700 shrink-0">
                {resume.basics.image ? (
                  <img
                    src={resume.basics.image}
                    alt="Candidat"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-zinc-500" />
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
                      isDark
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                        : "bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{resume.basics.image ? (t.form.changePhoto || "Change photo") : (t.form.addPhoto || "Add photo")}</span>
                  </button>
                  {resume.basics.image && (
                    <button
                      type="button"
                      onClick={() => updateBasics("image", "")}
                      className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      {t.form.removePhoto || "Remove"}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500">
                  {t.form.photoNote || "Optional. ATS systems favor resumes without photo."}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2.5 ${
              isDark ? "bg-zinc-950/60 border-zinc-800/80" : "bg-zinc-50 border-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 font-semibold">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{t.form.summary}</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">
                {(resume.basics.summary || "").length} / 600
              </span>
            </div>

            <textarea
              value={resume.basics.summary}
              onChange={(e) => updateBasics("summary", e.target.value)}
              rows={4}
              maxLength={600}
              className="w-full rounded-lg p-2.5 text-xs leading-relaxed resize-none"
              placeholder={t.form.summaryPlaceholder || "Briefly summarize your key competencies..."}
            />
          </div>
        </div>
      )}

      {activeSection === "work" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-zinc-100 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>{t.form.experiences} ({resume.work?.length || 0})</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t.form.experiencesSubtitle}
              </p>
            </div>
            <button
              onClick={addWork}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDark
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 shadow-sm"
                  : "bg-zinc-900 hover:bg-black text-white border-zinc-800 shadow-sm"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.actions.addExperience}</span>
            </button>
          </div>

          <div className="space-y-3">
            {(!resume.work || resume.work.length === 0) && (
              <div className="p-8 text-center text-xs text-zinc-500 rounded-xl border border-dashed border-zinc-800">
                {t.form.noExperience || "No experience added yet."}
              </div>
            )}
            {resume.work?.map((work, idx) => {
              const isExpanded = expandedWork === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all text-xs overflow-hidden ${
                    isDark ? "bg-zinc-950/60 border-zinc-800/80" : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <div
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/20"
                    onClick={() => setExpandedWork(isExpanded ? null : idx)}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-zinc-200">
                        {work.position || t.form.position}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {work.name || t.form.company} • {work.startDate || "YYYY-MM"} – {work.endDate || "Present"}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveWork(idx, "up");
                        }}
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (resume.work || []).length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveWork(idx, "down");
                        }}
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWork(idx);
                        }}
                        className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3.5 pt-0 border-t border-zinc-800/40 space-y-3 mt-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">
                            {t.form.position} *
                          </label>
                          <input
                            type="text"
                            value={work.position}
                            onChange={(e) => updateWorkField(idx, "position", e.target.value)}
                            className="w-full rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">
                            {t.form.company} *
                          </label>
                          <input
                            type="text"
                            value={work.name}
                            onChange={(e) => updateWorkField(idx, "name", e.target.value)}
                            className="w-full rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">
                            {t.form.startDate}
                          </label>
                          <input
                            type="text"
                            value={work.startDate}
                            onChange={(e) => updateWorkField(idx, "startDate", e.target.value)}
                            className="w-full rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">
                            {t.form.endDate}
                          </label>
                          <input
                            type="text"
                            value={work.endDate || ""}
                            onChange={(e) => updateWorkField(idx, "endDate", e.target.value)}
                            className="w-full rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-zinc-800/40">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                            {t.form.starBullets}
                          </label>
                          <button
                            type="button"
                            onClick={() => addHighlight(idx)}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            {t.form.addHighlight || "+ Add bullet"}
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {work.highlights?.map((hl, hlIdx) => (
                            <div key={hlIdx} className="flex items-center space-x-1.5">
                              <input
                                type="text"
                                value={hl}
                                onChange={(e) => updateHighlight(idx, hlIdx, e.target.value)}
                                className="flex-1 rounded px-2.5 py-1 text-xs"
                              />
                              <button
                                type="button"
                                disabled={hlIdx === 0}
                                onClick={() => moveHighlight(idx, hlIdx, "up")}
                                className="text-zinc-500 hover:text-white disabled:opacity-20 p-1"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={hlIdx === (work.highlights || []).length - 1}
                                onClick={() => moveHighlight(idx, hlIdx, "down")}
                                className="text-zinc-500 hover:text-white disabled:opacity-20 p-1"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeHighlight(idx, hlIdx)}
                                className="text-zinc-500 hover:text-rose-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSection === "education" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-zinc-100 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>{t.form.education} ({resume.education?.length || 0})</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t.form.educationSubtitle}
              </p>
            </div>
            <button
              onClick={addEducation}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDark
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 shadow-sm"
                  : "bg-zinc-900 hover:bg-black text-white border-zinc-800 shadow-sm"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.actions.addEducation}</span>
            </button>
          </div>

          <div className="space-y-3">
            {(!resume.education || resume.education.length === 0) && (
              <div className="p-8 text-center text-xs text-zinc-500 rounded-xl border border-dashed border-zinc-800">
                {t.form.noEducation || "No education added yet."}
              </div>
            )}
            {resume.education?.map((edu, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                  isDark ? "bg-zinc-950/60 border-zinc-800/80" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-zinc-200">
                    {edu.studyType} {edu.area && `– ${edu.area}`}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveEducation(idx, "up")}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (resume.education || []).length - 1}
                      onClick={() => moveEducation(idx, "down")}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setExpandedEdu(expandedEdu === idx ? null : idx)}
                      className="p-1 text-zinc-400 hover:text-zinc-200"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedEdu === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => removeEducation(idx)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-zinc-400 text-[11px]">
                  {edu.institution} {edu.endDate && `• ${edu.endDate}`}
                </div>

                {expandedEdu === idx && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">{t.form.degree} *</label>
                      <input
                        type="text"
                        value={edu.studyType}
                        onChange={(e) => updateEducationField(idx, "studyType", e.target.value)}
                        className="w-full rounded px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">{t.form.area}</label>
                      <input
                        type="text"
                        value={edu.area}
                        onChange={(e) => updateEducationField(idx, "area", e.target.value)}
                        className="w-full rounded px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">{t.form.school} *</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducationField(idx, "institution", e.target.value)}
                        className="w-full rounded px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">{t.form.dateYear}</label>
                      <input
                        type="text"
                        value={edu.endDate || ""}
                        onChange={(e) => updateEducationField(idx, "endDate", e.target.value)}
                        className="w-full rounded px-2.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "skills" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-zinc-100 flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>{t.form.skills} ({resume.skills?.length || 0})</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t.form.skillsSubtitle}
              </p>
            </div>
            <button
              onClick={addSkillGroup}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDark
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 shadow-sm"
                  : "bg-zinc-900 hover:bg-black text-white border-zinc-800 shadow-sm"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.actions.addSkillGroup}</span>
            </button>
          </div>

          <div className="space-y-3">
            {(!resume.skills || resume.skills.length === 0) && (
              <div className="p-8 text-center text-xs text-zinc-500 rounded-xl border border-dashed border-zinc-800">
                {t.form.noSkills || "No skills added yet."}
              </div>
            )}
            {resume.skills?.map((group, gIdx) => (
              <div
                key={gIdx}
                className={`p-3.5 rounded-xl border space-y-2.5 text-xs ${
                  isDark ? "bg-zinc-950/60 border-zinc-800/80" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => {
                      const updated = [...resume.skills];
                      updated[gIdx].name = e.target.value;
                      onChange({ ...resume, skills: updated });
                    }}
                    className="font-bold text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                  />
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={gIdx === 0}
                      onClick={() => moveSkillGroup(gIdx, "up")}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={gIdx === (resume.skills || []).length - 1}
                      onClick={() => moveSkillGroup(gIdx, "down")}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeSkillGroup(gIdx)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {group.keywords.map((kw, kIdx) => (
                    <span
                      key={kIdx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 text-xs border border-zinc-700"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => removeTagFromGroup(gIdx, kIdx)}
                        className="text-zinc-400 hover:text-white ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-1.5 pt-1">
                  <input
                    type="text"
                    value={newSkillTag[gIdx] || ""}
                    onChange={(e) =>
                      setNewSkillTag({ ...newSkillTag, [gIdx]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTagToGroup(gIdx);
                      }
                    }}
                    placeholder={t.form.keywords}
                    className="flex-1 rounded px-2.5 py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => addTagToGroup(gIdx)}
                    className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
                  >
                    {t.actions.addKeyword || "Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
