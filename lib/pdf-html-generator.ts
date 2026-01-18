// Modern Resume HTML Generator - Matches Reference Design
// Clean, professional layout with icon-based contact info

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

export type SectionId = 'experience' | 'education' | 'projects' | 'certifications';

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  sectionOrder?: SectionId[];
  isAtsMode?: boolean;
}

export function generateResumeHTML(data: ResumeData): string {
  const { personalInfo, experiences, education, projects, certifications, sectionOrder, isAtsMode = false } = data;
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Default section order if not provided
  const order: SectionId[] = sectionOrder || ['experience', 'education', 'projects', 'certifications'];

  // Generate section HTML based on section ID
  function generateSection(sectionId: SectionId): string {
    switch (sectionId) {
      case 'experience':
        return experiences.length > 0 ? `
  <!-- Work Experience -->
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${experiences.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${escapeHTML(exp.position)}</span>
          <span class="entry-date">${formatDateRange(exp.startDate, exp.endDate)}</span>
        </div>
        <div class="entry-subtitle">${escapeHTML(exp.company)}</div>
        <div class="entry-description">${escapeHTML(exp.description)}</div>
      </div>
    `).join('')}
  </div>
  ` : '';

      case 'education':
        return education.length > 0 ? `
  <!-- Education -->
  <div class="section">
    <div class="section-title">Education</div>
    <table class="education-table">
      ${education.map(edu => `
        <tr>
          <td>${escapeHTML(edu.graduationDate)}</td>
          <td>${escapeHTML(edu.degree)}${edu.field ? ` (${escapeHTML(edu.field)})` : ''} at <strong>${escapeHTML(edu.school)}</strong></td>
          <td>${edu.gpa ? `(GPA: ${escapeHTML(edu.gpa)})` : ''}</td>
        </tr>
      `).join('')}
    </table>
  </div>
  ` : '';

      case 'projects':
        return projects.length > 0 ? `
  <!-- Projects -->
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map(proj => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${escapeHTML(proj.title)}</span>
          ${proj.link ? `<span class="entry-date"><a href="${escapeHTML(proj.link)}">Link to Demo</a></span>` : ''}
        </div>
        <div class="entry-description">${escapeHTML(proj.description)}</div>
        ${proj.technologies ? `<div style="margin-top: 0.3em;"><strong>Technologies:</strong> ${escapeHTML(proj.technologies)}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : '';

      case 'certifications':
        return certifications.length > 0 ? `
  <!-- Certifications -->
  <div class="section">
    <div class="section-title">Certifications</div>
    ${certifications.map(cert => `
      <div class="cert-entry">
        <span class="cert-title">${escapeHTML(cert.name)}</span> - ${escapeHTML(cert.issuer)}
        ${cert.date ? ` (${escapeHTML(cert.date)})` : ''}
        ${cert.credentialId ? ` - ID: ${escapeHTML(cert.credentialId)}` : ''}
        ${cert.link ? ` - <a href="${escapeHTML(cert.link)}">Verify</a>` : ''}
      </div>
    `).join('')}
  </div>
  ` : '';

      default:
        return '';
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHTML(personalInfo.fullName)} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.15;
      color: #000;
      background: #fff;
      padding: 0.5in;
      max-width: 8.5in;
      margin: 0 auto;
    }
    
    /* Header */
    .header {
      text-align: ${isAtsMode ? 'left' : 'center'};
      margin-bottom: 1em;
      ${isAtsMode ? 'border-bottom: 2px solid #000; padding-bottom: 0.5em;' : ''}
    }
    
    .header h1 {
      font-size: ${isAtsMode ? '18pt' : '24pt'};
      font-weight: ${isAtsMode ? 'bold' : 'normal'};
      margin-bottom: 0.3em;
      color: #000;
      ${isAtsMode ? 'text-transform: uppercase;' : ''}
    }
    
    .contact-info {
      font-size: 10pt;
      display: flex;
      justify-content: ${isAtsMode ? 'flex-start' : 'center'};
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5em;
    }
    
    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 0.2em;
    }
    
    .contact-item::before {
      content: '|';
      margin: 0 0.5em;
      color: #666;
    }
    
    .contact-item:first-child::before {
      content: '';
      margin: 0;
    }
    
    .contact-item a {
      color: #0066cc;
      text-decoration: none;
    }
    
    /* Sections */
    .section {
      margin-bottom: 1.2em;
    }
    
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #000;
      padding-bottom: 0.2em;
      margin-bottom: 0.8em;
    }
    
    /* Experience/Projects */
    .entry {
      margin-bottom: 1em;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.3em;
    }
    
    .entry-title {
      font-weight: bold;
    }
    
    .entry-date {
      font-style: italic;
      font-size: 10pt;
    }
    
    .entry-subtitle {
      font-style: italic;
      margin-bottom: 0.3em;
    }
    
    .entry-description {
      text-align: justify;
      hyphens: auto;
    }
    
    /* Education */
    .education-table {
      width: 100%;
      font-size: 10pt;
    }
    
    .education-table td {
      padding: 0.2em 0;
      vertical-align: top;
    }
    
    .education-table td:first-child {
      width: 12%;
      white-space: nowrap;
    }
    
    .education-table td:nth-child(2) {
      width: 70%;
    }
    
    .education-table td:last-child {
      width: 18%;
      text-align: right;
    }
    
    /* Skills */
    .skills-table {
      width: 100%;
      font-size: 10pt;
    }
    
    .skills-table td {
      padding: 0.2em 1em 0.2em 0;
      vertical-align: top;
    }
    
    .skills-table td:first-child {
      font-weight: bold;
      width: 30%;
    }
    
    /* Certifications */
    .cert-entry {
      margin-bottom: 0.5em;
    }
    
    .cert-title {
      font-weight: bold;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      font-size: 9pt;
      font-style: italic;
      margin-top: 2em;
      color: #666;
    }
    
    /* Links */
    a {
      color: #0066cc;
      text-decoration: none;
    }
    
    /* Print styles - Remove headers and footers */
    @media print {
      body {
        padding: 0.5in;
      }
      
      @page {
        margin: 0;
        size: letter;
      }
    }
    
    /* Hide default print header/footer */
    @page {
      margin: 0;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>${escapeHTML(personalInfo.fullName)}</h1>
    <div class="contact-info">
      ${isAtsMode ? `
        ${personalInfo.email ? `<span class="contact-item">${escapeHTML(personalInfo.email)}</span>` : ''}
        ${personalInfo.phone ? `<span class="contact-item">${escapeHTML(personalInfo.phone)}</span>` : ''}
        ${personalInfo.location ? `<span class="contact-item">${escapeHTML(personalInfo.location)}</span>` : ''}
        ${personalInfo.github ? `<span class="contact-item">github.com/${escapeHTML(personalInfo.github)}</span>` : ''}
        ${personalInfo.linkedin ? `<span class="contact-item">linkedin.com/in/${escapeHTML(personalInfo.linkedin)}</span>` : ''}
        ${personalInfo.website ? `<span class="contact-item">${escapeHTML(personalInfo.website)}</span>` : ''}
      ` : `
        ${personalInfo.github ? `<span class="contact-item">🔗 <a href="https://github.com/${escapeHTML(personalInfo.github)}">${escapeHTML(personalInfo.github)}</a></span>` : ''}
        ${personalInfo.linkedin ? `<span class="contact-item">💼 <a href="https://linkedin.com/in/${escapeHTML(personalInfo.linkedin)}">${escapeHTML(personalInfo.linkedin)}</a></span>` : ''}
        ${personalInfo.website ? `<span class="contact-item">🌐 <a href="${escapeHTML(personalInfo.website)}">${escapeHTML(personalInfo.website)}</a></span>` : ''}
        ${personalInfo.email ? `<span class="contact-item">📧 <a href="mailto:${escapeHTML(personalInfo.email)}">${escapeHTML(personalInfo.email)}</a></span>` : ''}
        ${personalInfo.phone ? `<span class="contact-item">📱 ${escapeHTML(personalInfo.phone)}</span>` : ''}
      `}
    </div>
  </div>

  ${personalInfo.summary ? `
  <!-- Summary -->
  <div class="section">
    <div class="section-title">Summary</div>
    <div class="entry-description">${escapeHTML(personalInfo.summary)}</div>
  </div>
  ` : ''}

  ${order.map(sectionId => generateSection(sectionId)).join('')}

  <!-- Footer -->
  <div class="footer">
    Last updated: ${currentDate}
  </div>
</body>
</html>`;
}

function escapeHTML(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateRange(start: string, end: string): string {
  if (!start) return '';
  const endDisplay = end || 'present';
  return `${start} - ${endDisplay}`;
}

export default generateResumeHTML;
