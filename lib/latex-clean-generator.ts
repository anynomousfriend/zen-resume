// Clean Professional Resume LaTeX Generator
// Based on modern, minimal template with proper formatting

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
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

export function generateCleanResume(data: ResumeData): string {
  const { personalInfo, experiences, education, projects, certifications } = data;

  return `\\documentclass[a4paper,10pt]{article}

% --- Packages ---
\\usepackage[left=0.75in, right=0.75in, top=0.5in, bottom=0.5in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{enumitem}
\\usepackage[english]{babel}
\\usepackage{lastpage}

% --- Section Formatting ---
\\titleformat{\\section}{\\large\\scshape\\raggedright}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{10pt}{5pt}

% --- Custom Commands ---
\\newcommand{\\experienceEntry}[4]{
  \\noindent \\textbf{#1} \\hfill #2 \\\\
  \\ifx&#3&%
  \\else
    {#3}
  \\fi
  \\ifx&#4&%
  \\else
    \\begin{itemize}[noitemsep, topsep=0pt, leftmargin=1.5em]
        #4
    \\end{itemize}
  \\fi
  \\vspace{5pt}
}

\\begin{document}
\\pagestyle{empty}

% --- Header ---
\\begin{center}
    {\\Huge ${escapeLatex(personalInfo.fullName)}} \\\\ \\vspace{8pt}
    \\small
    ${generateContactLine(personalInfo)}
\\end{center}

${personalInfo.summary ? `% --- Summary ---
\\section*{Summary}
${escapeLatex(personalInfo.summary)}
` : ''}

${experiences.length > 0 ? `% --- Work Experience ---
\\section*{Work Experience}

${experiences.map(exp => generateExperienceEntry(exp)).join('\n\n')}
` : ''}

${projects.length > 0 ? `% --- Projects ---
\\section*{Projects}
${projects.map(proj => generateProjectEntry(proj)).join('\n\n')}
` : ''}

${education.length > 0 ? `% --- Education ---
\\section*{Education}
\\begin{tabularx}{\\textwidth}{@{}p{0.18\\textwidth} X r@{}}
${education.map(edu => generateEducationEntry(edu)).join(' \\\\\n')}
\\end{tabularx}
` : ''}

${certifications.length > 0 ? `% --- Certifications ---
\\section*{Certifications}
\\begin{tabularx}{\\textwidth}{@{}p{0.2\\textwidth} X@{}}
${certifications.map(cert => {
  let line = `${escapeLatex(cert.date)} & \\textbf{${escapeLatex(cert.name)}} -- ${escapeLatex(cert.issuer)}`;
  if (cert.credentialId) {
    line += ` (ID: ${escapeLatex(cert.credentialId)})`;
  }
  if (cert.link) {
    line += `\\\\\\textit{Verify:} \\url{${escapeLatex(cert.link)}}`;
  }
  return line;
}).join(' \\\\\n')}
\\end{tabularx}
` : ''}

% --- Footer ---
\\vfill
\\begin{center}
    \\footnotesize Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
\\end{center}

\\end{document}`;
}

function generateContactLine(info: PersonalInfo): string {
  const contacts: string[] = [];
  
  if (info.github) {
    contacts.push(`\\href{https://github.com/${escapeLatex(info.github)}}{\\color{blue!70!black}\\faGithub\\ ${escapeLatex(info.github)}}`);
  }
  
  if (info.linkedin) {
    contacts.push(`\\href{https://linkedin.com/in/${escapeLatex(info.linkedin)}}{\\color{blue!70!black}\\faLinkedin\\ ${escapeLatex(info.linkedin)}}`);
  }
  
  if (info.website) {
    contacts.push(`\\href{${escapeLatex(info.website)}}{\\color{blue!70!black}\\faGlobe\\ ${escapeLatex(info.website)}}`);
  }
  
  if (info.email) {
    contacts.push(`\\href{mailto:${escapeLatex(info.email)}}{\\color{blue!70!black}\\faEnvelope\\ ${escapeLatex(info.email)}}`);
  }
  
  if (info.phone) {
    contacts.push(`{\\color{blue!70!black}\\faPhone\\ ${escapeLatex(info.phone)}}`);
  }
  
  return contacts.join(' \\quad | \\quad\n    ');
}

function generateExperienceEntry(exp: Experience): string {
  const dateRange = `${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}`;
  const position = `${escapeLatex(exp.position)} at ${escapeLatex(exp.company)}`;
  
  // Check if description has bullet points (contains \n or multiple sentences)
  const hasBullets = exp.description.includes('\n') || exp.description.split('.').length > 2;
  
  if (hasBullets) {
    // Split by newlines or periods and create bullet points
    const bullets = exp.description
      .split(/\n|(?<=\.)\s+/)
      .filter(line => line.trim().length > 0)
      .map(line => `    \\item ${escapeLatex(line.trim())}`)
      .join('\n');
    
    return `\\experienceEntry{${position}}{${dateRange}}{}{
${bullets}
}`;
  } else {
    // Single line description
    return `\\experienceEntry{${position}}{${dateRange}}{${escapeLatex(exp.description)}}{}`;
  }
}

function generateProjectEntry(proj: Project): string {
  const linkText = proj.link ? ` \\hfill \\href{${escapeLatex(proj.link)}}{Link to Project}` : '';
  const techLine = proj.technologies ? `\\\\\\textbf{Technologies:} ${escapeLatex(proj.technologies)}` : '';
  
  return `\\noindent \\textbf{${escapeLatex(proj.title)}}${linkText} \\\\
${escapeLatex(proj.description)}${techLine}`;
}

function generateEducationEntry(edu: Education): string {
  const dateRange = escapeLatex(edu.graduationDate);
  const degree = `${escapeLatex(edu.degree)}${edu.field ? ` (${escapeLatex(edu.field)})` : ''} at \\textbf{${escapeLatex(edu.school)}}`;
  const gpa = edu.gpa ? `(GPA: ${escapeLatex(edu.gpa)})` : '';
  
  return `${dateRange} & ${degree} & ${gpa}`;
}

// Helper function to escape LaTeX special characters
function escapeLatex(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .trim();
}

export default generateCleanResume;
