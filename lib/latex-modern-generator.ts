// Modern LaTeX Template Generator for ZenResume
// Based on Jitin Nair's CV template (MIT License)

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

interface Skill {
  id: string;
  name: string;
  level: string;
}

export function generateModernLatex(data: {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  githubUsername?: string;
  linkedinUsername?: string;
  website?: string;
}): string {
  const { personalInfo, experiences, education, projects, skills, githubUsername, linkedinUsername, website } = data;

  // Escape special LaTeX characters
  const escapeLatex = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/[&%$#_{}]/g, '\\$&')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  };

  // Format date for LaTeX
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  let latex = `%-----------------------------------------------------------------------------------------------------------------------------------------------%
%	The MIT License (MIT)
%
%	Copyright (c) 2021 Jitin Nair
%	Modified for ZenResume
%-----------------------------------------------------------------------------------------------------------------------------------------------%

%----------------------------------------------------------------------------------------
%	DOCUMENT DEFINITION
%----------------------------------------------------------------------------------------

\\documentclass[a4paper,12pt]{article}

%----------------------------------------------------------------------------------------
%	PACKAGES
%----------------------------------------------------------------------------------------
\\usepackage{url}
\\usepackage{parskip} 	

%other packages for formatting
\\RequirePackage{color}
\\RequirePackage{graphicx}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage[scale=0.9]{geometry}

%tabularx environment
\\usepackage{tabularx}

%for lists within experience section
\\usepackage{enumitem}

% centered version of 'X' col. type
\\newcolumntype{C}{>{\\centering\\arraybackslash}X} 

%to prevent spillover of tabular into next pages
\\usepackage{supertabular}
\\usepackage{tabularx}
\\newlength{\\fullcollw}
\\setlength{\\fullcollw}{0.47\\textwidth}

%custom \\section
\\usepackage{titlesec}				
\\usepackage{multicol}
\\usepackage{multirow}

%CV Sections inspired by: 
%http://stefano.italians.nl/archives/26
\\titleformat{\\section}{\\Large\\scshape\\raggedright}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{10pt}{10pt}

%Setup hyperref package, and colours for links
\\usepackage[unicode, draft=false]{hyperref}
\\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\\hypersetup{colorlinks,breaklinks,urlcolor=linkcolour,linkcolor=linkcolour}

%for social icons
\\usepackage{fontawesome5}

% job listing environments
\\newenvironment{jobshort}[2]
    {
    \\begin{tabularx}{\\linewidth}{@{}l X r@{}}
    \\textbf{#1} & \\hfill &  #2 \\\\[3.75pt]
    \\end{tabularx}
    }
    {
    }

\\newenvironment{joblong}[2]
    {
    \\begin{tabularx}{\\linewidth}{@{}l X r@{}}
    \\textbf{#1} & \\hfill &  #2 \\\\[3.75pt]
    \\end{tabularx}
    \\begin{minipage}[t]{\\linewidth}
    \\begin{itemize}[nosep,after=\\strut, leftmargin=1em, itemsep=3pt,label=--]
    }
    {
    \\end{itemize}
    \\end{minipage}    
    }

%----------------------------------------------------------------------------------------
%	BEGIN DOCUMENT
%----------------------------------------------------------------------------------------
\\begin{document}

% non-numbered pages
\\pagestyle{empty} 

%----------------------------------------------------------------------------------------
%	TITLE
%----------------------------------------------------------------------------------------

\\begin{tabularx}{\\linewidth}{@{} C @{}}
\\Huge{${escapeLatex(personalInfo.fullName || 'Your Name')}} \\\\[7.5pt]
`;

  // Social links
  const links = [];
  if (githubUsername) {
    links.push(`\\href{https://github.com/${escapeLatex(githubUsername)}}{\\raisebox{-0.05\\height}\\faGithub\\ ${escapeLatex(githubUsername)}}`);
  }
  if (linkedinUsername) {
    links.push(`\\href{https://linkedin.com/in/${escapeLatex(linkedinUsername)}}{\\raisebox{-0.05\\height}\\faLinkedin\\ ${escapeLatex(linkedinUsername)}}`);
  }
  if (website) {
    links.push(`\\href{${escapeLatex(website)}}{\\raisebox{-0.05\\height}\\faGlobe\\ ${escapeLatex(website)}}`);
  }
  if (personalInfo.email) {
    links.push(`\\href{mailto:${escapeLatex(personalInfo.email)}}{\\raisebox{-0.05\\height}\\faEnvelope\\ ${escapeLatex(personalInfo.email)}}`);
  }
  if (personalInfo.phone) {
    links.push(`\\href{tel:${escapeLatex(personalInfo.phone)}}{\\raisebox{-0.05\\height}\\faMobile\\ ${escapeLatex(personalInfo.phone)}}`);
  }

  latex += links.join(' \\ $|$ \\ ') + ` \\\\
\\end{tabularx}

`;

  // Summary
  if (personalInfo.summary) {
    latex += `%----------------------------------------------------------------------------------------
% EXPERIENCE SECTIONS
%----------------------------------------------------------------------------------------

%Interests/ Keywords/ Summary
\\section{Summary}
${escapeLatex(personalInfo.summary)}

`;
  }

  // Work Experience
  if (experiences.some(exp => exp.company || exp.position)) {
    latex += `%Experience
\\section{Work Experience}

`;
    experiences.filter(exp => exp.company || exp.position).forEach(exp => {
      const hasDescription = exp.description && exp.description.trim().length > 0;
      const dateRange = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`;
      
      if (hasDescription) {
        // Use joblong environment for experiences with bullet points
        latex += `\\begin{joblong}{${escapeLatex(exp.position || 'Position')} at ${escapeLatex(exp.company || 'Company')}}{${dateRange}}
`;
        // Split description by lines/bullets
        const bullets = exp.description.split('\n').filter(line => line.trim());
        bullets.forEach(bullet => {
          latex += `\\item ${escapeLatex(bullet)}
`;
        });
        latex += `\\end{joblong}

`;
      } else {
        // Use jobshort for simple one-liners
        latex += `\\begin{jobshort}{${escapeLatex(exp.position || 'Position')} at ${escapeLatex(exp.company || 'Company')}}{${dateRange}}
${escapeLatex(exp.company || 'Company description')}
\\end{jobshort}

`;
      }
    });
  }

  // Projects
  if (projects.some(proj => proj.title)) {
    latex += `%Projects
\\section{Projects}

`;
    projects.filter(proj => proj.title).forEach(proj => {
      latex += `\\begin{tabularx}{\\linewidth}{ @{}l r@{} }
\\textbf{${escapeLatex(proj.title)}} & \\hfill ${proj.link ? `\\href{${escapeLatex(proj.link)}}{Link to Demo}` : ''} \\\\[3.75pt]
\\multicolumn{2}{@{}X@{}}{${escapeLatex(proj.description || '')}}  \\\\
\\end{tabularx}

`;
    });
  }

  // Education
  if (education.some(edu => edu.school || edu.degree)) {
    latex += `%----------------------------------------------------------------------------------------
%	EDUCATION
%----------------------------------------------------------------------------------------
\\section{Education}
\\begin{tabularx}{\\linewidth}{@{}l X@{}}	
`;
    education.filter(edu => edu.school || edu.degree).forEach(edu => {
      latex += `${formatDate(edu.graduationDate)} & ${escapeLatex(edu.degree || "Bachelor's Degree")}${edu.field ? ` in ${escapeLatex(edu.field)}` : ''} at \\textbf{${escapeLatex(edu.school || 'University')}} \\\\

`;
    });
    latex += `\\end{tabularx}

`;
  }

  // Skills
  if (skills.some(skill => skill.name)) {
    latex += `%----------------------------------------------------------------------------------------
%	SKILLS
%----------------------------------------------------------------------------------------
\\section{Skills}
\\begin{tabularx}{\\linewidth}{@{}l X@{}}
`;
    // Group skills by level
    const skillGroups: { [key: string]: string[] } = {};
    skills.filter(s => s.name).forEach(skill => {
      const level = skill.level || 'intermediate';
      if (!skillGroups[level]) skillGroups[level] = [];
      skillGroups[level].push(skill.name);
    });

    Object.entries(skillGroups).forEach(([level, names]) => {
      const levelName = level.charAt(0).toUpperCase() + level.slice(1);
      latex += `${levelName} Skills & \\normalsize{${names.map(n => escapeLatex(n)).join(', ')}}\\\\
`;
    });

    latex += `\\end{tabularx}

`;
  }

  // Footer
  latex += `\\vfill
\\center{\\footnotesize Last updated: \\today}

\\end{document}`;

  return latex;
}
