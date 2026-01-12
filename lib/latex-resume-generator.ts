// Zen Resume LaTeX Generator - Focus on Professional Resume (Non-Academic)
// Sections: Personal Info, Experience, Education, Projects, Certifications

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
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
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

export function generateZenResume(data: ResumeData): string {
  const { personalInfo, experiences, education, projects, certifications } = data;

  return `%-------------------------
% Zen Resume Template
% Focus: Professional Resume (Non-Academic)
% Sections: Personal | Experience | Education | Projects | Certifications
%-------------------------

\\documentclass[11pt,a4paper,sans]{moderncv}

% ModernCV themes
\\moderncvstyle{classic}
\\moderncvcolor{black}

% Character encoding
\\usepackage[utf8]{inputenc}

% Adjust page margins
\\usepackage[scale=0.85]{geometry}
\\setlength{\\hintscolumnwidth}{3cm}

% Personal data
\\name{${escapeLatex(personalInfo.fullName.split(' ')[0] || '')}}{${escapeLatex(personalInfo.fullName.split(' ').slice(1).join(' ') || '')}}
\\title{${escapeLatex(personalInfo.title)}}
\\address{${escapeLatex(personalInfo.location)}}{}{}
\\phone[mobile]{${escapeLatex(personalInfo.phone)}}
\\email{${escapeLatex(personalInfo.email)}}

%--------------------------
% BEGIN DOCUMENT
%--------------------------
\\begin{document}

\\makecvtitle

% Professional Summary
${personalInfo.summary ? `\\section{Professional Summary}
\\cvitem{}{${escapeLatex(personalInfo.summary)}}
` : ''}

%--------------------------
% EXPERIENCE SECTION
%--------------------------
${experiences.length > 0 ? `\\section{Professional Experience}

${experiences.map(exp => `\\cventry{${escapeLatex(exp.startDate)}--${escapeLatex(exp.endDate)}}{${escapeLatex(exp.position)}}{${escapeLatex(exp.company)}}{}{}{
${escapeLatex(exp.description)}
}`).join('\n\n')}
` : ''}

%--------------------------
% EDUCATION SECTION
%--------------------------
${education.length > 0 ? `\\section{Education}

${education.map(edu => `\\cventry{${escapeLatex(edu.graduationDate)}}{${escapeLatex(edu.degree)}}{${escapeLatex(edu.school)}}{}{}{${escapeLatex(edu.field)}}`).join('\n\n')}
` : ''}

%--------------------------
% PROJECTS SECTION
%--------------------------
${projects.length > 0 ? `\\section{Projects}

${projects.map(proj => `\\cvitem{${escapeLatex(proj.title)}}{
${escapeLatex(proj.description)}${proj.technologies ? `\\\\
\\textbf{Technologies:} ${escapeLatex(proj.technologies)}` : ''}${proj.link ? `\\\\
\\textbf{Link:} \\url{${escapeLatex(proj.link)}}` : ''}
}`).join('\n\n')}
` : ''}

%--------------------------
% CERTIFICATIONS SECTION
%--------------------------
${certifications.length > 0 ? `\\section{Certifications}

${certifications.map(cert => `\\cvitem{${escapeLatex(cert.date)}}{\\textbf{${escapeLatex(cert.name)}} -- ${escapeLatex(cert.issuer)}${cert.credentialId ? ` (ID: ${escapeLatex(cert.credentialId)})` : ''}}`).join('\n\n')}
` : ''}

\\end{document}`;
}

// Helper function to escape LaTeX special characters
function escapeLatex(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/\n/g, ' ')
    .trim();
}

export default generateZenResume;
