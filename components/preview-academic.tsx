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

interface Publication {
  id: string;
  type: string;
  citation: string;
}

interface CreativeWork {
  id: string;
  type: string;
  description: string;
}

interface Grant {
  id: string;
  type: string;
  status: string;
  title: string;
  agency: string;
  role: string;
  effort: string;
  budget: string;
  period: string;
}

interface Teaching {
  id: string;
  type: string;
  title: string;
  details: string;
}

interface SectionTitles {
  education: string;
  publications: string;
  creativeActivity: string;
  grants: string;
  teaching: string;
  service: string;
}

interface AcademicPreviewProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  publications: Publication[];
  creativeWorks: CreativeWork[];
  grants: Grant[];
  teachingEntries: Teaching[];
  sectionTitles: SectionTitles;
  isAtsMode?: boolean;
}

export default function AcademicPreview({
  personalInfo,
  experiences,
  education,
  publications,
  creativeWorks,
  grants,
  teachingEntries,
  sectionTitles,
  isAtsMode = false
}: AcademicPreviewProps) {
  
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className={`bg-white p-12 max-w-[210mm] mx-auto text-sm ${isAtsMode ? 'text-black' : ''}`} style={{ fontFamily: isAtsMode ? 'Arial, sans-serif' : 'serif' }}>
      {/* Header */}
      <div className={`${isAtsMode ? 'text-left mb-6 border-b-2 border-black pb-2' : 'text-center mb-6'}`}>
        <h1 className={`text-3xl font-bold mb-1 ${isAtsMode ? 'uppercase' : ''}`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {!isAtsMode && <p className="font-bold text-base">Curriculum Vitae</p>}
        <p className="text-sm mt-2">
          {personalInfo.location && <>{personalInfo.location} | </>}
          {personalInfo.email && <><a href={`mailto:${personalInfo.email}`} className="text-blue-600">{personalInfo.email}</a></>}
          {personalInfo.phone && <> | {personalInfo.phone}</>}
        </p>
      </div>

      {/* Education & Employment History */}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black mb-3">
          {sectionTitles.education || 'EDUCATION & EMPLOYMENT HISTORY'}
        </h2>
        <div className="space-y-4">
          {education.filter(edu => edu.degree || edu.school).map((edu) => (
            <div key={edu.id}>
              <p className="font-bold">
                {edu.degree || 'Degree Name'}
                {edu.field && ` in ${edu.field}`}
              </p>
              <p>{edu.graduationDate ? `Year of completion: ${formatDate(edu.graduationDate)}` : 'Year of completion:'}</p>
              <p>{edu.school || 'Institution'}</p>
            </div>
          ))}
          
          {experiences.filter(exp => exp.position || exp.company).map((exp) => (
            <div key={exp.id}>
              <p className="font-bold">{exp.position || 'Position Title'}</p>
              <p>
                {exp.startDate ? formatDate(exp.startDate) : ''}
                {exp.endDate ? ` - ${formatDate(exp.endDate)}` : ' - Present'}
              </p>
              <p>{exp.company || 'Institution'}</p>
              {exp.description && <p className="mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black mb-3">
          {sectionTitles.publications || 'PUBLICATIONS'}
        </h2>
        
        {(() => {
          const pubTypes = {
            reviewed: 'Reviewed Articles',
            'non-reviewed': 'Non-Reviewed Articles',
            book: 'Books',
            chapter: 'Book Chapters',
            abstract: 'Abstracts',
            other: 'Other'
          };
          
          const hasAnyPubs = publications.some(p => p.citation);
          
          if (!hasAnyPubs) {
            return <p className="text-gray-600 italic">Example: Author, A., & Author, B. (2024). Article title. Journal Name, 10(2), 123-145.</p>;
          }
          
          return Object.entries(pubTypes).map(([type, title]) => {
            const pubs = publications.filter(p => p.type === type && p.citation);
            if (pubs.length === 0) return null;
            
            return (
              <div key={type} className="mb-4">
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <div className="space-y-2">
                  {pubs.map((pub) => (
                    <p key={pub.id} className="ml-4">{pub.citation}</p>
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </section>

      {/* Creative Activity */}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black mb-3">
          {sectionTitles.creativeActivity || 'CREATIVE ACTIVITY'}
        </h2>
        
        {(() => {
          const creativeTypes = {
            publication: 'Publications',
            presentation: 'Presentations',
            performance: 'Performance',
            exhibition: 'Exhibition',
            project: 'Projects'
          };
          
          const hasAnyWorks = creativeWorks.some(w => w.description);
          
          if (!hasAnyWorks) {
            return <p className="text-gray-600 italic">Example: Describe your creative activities, performances, exhibitions, or projects here.</p>;
          }
          
          return Object.entries(creativeTypes).map(([type, title]) => {
            const works = creativeWorks.filter(w => w.type === type && w.description);
            if (works.length === 0) return null;
            
            return (
              <div key={type} className="mb-4">
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <div className="space-y-2">
                  {works.map((work) => (
                    <p key={work.id} className="ml-4">{work.description}</p>
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </section>

      {/* Grants */}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black mb-3">
          {sectionTitles.grants || 'GRANTS'}
        </h2>
        
        {(() => {
          const externalGrants = grants.filter(g => g.type === 'external' && g.title);
          const internalGrants = grants.filter(g => g.type === 'internal' && g.title);
          const hasAnyGrants = grants.some(g => g.title);
          
          if (!hasAnyGrants) {
            return <p className="text-gray-600 italic">Example grant entry with all required fields.</p>;
          }
          
          return (
            <>
              {externalGrants.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-base mb-2">External Grants</h3>
                  {['funded', 'pending', 'not-funded'].map(status => {
                    const statusGrants = externalGrants.filter(g => g.status === status);
                    if (statusGrants.length === 0) return null;
                    
                    const statusTitle = status === 'funded' ? 'Funded' : status === 'pending' ? 'Pending' : 'Not Funded';
                    return (
                      <div key={status} className="ml-4 mb-3">
                        <h4 className="font-semibold text-sm mb-1">{statusTitle}</h4>
                        {statusGrants.map(grant => (
                          <div key={grant.id} className="ml-4 mb-2 text-sm">
                            <p><strong>Proposal Title:</strong> {grant.title}</p>
                            <p><strong>Funding Agency:</strong> {grant.agency}</p>
                            <p><strong>Role Status:</strong> {grant.role}</p>
                            {grant.effort && <p><strong>Percentage of Attributed Effort:</strong> {grant.effort}</p>}
                            {grant.budget && <p><strong>Total direct costs:</strong> {grant.budget}</p>}
                            {grant.period && <p><strong>Coverage Period:</strong> {grant.period}</p>}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {internalGrants.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-base mb-2">Internal Grants</h3>
                  {['funded', 'pending', 'not-funded'].map(status => {
                    const statusGrants = internalGrants.filter(g => g.status === status);
                    if (statusGrants.length === 0) return null;
                    
                    const statusTitle = status === 'funded' ? 'Funded' : status === 'pending' ? 'Pending' : 'Not Funded';
                    return (
                      <div key={status} className="ml-4 mb-3">
                        <h4 className="font-semibold text-sm mb-1">{statusTitle}</h4>
                        {statusGrants.map(grant => (
                          <div key={grant.id} className="ml-4 mb-2 text-sm">
                            <p><strong>Proposal Title:</strong> {grant.title}</p>
                            <p><strong>Funding Agency:</strong> {grant.agency}</p>
                            <p><strong>Role Status:</strong> {grant.role}</p>
                            {grant.effort && <p><strong>Percentage of Attributed Effort:</strong> {grant.effort}</p>}
                            {grant.budget && <p><strong>Total direct costs:</strong> {grant.budget}</p>}
                            {grant.period && <p><strong>Coverage Period:</strong> {grant.period}</p>}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* Teaching and Advising */}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black mb-3">
          {sectionTitles.teaching || 'TEACHING AND ADVISING'}
        </h2>
        
        {(() => {
          const courses = teachingEntries.filter(t => t.type === 'course' && t.title);
          const gradSupervision = teachingEntries.filter(t => t.type === 'grad-supervision' && t.title);
          const undergradSupervision = teachingEntries.filter(t => t.type === 'undergrad-supervision' && t.title);
          const advising = teachingEntries.filter(t => t.type === 'advising' && t.title);
          const hasAny = teachingEntries.some(t => t.title);
          
          if (!hasAny) {
            return <p className="text-gray-600 italic">Example: Course Title, Term and Year, Number of Students</p>;
          }
          
          return (
            <>
              {courses.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-base mb-2">Courses</h3>
                  {courses.map(course => (
                    <div key={course.id} className="ml-4 mb-2">
                      <p>{course.title}</p>
                      {course.details && <p className="text-sm">{course.details}</p>}
                    </div>
                  ))}
                </div>
              )}
              
              {gradSupervision.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-base mb-2">Supervision of Graduate Students</h3>
                  {gradSupervision.map(student => (
                    <div key={student.id} className="ml-4 mb-2">
                      <p><strong>Student Name:</strong> {student.title}</p>
                      {student.details && <p className="text-sm">{student.details}</p>}
                    </div>
                  ))}
                </div>
              )}
              
              {undergradSupervision.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-base mb-2">Supervision of Undergraduate Students</h3>
                  {undergradSupervision.map(student => (
                    <div key={student.id} className="ml-4 mb-2">
                      <p><strong>Student Name:</strong> {student.title}</p>
                      {student.details && <p className="text-sm">{student.details}</p>}
                    </div>
                  ))}
                </div>
              )}
              
              {advising.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-base mb-2">Advising Activities</h3>
                  {advising.map(activity => (
                    <div key={activity.id} className="ml-4 mb-2">
                      <p>{activity.title}</p>
                      {activity.details && <p className="text-sm">{activity.details}</p>}
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* Service & Professional Development */}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black mb-3">
          {sectionTitles.service || 'SERVICE & PROFESSIONAL DEVELOPMENT'}
        </h2>
        <p className="text-gray-600 italic">
          Example: List your service to institution, discipline, and community, as well as professional development activities.
        </p>
      </section>
    </div>
  );
}
