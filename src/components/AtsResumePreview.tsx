import React, { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Camera,
  FileDown,
  FileText,
  Loader2,
} from "lucide-react";
import { Resume } from "../types/resume";
import { Translations } from "../i18n/translations";
import { exportResumeToDocx } from "../utils/docxExport";

export type TemplateId = "minimal" | "corporate" | "serif" | "darkMinimal";

interface AtsResumePreviewProps {
  resume: Resume;
  onPrint: () => void;
  t: Translations;
  template?: TemplateId;
  onTemplateChange?: (tpl: TemplateId) => void;
  showPhoto?: boolean;
  onTogglePhoto?: () => void;
  theme?: "dark" | "light";
}

export const AtsResumePreview: React.FC<AtsResumePreviewProps> = ({
  resume,
  onPrint,
  t,
  template: propTemplate,
  onTemplateChange,
  showPhoto: propShowPhoto,
  onTogglePhoto,
  theme,
}) => {
  const isDark = theme === "dark";
  const [internalZoom, setZoom] = useState<number>(100);
  const [internalTemplate, setInternalTemplate] = useState<TemplateId>("minimal");
  const [internalShowPhoto, setInternalShowPhoto] = useState<boolean>(true);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  const template = propTemplate ?? internalTemplate;
  const showPhoto = propShowPhoto ?? internalShowPhoto;
  const sectionOrder: ("work" | "education" | "skills")[] =
    resume.sectionOrder || ["work", "education", "skills"];

  const summaryTitle = (t.form.summary || "Summary").toUpperCase();
  const workTitle = (t.form.experiences || "Work Experience").toUpperCase();
  const eduTitle = (t.form.education || "Education").toUpperCase();
  const skillsTitle = (t.form.skills || "Skills").toUpperCase();

  const handleSelectTemplate = (tpl: TemplateId) => {
    if (onTemplateChange) {
      onTemplateChange(tpl);
    } else {
      setInternalTemplate(tpl);
    }
  };

  const handleTogglePhoto = () => {
    if (onTogglePhoto) {
      onTogglePhoto();
    } else {
      setInternalShowPhoto(!internalShowPhoto);
    }
  };

  return (
    <div
      className={`resume-preview-col flex flex-col h-full rounded-2xl border p-3 space-y-3 overflow-hidden shadow-sm relative transition-colors ${
        isDark
          ? "bg-[#0d0d11] border-zinc-800/80 text-zinc-100"
          : "bg-white border-zinc-200 text-zinc-900"
      }`}
    >
      <div
        className={`no-print flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b shrink-0 ${
          isDark ? "border-zinc-800/80" : "border-zinc-200"
        }`}
      >
        <div
          className={`flex items-center space-x-1 p-1 rounded-xl border text-xs ${
            isDark ? "bg-black/60 border-zinc-800" : "bg-zinc-100 border-zinc-200"
          }`}
        >
          <button
            onClick={() => handleSelectTemplate("minimal")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              template === "minimal"
                ? isDark
                  ? "bg-zinc-800 text-white font-semibold shadow-sm"
                  : "bg-white text-zinc-900 font-semibold shadow-sm"
                : isDark
                ? "text-zinc-400 hover:text-zinc-200"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {t.templates.minimal}
          </button>
          <button
            onClick={() => handleSelectTemplate("corporate")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              template === "corporate"
                ? isDark
                  ? "bg-zinc-800 text-white font-semibold shadow-sm"
                  : "bg-white text-zinc-900 font-semibold shadow-sm"
                : isDark
                ? "text-zinc-400 hover:text-zinc-200"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {t.templates.corporate}
          </button>
          <button
            onClick={() => handleSelectTemplate("serif")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              template === "serif"
                ? isDark
                  ? "bg-zinc-800 text-white font-semibold shadow-sm"
                  : "bg-white text-zinc-900 font-semibold shadow-sm"
                : isDark
                ? "text-zinc-400 hover:text-zinc-200"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {t.templates.serif}
          </button>
          <button
            onClick={() => handleSelectTemplate("darkMinimal")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              template === "darkMinimal"
                ? isDark
                  ? "bg-zinc-800 text-white font-semibold shadow-sm"
                  : "bg-white text-zinc-900 font-semibold shadow-sm"
                : isDark
                ? "text-zinc-400 hover:text-zinc-200"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {t.templates.darkMinimal}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleTogglePhoto}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showPhoto
                ? isDark
                  ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  : "bg-emerald-50 border-emerald-300 text-emerald-700"
                : isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                : "bg-zinc-100 border-zinc-200 text-zinc-600"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{showPhoto ? (t.form.photoOn || "Photo ON") : (t.form.photoOff || "Photo OFF")}</span>
          </button>

          <div
            className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg border text-xs ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                : "bg-zinc-100 border-zinc-200 text-zinc-700"
            }`}
          >
            <button
              onClick={() => setZoom((z) => Math.max(65, z - 10))}
              className={`p-0.5 transition-colors ${isDark ? "hover:text-white text-zinc-400" : "hover:text-black text-zinc-600"}`}
              title={t.form.zoomOut || "Zoom out"}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs font-semibold px-1">
              {internalZoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className={`p-0.5 transition-colors ${isDark ? "hover:text-white text-zinc-400" : "hover:text-black text-zinc-600"}`}
              title={t.form.zoomIn || "Zoom in"}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={async () => {
              setIsExportingDocx(true);
              try {
                await exportResumeToDocx(resume, template);
              } finally {
                setIsExportingDocx(false);
              }
            }}
            disabled={isExportingDocx}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
              isDark
                ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200"
                : "bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-800"
            }}`}
            title="Exporter au format Microsoft Word (.docx)"
          >
            {isExportingDocx ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>{t.actions.exportDocx || "Word (.docx)"}</span>
          </button>

          <button
            onClick={onPrint}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isDark
                ? "bg-white hover:bg-zinc-200 text-zinc-950"
                : "bg-zinc-900 hover:bg-zinc-800 text-white"
            }`}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{t.actions.exportPdf}</span>
          </button>
        </div>
      </div>

      <div
        className={`resume-preview-container flex-1 overflow-y-auto flex justify-center p-3 rounded-xl border ${
          isDark
            ? "bg-black/40 border-zinc-800/60"
            : "bg-zinc-100/90 border-zinc-200 shadow-inner"
        }`}
      >
        <div
          id="ats-resume-document"
          className={`ats-print-container bg-white text-zinc-900 rounded-sm shadow-2xl p-8 max-w-[210mm] w-full min-h-[297mm] transition-all origin-top ${
            template === "serif" ? "font-serif" : "font-sans"
          }`}
          style={{ transform: `scale(${internalZoom / 100})` }}
        >
          {template === "minimal" && (
            <div className="space-y-4">
              <div className="text-center pb-2 border-b border-zinc-200">
                {showPhoto && resume.basics.image && (
                  <div className="flex justify-center mb-2.5">
                    <img
                      src={resume.basics.image}
                      alt={resume.basics.name}
                      className="w-20 h-20 rounded-full object-cover border border-zinc-300 shadow-sm"
                    />
                  </div>
                )}
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 uppercase">
                  {resume.basics.name || (t.form.fullName || "Full Name")}
                </h1>
                <p className="text-xs font-semibold text-zinc-700 mt-0.5">
                  {resume.basics.label || (t.form.jobTitle || "Job Title")}
                </p>
                <p className="text-[11px] text-zinc-600 mt-1 flex flex-wrap justify-center items-center gap-x-2">
                  {resume.basics.phone && <span>{resume.basics.phone}</span>}
                  {resume.basics.phone && resume.basics.email && <span>•</span>}
                  {resume.basics.email && <span>{resume.basics.email}</span>}
                  {resume.basics.location?.city && <span>•</span>}
                  {resume.basics.location?.city && <span>{resume.basics.location.city}</span>}
                  {resume.basics.url && (
                    <>
                      <span>•</span>
                      <span>{resume.basics.url.replace(/^https?:\/\//, "")}</span>
                    </>
                  )}
                </p>
              </div>

              {resume.basics.summary && (
                <div>
                  <h2 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest text-center border-b border-zinc-200 pb-1 mb-2">
                    {summaryTitle}
                  </h2>
                  <p className="text-xs text-zinc-800 leading-relaxed text-justify">
                    {resume.basics.summary}
                  </p>
                </div>
              )}

              {sectionOrder.map((sectionKey) => {
                if (sectionKey === "work" && resume.work && resume.work.length > 0) {
                  return (
                    <div key="work">
                      <h2 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest text-center border-b border-zinc-200 pb-1 mb-2.5">
                        {workTitle}
                      </h2>
                      <div className="space-y-3 text-xs">
                        {resume.work.map((exp, idx) => (
                          <div key={idx} className="page-break-inside-avoid">
                            <div className="flex justify-between items-baseline font-bold text-zinc-950">
                              <span>{exp.position}</span>
                              <span className="text-[11px] font-normal text-zinc-600">
                                {exp.startDate} – {exp.endDate || (t.form.present || "Present")}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-700 italic">
                              {exp.name}
                            </div>
                            {exp.highlights && exp.highlights.length > 0 && (
                              <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-800 mt-1">
                                {exp.highlights.map((hl, hIdx) => (
                                  <li key={hIdx}>{hl}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionKey === "education" && resume.education && resume.education.length > 0) {
                  return (
                    <div key="education">
                      <h2 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest text-center border-b border-zinc-200 pb-1 mb-2">
                        {eduTitle}
                      </h2>
                      <div className="space-y-2 text-xs">
                        {resume.education.map((edu, idx) => (
                          <div key={idx} className="page-break-inside-avoid flex justify-between items-baseline">
                            <div>
                              <span className="font-bold text-zinc-950">{edu.studyType}</span>
                              {edu.area && <span> – {edu.area}</span>}
                              <div className="text-[11px] text-zinc-700">{edu.institution}</div>
                            </div>
                            <span className="text-[11px] text-zinc-600">{edu.endDate || edu.startDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionKey === "skills" && resume.skills && resume.skills.length > 0) {
                  return (
                    <div key="skills">
                      <h2 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest text-center border-b border-zinc-200 pb-1 mb-2">
                        {skillsTitle}
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                        {resume.skills.map((grp, idx) => (
                          <div key={idx}>
                            <div className="font-bold text-[11px] text-zinc-900">{grp.name}</div>
                            <div className="text-[10.5px] text-zinc-700">
                              {grp.keywords.join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {template === "corporate" && (
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b-2 border-zinc-950 pb-3">
                <div>
                  <h1 className="text-2xl font-extrabold uppercase tracking-tight text-zinc-950">
                    {resume.basics.name || (t.form.fullName || "Full Name").toUpperCase()}
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-700 mt-0.5">
                    {resume.basics.label || (t.form.jobTitle || "Job Title").toUpperCase()}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-2">
                    {resume.basics.location?.city} • {resume.basics.phone} • {resume.basics.email}
                    {resume.basics.url && ` • ${resume.basics.url.replace(/^https?:\/\//, "")}`}
                  </p>
                </div>

                {showPhoto && resume.basics.image && (
                  <img
                    src={resume.basics.image}
                    alt={resume.basics.name}
                    className="w-20 h-24 rounded object-cover border border-zinc-300 shadow-sm shrink-0 ml-4"
                  />
                )}
              </div>

              {resume.basics.summary && (
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-950 border-b border-zinc-400 pb-0.5 mb-1.5">
                    {summaryTitle}
                  </h2>
                  <p className="text-xs text-zinc-800 leading-relaxed">
                    {resume.basics.summary}
                  </p>
                </div>
              )}

              {sectionOrder.map((sectionKey) => {
                if (sectionKey === "work" && resume.work && resume.work.length > 0) {
                  return (
                    <div key="work">
                      <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-950 border-b border-zinc-400 pb-0.5 mb-2">
                        {workTitle}
                      </h2>
                      <div className="space-y-3">
                        {resume.work.map((exp, idx) => (
                          <div key={idx} className="page-break-inside-avoid text-xs">
                            <div className="flex justify-between items-baseline font-bold text-zinc-950">
                              <span>
                                {exp.position}, <span className="font-semibold text-zinc-800">{exp.name}</span>
                              </span>
                              <span className="text-[11px] font-mono text-zinc-700">
                                {exp.startDate} – {exp.endDate || (t.form.present || "Present")}
                              </span>
                            </div>
                            {exp.highlights && exp.highlights.length > 0 && (
                              <ul className="list-disc list-outside pl-4 space-y-1 text-zinc-800 mt-1">
                                {exp.highlights.map((hl, hIdx) => (
                                  <li key={hIdx}>{hl}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionKey === "education" && resume.education && resume.education.length > 0) {
                  return (
                    <div key="education">
                      <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-950 border-b border-zinc-400 pb-0.5 mb-2">
                        {eduTitle}
                      </h2>
                      <div className="space-y-2 text-xs">
                        {resume.education.map((edu, idx) => (
                          <div key={idx} className="flex justify-between items-baseline">
                            <div>
                              <span className="font-bold text-zinc-950">{edu.studyType}</span>
                              {edu.area && <span> {t.form.in || "in"} {edu.area}</span>}
                              <div className="text-[11px] text-zinc-700">{edu.institution}</div>
                            </div>
                            <span className="text-[11px] font-mono text-zinc-700">
                              {edu.endDate || edu.startDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionKey === "skills" && resume.skills && resume.skills.length > 0) {
                  return (
                    <div key="skills">
                      <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-950 border-b border-zinc-400 pb-0.5 mb-2">
                        {skillsTitle}
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                        {resume.skills.map((grp, idx) => (
                          <div key={idx}>
                            <span className="font-bold text-zinc-900 block text-[11px]">{grp.name}</span>
                            <span className="text-[10.5px] text-zinc-700">{grp.keywords.join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {template === "serif" && (
            <div className="space-y-4 font-serif">
              <div className="text-center border-b border-zinc-300 pb-3">
                <h1 className="text-3xl font-normal tracking-wide text-zinc-950">
                  {resume.basics.name || (t.form.fullName || "Full Name")}
                </h1>
                <p className="text-xs italic text-zinc-700 mt-1">
                  {resume.basics.label}
                </p>
                <p className="text-[11px] text-zinc-600 mt-1.5 font-sans">
                  {resume.basics.location?.city} • {resume.basics.phone} • {resume.basics.email}
                </p>
              </div>

              {resume.basics.summary && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-400 pb-1 mb-1.5">
                    {summaryTitle}
                  </h2>
                  <p className="text-xs text-zinc-800 leading-relaxed text-justify">
                    {resume.basics.summary}
                  </p>
                </div>
              )}

              {sectionOrder.map((sectionKey) => {
                if (sectionKey === "work" && resume.work && resume.work.length > 0) {
                  return (
                    <div key="work">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-400 pb-1 mb-2">
                        {workTitle}
                      </h2>
                      <div className="space-y-3 text-xs">
                        {resume.work.map((exp, idx) => (
                          <div key={idx} className="page-break-inside-avoid">
                            <div className="flex justify-between items-baseline font-bold text-zinc-950">
                              <span>{exp.position} — <span className="italic font-normal">{exp.name}</span></span>
                              <span className="text-[11px] font-sans font-medium text-zinc-700">
                                {exp.startDate} – {exp.endDate || (t.form.present || "Present")}
                              </span>
                            </div>
                            {exp.highlights && exp.highlights.length > 0 && (
                              <ul className="list-disc list-outside pl-4 space-y-1 text-[11.5px] text-zinc-800 mt-1">
                                {exp.highlights.map((hl, hIdx) => (
                                  <li key={hIdx}>{hl}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionKey === "education" && resume.education && resume.education.length > 0) {
                  return (
                    <div key="education">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-400 pb-1 mb-2">
                        {eduTitle}
                      </h2>
                      <div className="space-y-1.5 text-xs">
                        {resume.education.map((edu, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{edu.studyType} {edu.area && `${t.form.in || "in"} ${edu.area}`} — {edu.institution}</span>
                            <span className="font-sans text-[11px] text-zinc-600">{edu.endDate || edu.startDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionKey === "skills" && resume.skills && resume.skills.length > 0) {
                  return (
                    <div key="skills">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-400 pb-1 mb-2">
                        {skillsTitle}
                      </h2>
                      <div className="space-y-1.5 text-xs">
                        {resume.skills.map((grp, idx) => (
                          <div key={idx} className="flex">
                            <span className="font-bold min-w-[150px]">{grp.name} :</span>
                            <span className="text-zinc-800">{grp.keywords.join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {template === "darkMinimal" && (
            <div className="space-y-4">
              <div className="bg-zinc-950 text-white p-5 rounded-sm">
                <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                  {resume.basics.name || (t.form.fullName || "Full Name").toUpperCase()}
                </h1>
                <p className="text-xs font-medium tracking-wide text-zinc-300 mt-0.5 uppercase">
                  {resume.basics.label}
                </p>
                <div className="text-[11px] text-zinc-400 mt-2 flex flex-wrap gap-x-3">
                  {resume.basics.phone && <span>{resume.basics.phone}</span>}
                  {resume.basics.phone && resume.basics.email && <span>|</span>}
                  {resume.basics.email && <span>{resume.basics.email}</span>}
                  {resume.basics.location?.city && <span>|</span>}
                  {resume.basics.location?.city && <span>{resume.basics.location.city}</span>}
                </div>
              </div>

              {resume.basics.summary && (
                <div className="border-l-2 border-zinc-950 pl-3">
                  <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                    {resume.basics.summary}
                  </p>
                </div>
              )}

              {sectionOrder.map((sectionKey) => {
                if (sectionKey === "work" && resume.work && resume.work.length > 0) {
                  return (
                    <div key="work">
                      <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 border-b-2 border-zinc-950 pb-0.5 mb-2">
                        {workTitle}
                      </h2>
                      <div className="space-y-3 text-xs">
                        {resume.work.map((exp, idx) => (
                          <div key={idx} className="page-break-inside-avoid">
                            <div className="flex justify-between items-baseline font-bold text-zinc-950">
                              <span>{exp.position} • {exp.name}</span>
                              <span className="text-[11px] font-mono">{exp.startDate} – {exp.endDate || (t.form.present || "Present")}</span>
                            </div>
                            {exp.highlights && exp.highlights.length > 0 && (
                              <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-zinc-800 mt-1">
                                {exp.highlights.map((hl, hIdx) => (
                                  <li key={hIdx}>{hl}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionKey === "education" && resume.education && resume.education.length > 0) {
                  return (
                    <div key="education">
                      <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 border-b-2 border-zinc-950 pb-0.5 mb-2">
                        {eduTitle}
                      </h2>
                      <div className="space-y-1.5 text-xs">
                        {resume.education.map((edu, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="font-bold">{edu.studyType} {edu.area && `${t.form.in || "in"} ${edu.area}`} — {edu.institution}</span>
                            <span className="font-mono text-[11px]">{edu.endDate || edu.startDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionKey === "skills" && resume.skills && resume.skills.length > 0) {
                  return (
                    <div key="skills">
                      <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 border-b-2 border-zinc-950 pb-0.5 mb-2">
                        {skillsTitle}
                      </h2>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {resume.skills.map((grp, idx) => (
                          <div key={idx}>
                            <span className="font-bold text-zinc-950 text-[11px] block">{grp.name}</span>
                            <span className="text-[10.5px] text-zinc-700">{grp.keywords.join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
