import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { Resume } from "../types/resume";
import { safeInvoke } from "./tauri";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .filter(Boolean);
    fullText += strings.join(" ") + "\n\n";
  }

  return fullText.trim();
}

export async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return (result.value || "").trim();
}

export function normalizeJsonResume(data: unknown): Resume | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;

  if (obj.basics && typeof obj.basics === "object") {
    const rawBasics = obj.basics as Record<string, unknown>;
    const rawLocation = (rawBasics.location || {}) as Record<string, unknown>;

    const resume: Resume = {
      basics: {
        name: String(rawBasics.name || ""),
        label: String(rawBasics.label || ""),
        email: String(rawBasics.email || ""),
        phone: String(rawBasics.phone || ""),
        url: String(rawBasics.url || ""),
        image: String(rawBasics.image || ""),
        summary: String(rawBasics.summary || ""),
        location: {
          city: String(rawLocation.city || ""),
          countryCode: String(rawLocation.countryCode || ""),
          region: String(rawLocation.region || ""),
        },
      },
      work: Array.isArray(obj.work)
        ? obj.work.map((w: Record<string, unknown>) => ({
            name: String(w.name || w.company || ""),
            position: String(w.position || ""),
            url: String(w.url || ""),
            startDate: String(w.startDate || ""),
            endDate: String(w.endDate || ""),
            summary: String(w.summary || ""),
            highlights: Array.isArray(w.highlights)
              ? w.highlights.map(String)
              : [],
          }))
        : [],
      education: Array.isArray(obj.education)
        ? obj.education.map((e: Record<string, unknown>) => ({
            institution: String(e.institution || ""),
            url: String(e.url || ""),
            area: String(e.area || ""),
            studyType: String(e.studyType || ""),
            startDate: String(e.startDate || ""),
            endDate: String(e.endDate || ""),
            score: String(e.score || ""),
            courses: Array.isArray(e.courses) ? e.courses.map(String) : [],
          }))
        : [],
      skills: Array.isArray(obj.skills)
        ? obj.skills.map((s: Record<string, unknown>) => ({
            name: String(s.name || ""),
            level: String(s.level || ""),
            keywords: Array.isArray(s.keywords) ? s.keywords.map(String) : [],
          }))
        : [],
      projects: Array.isArray(obj.projects)
        ? obj.projects.map((p: Record<string, unknown>) => ({
            name: String(p.name || ""),
            description: String(p.description || ""),
            highlights: Array.isArray(p.highlights) ? p.highlights.map(String) : [],
            keywords: Array.isArray(p.keywords) ? p.keywords.map(String) : [],
            startDate: String(p.startDate || ""),
            endDate: String(p.endDate || ""),
            url: String(p.url || ""),
            roles: Array.isArray(p.roles) ? p.roles.map(String) : [],
            entity: String(p.entity || ""),
            type: String(p.type || ""),
          }))
        : [],
      sectionOrder: ["work", "education", "skills"],
    };

    return resume;
  }

  return null;
}

export async function parseResumeFile(
  file: File,
  isAiReady: boolean
): Promise<{ resume?: Resume; error?: string }> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  try {
    if (extension === "json") {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const normalized = normalizeJsonResume(parsed);
      if (normalized) {
        return { resume: normalized };
      }
      return { error: "Fichier JSON non reconnu comme structure de CV." };
    }

    let rawText = "";

    if (extension === "pdf") {
      const buffer = await file.arrayBuffer();
      rawText = await extractTextFromPdf(buffer);
    } else if (extension === "docx") {
      const buffer = await file.arrayBuffer();
      rawText = await extractTextFromDocx(buffer);
    } else if (extension === "txt" || extension === "md") {
      rawText = await file.text();
    } else {
      return { error: `Format de fichier non pris en charge: .${extension}` };
    }

    if (!rawText.trim()) {
      return { error: "Aucun texte lisible n'a pu être extrait du document." };
    }

    if (!isAiReady) {
      return {
        error:
          "Une clé API (Gemini ou fournisseur configuré) est nécessaire pour analyser et structurer automatiquement le contenu d'un fichier PDF/Word.",
      };
    }

    const structured = await safeInvoke<Resume>("parse_resume_from_raw_text", {
      rawText,
    });

    return { resume: structured };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
