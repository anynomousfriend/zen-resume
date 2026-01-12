import React from 'react';

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

interface ModernPreviewProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  githubUsername?: string;
  linkedinUsername?: string;
  website?: string;
  isAtsMode?: boolean;
}

export default function ModernPreview({
  personalInfo,
  experiences,
  education,
  projects,
  skills,
  githubUsername,
  linkedinUsername,
  website,
  isAtsMode = false
}: ModernPreviewProps) {
  
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className={`bg-white p-12 max-w-[210mm] mx-auto ${isAtsMode ? 'text-black' : ''}`} style={{ fontFamily: isAtsMode ? 'Arial, sans-serif' : 'serif' }}>
      {/* Header / Title */}
      <div className={`${isAtsMode ? 'text-left mb-6 border-b-2 border-black pb-2' : 'text-center mb-8'}`}>
        <h1 className={`${isAtsMode ? 'text-3xl' : 'text-4xl'} font-bold mb-3 ${isAtsMode ? 'uppercase' : ''}`}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        
        {/* Social Links */}
        <div className={`flex ${isAtsMode ? 'justify-start' : 'justify-center'} items-center gap-3 text-sm flex-wrap`}>
          {githubUsername && (
            <>
              <a href={`https://github.com/${githubUsername}`} className="text-blue-600 hover:underline flex items-center gap-1">
                <span>🔗</span> {githubUsername}
              </a>
              <span>|</span>
            </>
          )}
          {linkedinUsername && (
            <>
              <a href={`https://linkedin.com/in/${linkedinUsername}`} className="text-blue-600 hover:underline flex items-center gap-1">
                <span>💼</span> {linkedinUsername}
              </a>
              <span>|</span>
            </>
          )}
          {website && (
            <>
              <a href={website} className="text-blue-600 hover:underline flex items-center gap-1">
                <span>🌐</span> {website}
              </a>
              <span>|</span>
            </>
          )}
          {personalInfo.email && (
            <>
              <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                <span>✉️</span> {personalInfo.email}
              </a>
              {personalInfo.phone && <span>|</span>}
            </>
          )}
          {personalInfo.phone && (
            <a href={`tel:${personalInfo.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
              <span>📱</span> {personalInfo.phone}
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className={`${isAtsMode ? 'text-xl' : 'text-2xl'} font-bold border-b-2 border-black pb-1 mb-3 ${isAtsMode ? 'uppercase' : ''}`}>
            {isAtsMode ? 'PROFESSIONAL SUMMARY' : 'Summary'}
          </h2>
          <p className="text-base leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {experiences.some(exp => exp.company || exp.position) && (
        <section className="mb-6">
          <h2 className={`${isAtsMode ? 'text-xl' : 'text-2xl'} font-bold border-b-2 border-black pb-1 mb-3 ${isAtsMode ? 'uppercase' : ''}`}>
            {isAtsMode ? 'PROFESSIONAL EXPERIENCE' : 'Work Experience'}
          </h2>
          <div className="space-y-4">
            {experiences.filter(exp => exp.company || exp.position).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">
                    {exp.position || 'Position'} at {exp.company || 'Company'}
                  </h3>
                  <span className="text-sm text-gray-700">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <div className="text-base leading-relaxed ml-4">
                    {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <div key={idx} className="flex gap-2 mb-1">
                        <span>--</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.some(proj => proj.title) && (
        <section className="mb-6">
          <h2 className={`${isAtsMode ? 'text-xl' : 'text-2xl'} font-bold border-b-2 border-black pb-1 mb-3 ${isAtsMode ? 'uppercase' : ''}`}>
            {isAtsMode ? 'PROJECTS' : 'Projects'}
          </h2>
          <div className="space-y-3">
            {projects.filter(proj => proj.title).map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} className="text-sm text-blue-600 hover:underline">
                      Link to Demo
                    </a>
                  )}
                </div>
                {proj.description && (
                  <p className="text-base leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.some(edu => edu.school || edu.degree) && (
        <section className="mb-6">
          <h2 className={`${isAtsMode ? 'text-xl' : 'text-2xl'} font-bold border-b-2 border-black pb-1 mb-3 ${isAtsMode ? 'uppercase' : ''}`}>
            {isAtsMode ? 'EDUCATION' : 'Education'}
          </h2>
          <div className="space-y-2">
            {education.filter(edu => edu.school || edu.degree).map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <span className="font-bold">{formatDate(edu.graduationDate)}</span>
                  <span className="ml-2">
                    {edu.degree || "Bachelor's Degree"}
                    {edu.field && ` in ${edu.field}`} at <strong>{edu.school || 'University'}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.some(skill => skill.name) && (
        <section className="mb-6">
          <h2 className={`${isAtsMode ? 'text-xl' : 'text-2xl'} font-bold border-b-2 border-black pb-1 mb-3 ${isAtsMode ? 'uppercase' : ''}`}>
            {isAtsMode ? 'SKILLS' : 'Skills'}
          </h2>
          <div className="space-y-2">
            {(() => {
              const skillGroups: { [key: string]: string[] } = {};
              skills.filter(s => s.name).forEach(skill => {
                const level = skill.level || 'intermediate';
                if (!skillGroups[level]) skillGroups[level] = [];
                skillGroups[level].push(skill.name);
              });
              
              return Object.entries(skillGroups).map(([level, names]) => (
                <div key={level} className="flex gap-4">
                  <span className="font-bold min-w-[120px]">
                    {level.charAt(0).toUpperCase() + level.slice(1)} Skills
                  </span>
                  <span className="text-base">{names.join(', ')}</span>
                </div>
              ));
            })()}
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
}
