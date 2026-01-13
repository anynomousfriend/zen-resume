// DOCX Resume Generator - ATS-Friendly Word Document
// Uses docx library to create proper Word documents

import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } from 'docx';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  link?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

export function generateDOCX(data: ResumeData): Document {
  const { personalInfo, experiences, education, projects, certifications } = data;
  
  const sections: Paragraph[] = [];

  // Header - Name and Contact Info (Left-aligned for ATS)
  sections.push(
    new Paragraph({
      text: personalInfo.fullName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
    })
  );

  if (personalInfo.title) {
    sections.push(
      new Paragraph({
        text: personalInfo.title,
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 },
      })
    );
  }

  // Contact Information (one line, pipe-separated)
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(`LinkedIn: ${personalInfo.linkedin}`);
  if (personalInfo.github) contactParts.push(`GitHub: ${personalInfo.github}`);
  if (personalInfo.website) contactParts.push(personalInfo.website);

  if (contactParts.length > 0) {
    sections.push(
      new Paragraph({
        text: contactParts.join(' | '),
        alignment: AlignmentType.LEFT,
        spacing: { after: 240 },
      })
    );
  }

  // Professional Summary
  if (personalInfo.summary) {
    sections.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 120 },
      })
    );
    sections.push(
      new Paragraph({
        text: personalInfo.summary,
        alignment: AlignmentType.LEFT,
        spacing: { after: 240 },
      })
    );
  }

  // Work Experience
  if (experiences.length > 0) {
    sections.push(
      new Paragraph({
        text: 'PROFESSIONAL EXPERIENCE',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 120 },
      })
    );

    experiences.forEach((exp) => {
      // Position and Company
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.position}`,
              bold: true,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 60 },
        })
      );

      // Company and Dates
      const dateRange = `${exp.startDate} - ${exp.endDate || 'Present'}`;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.company} | ${dateRange}`,
              italics: true,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 120 },
        })
      );

      // Description (bullet points)
      if (exp.description) {
        const bullets = exp.description.split('\n').filter(line => line.trim().length > 0);
        bullets.forEach((bullet) => {
          sections.push(
            new Paragraph({
              text: bullet.trim(),
              bullet: { level: 0 },
              alignment: AlignmentType.LEFT,
              spacing: { after: 60 },
            })
          );
        });
      }

      sections.push(
        new Paragraph({
          text: '',
          spacing: { after: 120 },
        })
      );
    });
  }

  // Projects
  if (projects.length > 0) {
    sections.push(
      new Paragraph({
        text: 'PROJECTS',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 120 },
      })
    );

    projects.forEach((proj) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
            }),
            ...(proj.link ? [
              new TextRun({
                text: ` | ${proj.link}`,
              }),
            ] : []),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 60 },
        })
      );

      sections.push(
        new Paragraph({
          text: proj.description,
          alignment: AlignmentType.LEFT,
          spacing: { after: 60 },
        })
      );

      if (proj.technologies) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Technologies: ',
                bold: true,
              }),
              new TextRun({
                text: proj.technologies,
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  // Education
  if (education.length > 0) {
    sections.push(
      new Paragraph({
        text: 'EDUCATION',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 120 },
      })
    );

    education.forEach((edu) => {
      const degreeLine = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: degreeLine,
              bold: true,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 60 },
        })
      );

      const eduDetails: string[] = [edu.school];
      if (edu.graduationDate) eduDetails.push(edu.graduationDate);
      if (edu.gpa) eduDetails.push(`GPA: ${edu.gpa}`);

      sections.push(
        new Paragraph({
          text: eduDetails.join(' | '),
          alignment: AlignmentType.LEFT,
          spacing: { after: 120 },
        })
      );
    });
  }

  // Certifications
  if (certifications.length > 0) {
    sections.push(
      new Paragraph({
        text: 'CERTIFICATIONS',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 120 },
      })
    );

    certifications.forEach((cert) => {
      const certParts: string[] = [cert.name, cert.issuer];
      if (cert.date) certParts.push(cert.date);
      if (cert.credentialId) certParts.push(`ID: ${cert.credentialId}`);

      sections.push(
        new Paragraph({
          text: certParts.join(' | '),
          alignment: AlignmentType.LEFT,
          spacing: { after: 60 },
        })
      );

      if (cert.link) {
        sections.push(
          new Paragraph({
            text: `Verification: ${cert.link}`,
            alignment: AlignmentType.LEFT,
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  // Create and return the document
  return new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });
}

export default generateDOCX;
