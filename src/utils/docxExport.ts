import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
} from "docx";
import { Resume } from "../types/resume";
import { TemplateId } from "../components/AtsResumePreview";

export async function exportResumeToDocx(
  resume: Resume,
  template: TemplateId = "minimal"
): Promise<void> {
  const isSerif = template === "serif";
  const fontFamily = isSerif ? "Times New Roman" : "Arial";
  const alignment =
    template === "corporate" ? AlignmentType.LEFT : AlignmentType.CENTER;

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: (resume.basics.name || "John Doe").toUpperCase(),
          bold: true,
          size: 32,
          font: fontFamily,
          color: "111827",
        }),
      ],
    })
  );

  if (resume.basics.label) {
    children.push(
      new Paragraph({
        alignment,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resume.basics.label.toUpperCase(),
            bold: true,
            size: 21,
            font: fontFamily,
            color: "374151",
          }),
        ],
      })
    );
  }

  const contactItems: string[] = [];
  if (resume.basics.phone) contactItems.push(resume.basics.phone);
  if (resume.basics.email) contactItems.push(resume.basics.email);
  if (resume.basics.location?.city) {
    const loc = resume.basics.location.countryCode
      ? `${resume.basics.location.city}, ${resume.basics.location.countryCode}`
      : resume.basics.location.city;
    contactItems.push(loc);
  }
  if (resume.basics.url) {
    contactItems.push(resume.basics.url.replace(/^https?:\/\//, ""));
  }

  if (contactItems.length > 0) {
    children.push(
      new Paragraph({
        alignment,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: contactItems.join("  •  "),
            size: 19,
            font: fontFamily,
            color: "4B5563",
          }),
        ],
      })
    );
  }

  const addSectionHeading = (title: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: "D1D5DB",
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 21,
            font: fontFamily,
            color: "111827",
          }),
        ],
      })
    );
  };

  if (resume.basics.summary) {
    addSectionHeading("Summary");
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: resume.basics.summary,
            size: 20,
            font: fontFamily,
            color: "1F2937",
          }),
        ],
      })
    );
  }

  const sectionOrder = resume.sectionOrder || ["work", "education", "skills"];

  sectionOrder.forEach((sec) => {
    if (sec === "work" && resume.work && resume.work.length > 0) {
      addSectionHeading("Work Experience");
      resume.work.forEach((w) => {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: w.position,
                bold: true,
                size: 21,
                font: fontFamily,
                color: "111827",
              }),
              new TextRun({
                text: ` — ${w.name}`,
                bold: false,
                italics: true,
                size: 20,
                font: fontFamily,
                color: "374151",
              }),
              new TextRun({
                text: `   (${w.startDate} – ${w.endDate || "Present"})`,
                size: 18,
                font: fontFamily,
                color: "6B7280",
              }),
            ],
          })
        );

        if (w.summary) {
          children.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: w.summary,
                  size: 19,
                  font: fontFamily,
                  color: "4B5563",
                }),
              ],
            })
          );
        }

        if (w.highlights && w.highlights.length > 0) {
          w.highlights.forEach((hl) => {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: hl,
                    size: 19,
                    font: fontFamily,
                    color: "1F2937",
                  }),
                ],
              })
            );
          });
        }
      });
    }

    if (sec === "education" && resume.education && resume.education.length > 0) {
      addSectionHeading("Education");
      resume.education.forEach((edu) => {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({
                text: edu.studyType,
                bold: true,
                size: 20,
                font: fontFamily,
                color: "111827",
              }),
              new TextRun({
                text: edu.area ? ` in ${edu.area}` : "",
                size: 20,
                font: fontFamily,
                color: "1F2937",
              }),
              new TextRun({
                text: ` — ${edu.institution}`,
                italics: true,
                size: 19,
                font: fontFamily,
                color: "4B5563",
              }),
              new TextRun({
                text: ` (${edu.endDate || edu.startDate})`,
                size: 18,
                font: fontFamily,
                color: "6B7280",
              }),
            ],
          })
        );
      });
    }

    if (sec === "skills" && resume.skills && resume.skills.length > 0) {
      addSectionHeading("Skills");
      resume.skills.forEach((grp) => {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({
                text: `${grp.name}: `,
                bold: true,
                size: 20,
                font: fontFamily,
                color: "111827",
              }),
              new TextRun({
                text: grp.keywords.join(", "),
                size: 19,
                font: fontFamily,
                color: "374151",
              }),
            ],
          })
        );
      });
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (resume.basics.name || "Resume")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${safeName}_CV.docx`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
