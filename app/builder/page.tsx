"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Plus, Trash2, ArrowLeft, Download, Save, ChevronDown, FileText, ArrowUpDown
} from 'lucide-react';
import { SectionReorder, SectionId, DEFAULT_SECTION_ORDER } from '@/components/section-reorder';
import Link from 'next/link';
import { generateLatex } from '@/lib/latex-generator';
import { generateModernLatex } from '@/lib/latex-modern-generator';
import generateZenResume from '@/lib/latex-resume-generator';
import generateCleanResume from '@/lib/latex-clean-generator';
import generateResumeHTML from '@/lib/pdf-html-generator';
import generateDOCX from '@/lib/docx-generator';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import AcademicPreview from '@/components/preview-academic';
import ModernPreview from '@/components/preview-modern';

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

interface Skill {
  id: string;
  name: string;
  level: string;
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

interface Language {
  id: string;
  name: string;
  proficiency: string;
}

interface Publication {
  id: string;
  type: string; // 'reviewed' | 'non-reviewed' | 'book' | 'chapter' | 'abstract' | 'other'
  citation: string;
}

interface CreativeWork {
  id: string;
  type: string; // 'publication' | 'presentation' | 'performance' | 'exhibition' | 'project'
  description: string;
}

interface Grant {
  id: string;
  type: string; // 'external' | 'internal'
  status: string; // 'funded' | 'pending' | 'not-funded'
  title: string;
  agency: string;
  role: string;
  effort: string;
  budget: string;
  period: string;
}

interface Teaching {
  id: string;
  type: string; // 'course' | 'grad-supervision' | 'undergrad-supervision' | 'advising'
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

export default function BuilderPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    github: '',
    linkedin: '',
    website: ''
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [creativeWorks, setCreativeWorks] = useState<CreativeWork[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [teachingEntries, setTeachingEntries] = useState<Teaching[]>([]);
  const [sectionTitles, setSectionTitles] = useState<SectionTitles>({
    education: 'EDUCATION & EMPLOYMENT HISTORY',
    publications: 'PUBLICATIONS',
    creativeActivity: 'CREATIVE ACTIVITY',
    grants: 'GRANTS',
    teaching: 'TEACHING AND ADVISING',
    service: 'SERVICE & PROFESSIONAL DEVELOPMENT'
  });
  const [isSaved, setIsSaved] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isAtsMode, setIsAtsMode] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'academic' | 'modern'>('modern');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [activeSection, setActiveSection] = useState('personal');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>([...DEFAULT_SECTION_ORDER]);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resume-data', JSON.stringify({
        personalInfo,
        experiences,
        education,
        skills,
        projects,
        certifications,
        languages,
        publications,
        creativeWorks,
        grants,
        teachingEntries,
        sectionTitles,
        isAtsMode,
        sectionOrder
      }));
      setIsSaved(true);
    }, 1000);
    
    setIsSaved(false);
    return () => clearTimeout(timer);
  }, [personalInfo, experiences, education, skills, projects, certifications, languages, publications, creativeWorks, grants, teachingEntries, sectionTitles, isAtsMode, sectionOrder]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resume-data');
    if (saved) {
      const data = JSON.parse(saved);
      setPersonalInfo(data.personalInfo || personalInfo);
      setExperiences(data.experiences || experiences);
      setEducation(data.education || education);
      setSkills(data.skills || skills);
      setProjects(data.projects || projects);
      setCertifications(data.certifications || certifications);
      setLanguages(data.languages || languages);
      setPublications(data.publications || publications);
      setCreativeWorks(data.creativeWorks || creativeWorks);
      setGrants(data.grants || grants);
      setTeachingEntries(data.teachingEntries || teachingEntries);
      setSectionTitles(data.sectionTitles || sectionTitles);
      setIsAtsMode(data.isAtsMode || false);
      setSectionOrder(data.sectionOrder || [...DEFAULT_SECTION_ORDER]);
    }
  }, []);

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveSection(sectionId);
    }
  };

  // Intersection Observer for progressive disclosure
  useEffect(() => {
    if (viewMode !== 'edit') return;
    
    const sections = document.querySelectorAll('.form-chunk');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section') || '';
          if (id) setActiveSection(id);
        }
      });
    }, { threshold: 0.3, rootMargin: '-100px 0px' });

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [viewMode]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    }]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addSkill = () => {
    setSkills([...skills, {
      id: Date.now().toString(),
      name: '',
      level: 'intermediate'
    }]);
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const addProject = () => {
    setProjects([...projects, {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: '',
      link: ''
    }]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      link: ''
    }]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const addLanguage = () => {
    setLanguages([...languages, {
      id: Date.now().toString(),
      name: '',
      proficiency: 'intermediate'
    }]);
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const addPublication = () => {
    setPublications([...publications, {
      id: Date.now().toString(),
      type: 'reviewed',
      citation: ''
    }]);
  };

  const removePublication = (id: string) => {
    setPublications(publications.filter(pub => pub.id !== id));
  };

  const addCreativeWork = () => {
    setCreativeWorks([...creativeWorks, {
      id: Date.now().toString(),
      type: 'project',
      description: ''
    }]);
  };

  const removeCreativeWork = (id: string) => {
    setCreativeWorks(creativeWorks.filter(work => work.id !== id));
  };

  const addGrant = () => {
    setGrants([...grants, {
      id: Date.now().toString(),
      type: 'external',
      status: 'funded',
      title: '',
      agency: '',
      role: '',
      effort: '',
      budget: '',
      period: ''
    }]);
  };

  const removeGrant = (id: string) => {
    setGrants(grants.filter(grant => grant.id !== id));
  };

  const addTeaching = () => {
    setTeachingEntries([...teachingEntries, {
      id: Date.now().toString(),
      type: 'course',
      title: '',
      details: ''
    }]);
  };

  const removeTeaching = (id: string) => {
    setTeachingEntries(teachingEntries.filter(entry => entry.id !== id));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear all state
      setPersonalInfo({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        summary: ''
      });
      setExperiences([]);
      setEducation([]);
      setSkills([]);
      setProjects([]);
      setCertifications([]);
      setLanguages([]);
      setPublications([]);
      setCreativeWorks([]);
      setGrants([]);
      setTeachingEntries([]);
      setSectionTitles({
        education: 'EDUCATION & EMPLOYMENT HISTORY',
        publications: 'PUBLICATIONS',
        creativeActivity: 'CREATIVE ACTIVITY',
        grants: 'GRANTS',
        teaching: 'TEACHING AND ADVISING',
        service: 'SERVICE & PROFESSIONAL DEVELOPMENT'
      });
      setIsAtsMode(false);
      
      // Clear localStorage
      localStorage.removeItem('resume-data');
      setIsSaved(true);
    }
  };

  const downloadLatex = () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      // Use the new Clean Resume generator (modern professional format)
      const latexCode = generateCleanResume({
        personalInfo,
        experiences,
        education,
        projects,
        certifications,
        sectionOrder
      });
      
      const blob = new Blob([latexCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = personalInfo.fullName.replace(/\s+/g, '_') || 'resume';
      link.download = `${fileName}_clean_resume.tex`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting LaTeX:', error);
      alert('Error exporting LaTeX. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPDF = () => {
    setShowExportMenu(false);
    
    try {
      // Generate clean HTML matching reference design
      const htmlContent = generateResumeHTML({
        personalInfo,
        experiences,
        education,
        projects,
        certifications,
        sectionOrder
      });
      
      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Show instructions
        alert('PDF Export Instructions:\n\n' +
              '1. Print dialog will open automatically\n' +
              '2. Click "More settings" (if needed)\n' +
              '3. Turn OFF "Headers and footers"\n' +
              '4. Set Margins to "None" or "Minimum"\n' +
              '5. Choose "Save as PDF"\n' +
              '6. Click Save\n\n' +
              'This removes the date/time and "about:blank" text.');
        
        // Wait for content to load then trigger print dialog
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 250);
      } else {
        alert('Please allow pop-ups to export PDF.\n\nThen use File → Print → Save as PDF in the new window.');
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try Export as TEX instead.`);
    }
  };

  const downloadDOCX = async () => {
    setShowExportMenu(false);
    
    try {
      const doc = generateDOCX({
        personalInfo,
        experiences,
        education,
        projects,
        certifications,
        sectionOrder
      });
      
      const blob = await Packer.toBlob(doc);
      const fileName = personalInfo.fullName 
        ? `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`
        : 'Resume.docx';
      
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert(`DOCX generation failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try another export format.`);
    }
  };

  return (
    <main className="min-h-screen bg-washi transition-colors duration-500">
      {/* Texture Overlays */}
      <div className="noise-overlay" />
      <div className="paper-wash" />
      
      {/* Zen Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-washi/90 backdrop-blur-md border-b border-sumi/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <ArrowLeft className="w-4 h-4 text-indigo/60 group-hover:text-vermilion transition-colors" />
            <span className="font-serif text-xl font-bold text-indigo">
              ZenResume.
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-indigo/60 uppercase tracking-wider">
              {isSaved ? '✓ Saved' : 'Saving...'}
            </span>
            <div className="flex items-center gap-1 border border-sumi/20">
              <button
                onClick={() => setViewMode('edit')}
                className={`text-xs font-medium px-4 py-2 uppercase tracking-wider transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-indigo text-white' 
                    : 'text-indigo/60 hover:text-indigo'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`text-xs font-medium px-4 py-2 uppercase tracking-wider transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-indigo text-white' 
                    : 'text-indigo/60 hover:text-indigo'
                }`}
              >
                Preview
              </button>
            </div>
            <div className="flex items-center gap-1 border border-sumi/20">
              <button
                onClick={() => setIsAtsMode(false)}
                className={`text-xs font-medium px-3 py-2 uppercase tracking-wider transition-colors ${
                  !isAtsMode 
                    ? 'bg-indigo text-white' 
                    : 'text-indigo/60 hover:text-indigo'
                }`}
              >
                Human
              </button>
              <button
                onClick={() => setIsAtsMode(true)}
                className={`text-xs font-medium px-3 py-2 uppercase tracking-wider transition-colors ${
                  isAtsMode 
                    ? 'bg-indigo text-white' 
                    : 'text-indigo/60 hover:text-indigo'
                }`}
              >
                ATS
              </button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-indigo/60 hover:text-vermilion transition-colors"
              onClick={clearAll}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            
            {/* Reorder Sections Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-indigo/60 hover:text-vermilion transition-colors"
              onClick={() => setShowReorderModal(true)}
              title="Reorder sections"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
            
            {/* Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <Button 
                size="sm" 
                className="bg-transparent border border-sumi text-sumi hover:bg-sumi hover:text-washi transition-all uppercase tracking-wider text-xs"
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export'}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-sumi/20 shadow-lg z-50">
                  <button
                    onClick={downloadPDF}
                    className="w-full px-4 py-3 text-left text-sm text-sumi hover:bg-washi transition-colors flex items-center space-x-3"
                  >
                    <FileText className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">Export as PDF</span>
                      <span className="text-xs text-sumi/60">Print-friendly</span>
                    </div>
                  </button>
                  <button
                    onClick={downloadDOCX}
                    className="w-full px-4 py-3 text-left text-sm text-sumi hover:bg-washi transition-colors flex items-center space-x-3 border-t border-sumi/10"
                  >
                    <FileText className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">Export as DOCX</span>
                      <span className="text-xs text-sumi/60">ATS-friendly</span>
                    </div>
                  </button>
                  <button
                    onClick={downloadLatex}
                    className="w-full px-4 py-3 text-left text-sm text-sumi hover:bg-washi transition-colors flex items-center space-x-3 border-t border-sumi/10"
                  >
                    <FileText className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">Export as TEX</span>
                      <span className="text-xs text-sumi/60">LaTeX source</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Single View: Either Editor or Preview */}
      <div className="pt-[73px]">
        {viewMode === 'edit' ? (
          /* Edit Mode: Form Editor */
          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
            <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-16">
              
              {/* Sidebar Navigation */}
              <nav className="hidden lg:block sticky top-8 h-fit">
                <div className="space-y-8">
                  {[
                    { id: 'personal', label: 'Identity', number: '一' },
                    { id: 'experience', label: 'History', number: '二' },
                    { id: 'wisdom', label: 'Wisdom', number: '三' },
                    { id: 'creations', label: 'Creations', number: '四' },
                    { id: 'proof', label: 'Proof', number: '五' }
                  ].map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center space-x-4 transition-all duration-500 w-full text-left ${
                        activeSection === section.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-serif text-sm transition-all ${
                        activeSection === section.id 
                          ? 'bg-sumi text-washi border-sumi' 
                          : 'border-sumi text-sumi'
                      }`}>
                        {section.number}
                      </div>
                      <span className="text-xs uppercase tracking-wider text-sumi">{section.label}</span>
                    </button>
                  ))}
                </div>
              </nav>

              {/* Form Content */}
              <div className="space-y-12">

            {/* Personal Info Section - Zen Styled */}
            <section 
              data-section="personal"
              className={`form-chunk relative bg-white p-12 border border-sumi/10 transition-all duration-500 ${
                activeSection === 'personal' ? 'active' : ''
              }`}
            >
              <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-sumi/10">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-vermilion font-bold block mb-2">Essential</span>
                  <h2 className="font-serif text-3xl font-bold text-indigo">
                    Identity
                  </h2>
                </div>
                <span className="text-xs text-indigo/40">1 / 5</span>
              </div>
              
              <div className="space-y-8">
                <div className="relative">
                  <Input
                    id="fullName"
                    placeholder=" "
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    className="font-serif text-xl pt-4"
                  />
                  <Label htmlFor="fullName" className="floating-label">Full Name</Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder=" "
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="font-serif text-xl pt-4"
                    />
                    <Label htmlFor="email" className="floating-label">Email Address</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="phone"
                      placeholder=" "
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="font-serif text-xl pt-4"
                    />
                    <Label htmlFor="phone" className="floating-label">Phone</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <Input
                      id="location"
                      placeholder=" "
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      className="font-serif text-xl pt-4"
                    />
                    <Label htmlFor="location" className="floating-label">Location</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="title"
                      placeholder=" "
                      value={personalInfo.title}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                      className="font-serif text-xl pt-4"
                    />
                    <Label htmlFor="title" className="floating-label">Professional Title</Label>
                  </div>
                </div>
                
                <div className="relative">
                  <Textarea
                    id="summary"
                    rows={4}
                    placeholder=" "
                    value={personalInfo.summary}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                    className="font-serif text-lg pt-4"
                  />
                  <Label htmlFor="summary" className="floating-label">Professional Summary</Label>
                </div>
                
                {/* Social Links - Optional */}
                <div className="pt-4 border-t border-sumi/10">
                  <p className="text-xs uppercase tracking-wider text-indigo/60 mb-4">Social Links (Optional)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="relative">
                      <Input
                        id="github"
                        placeholder=" "
                        value={personalInfo.github || ''}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                        className="font-serif text-xl pt-4"
                      />
                      <Label htmlFor="github" className="floating-label">GitHub Username</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="linkedin"
                        placeholder=" "
                        value={personalInfo.linkedin || ''}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                        className="font-serif text-xl pt-4"
                      />
                      <Label htmlFor="linkedin" className="floating-label">LinkedIn Username</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="website"
                        placeholder=" "
                        value={personalInfo.website || ''}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                        className="font-serif text-xl pt-4"
                      />
                      <Label htmlFor="website" className="floating-label">Website URL</Label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section - Zen Styled */}
            <section 
              data-section="experience"
              className={`form-chunk relative bg-white p-12 border border-sumi/10 transition-all duration-500 ${
                activeSection === 'experience' ? 'active' : ''
              }`}
            >
              <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-sumi/10">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-vermilion font-bold block mb-2">Professional</span>
                  <h2 className="font-serif text-3xl font-bold text-indigo">
                    History
                  </h2>
                </div>
                <span className="text-xs text-indigo/40">2 / 5</span>
              </div>
              
              <div className="space-y-6">
                {experiences.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-sumi/20">
                    <p className="text-base text-indigo/40 mb-6">No experience added yet</p>
                    <Button
                      onClick={addExperience}
                      className="bg-transparent border border-sumi text-sumi hover:bg-sumi hover:text-washi transition-all uppercase tracking-wider text-xs"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                ) : (
                  <>
                    {experiences.map((exp, index) => (
                  <div key={exp.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Position {index + 1}</span>
                      {experiences.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Company</Label>
                          <Input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].company = e.target.value;
                              setExperiences(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Position</Label>
                          <Input
                            placeholder="Job Title"
                            value={exp.position}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].position = e.target.value;
                              setExperiences(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].startDate = e.target.value;
                              setExperiences(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">End Date</Label>
                          <Input
                            type="month"
                            placeholder="Present"
                            value={exp.endDate}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].endDate = e.target.value;
                              setExperiences(updated);
                            }}
                            disabled={exp.current}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600 disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current || false}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].current = e.target.checked;
                            if (e.target.checked) {
                              updated[index].endDate = 'Present';
                            } else {
                              updated[index].endDate = '';
                            }
                            setExperiences(updated);
                          }}
                          className="w-4 h-4 text-vermilion border-gray-300 rounded focus:ring-vermilion"
                        />
                        <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal text-gray-600 dark:text-gray-400 cursor-pointer">
                          I currently work here
                        </Label>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</Label>
                        <Textarea
                          rows={3}
                          placeholder="Key responsibilities and achievements..."
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].description = e.target.value;
                            setExperiences(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                    <Button
                      onClick={addExperience}
                      variant="outline"
                      className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Experience
                    </Button>
                  </>
                )}
              </div>
            </section>

            {/* Education Section - Zen Styled */}
            <section 
              data-section="wisdom"
              className={`form-chunk relative bg-white p-12 border border-sumi/10 transition-all duration-500 ${
                activeSection === 'wisdom' ? 'active' : ''
              }`}
            >
              <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-sumi/10">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-vermilion font-bold block mb-2">Academic</span>
                  <h2 className="font-serif text-3xl font-bold text-indigo">
                    Wisdom
                  </h2>
                </div>
                <span className="text-xs text-indigo/40">3 / 5</span>
              </div>
              <div className="space-y-6">
                {education.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 dark:text-gray-600 mb-3">No education added yet</p>
                    <Button
                      onClick={addEducation}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Education
                    </Button>
                  </div>
                ) : (
                  <>
                    {education.map((edu, index) => (
                  <div key={edu.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Education {index + 1}</span>
                      {education.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">School/University</Label>
                          <Input
                            placeholder="University Name"
                            value={edu.school}
                            onChange={(e) => {
                              const updated = [...education];
                              updated[index].school = e.target.value;
                              setEducation(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Degree</Label>
                          <Input
                            placeholder="Bachelor's, Master's, etc."
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...education];
                              updated[index].degree = e.target.value;
                              setEducation(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Field of Study</Label>
                          <Input
                            placeholder="Computer Science"
                            value={edu.field}
                            onChange={(e) => {
                              const updated = [...education];
                              updated[index].field = e.target.value;
                              setEducation(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Graduation Date</Label>
                          <Input
                            type="month"
                            value={edu.graduationDate}
                            onChange={(e) => {
                              const updated = [...education];
                              updated[index].graduationDate = e.target.value;
                              setEducation(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                    <Button
                      onClick={addEducation}
                      variant="outline"
                      className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Education
                    </Button>
                  </>
                )}
              </div>
            </section>

            {/* Skills Section */}
            <section className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Skills
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Your technical and soft skills
                </p>
              </div>
              <div className="space-y-6">
                {skills.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 dark:text-gray-600 mb-3">No skills added yet</p>
                    <Button
                      onClick={addSkill}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Skill
                    </Button>
                  </div>
                ) : (
                  <>
                    {skills.map((skill, index) => (
                  <div key={skill.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Skill {index + 1}</span>
                      {skills.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Skill Name</Label>
                          <Input
                            placeholder="e.g. JavaScript, Leadership"
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...skills];
                              updated[index].name = e.target.value;
                              setSkills(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Proficiency</Label>
                          <select
                            className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-blossom-400 dark:focus:border-blossom-600 transition-colors"
                            value={skill.level}
                            onChange={(e) => {
                              const updated = [...skills];
                              updated[index].level = e.target.value;
                              setSkills(updated);
                            }}
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                    <Button
                      onClick={addSkill}
                      variant="outline"
                      className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Skill
                    </Button>
                  </>
                )}
              </div>
            </section>

            {/* Projects Section - Zen Styled */}
            <section 
              data-section="creations"
              className={`form-chunk relative bg-white p-12 border border-sumi/10 transition-all duration-500 ${
                activeSection === 'creations' ? 'active' : ''
              }`}
            >
              <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-sumi/10">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-vermilion font-bold block mb-2">Portfolio</span>
                  <h2 className="font-serif text-3xl font-bold text-indigo">
                    Creations
                  </h2>
                </div>
                <span className="text-xs text-indigo/40">4 / 5</span>
              </div>
              <div className="space-y-6">
                {projects.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 dark:text-gray-600 mb-3">No projects added yet</p>
                    <Button
                      onClick={addProject}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </div>
                ) : (
                  <>
                    {projects.map((project, index) => (
                  <div key={project.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Project {index + 1}</span>
                      {projects.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Project Title</Label>
                        <Input
                          placeholder="E-commerce Platform"
                          value={project.title}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].title = e.target.value;
                            setProjects(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600 transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</Label>
                        <Textarea
                          rows={3}
                          placeholder="Brief description of the project and your contributions..."
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].description = e.target.value;
                            setProjects(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Technologies</Label>
                          <Input
                            placeholder="React, Node.js, MongoDB"
                            value={project.technologies}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].technologies = e.target.value;
                              setProjects(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Link (Optional)</Label>
                          <Input
                            placeholder="https://project.com"
                            value={project.link}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].link = e.target.value;
                              setProjects(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addProject}
                  variant="outline"
                  className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </>
            )}
          </div>
        </section>

            {/* Certifications Section - Zen Styled */}
            <section 
              data-section="proof"
              className={`form-chunk relative bg-white p-12 border border-sumi/10 transition-all duration-500 ${
                activeSection === 'proof' ? 'active' : ''
              }`}
            >
              <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-sumi/10">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-vermilion font-bold block mb-2">Credentials</span>
                  <h2 className="font-serif text-3xl font-bold text-indigo">
                    Proof
                  </h2>
                </div>
                <span className="text-xs text-indigo/40">5 / 5</span>
              </div>
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <div key={cert.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Certification {index + 1}</span>
                      {certifications.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(cert.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Certification Name</Label>
                          <Input
                            placeholder="AWS Certified Solutions Architect"
                            value={cert.name}
                            onChange={(e) => {
                              const updated = [...certifications];
                              updated[index].name = e.target.value;
                              setCertifications(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Issuing Organization</Label>
                          <Input
                            placeholder="Amazon Web Services"
                            value={cert.issuer}
                            onChange={(e) => {
                              const updated = [...certifications];
                              updated[index].issuer = e.target.value;
                              setCertifications(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Issue Date</Label>
                          <Input
                            type="month"
                            value={cert.date}
                            onChange={(e) => {
                              const updated = [...certifications];
                              updated[index].date = e.target.value;
                              setCertifications(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Credential ID (Optional)</Label>
                          <Input
                            placeholder="ABC123XYZ"
                            value={cert.credentialId}
                            onChange={(e) => {
                              const updated = [...certifications];
                              updated[index].credentialId = e.target.value;
                              setCertifications(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Verification Link (Optional)</Label>
                        <Input
                          placeholder="https://verify.example.com/cert123"
                          value={cert.link || ''}
                          onChange={(e) => {
                            const updated = [...certifications];
                            updated[index].link = e.target.value;
                            setCertifications(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addCertification}
                  variant="outline"
                  className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </section>

            {/* Languages Section */}
            <section className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Languages
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Languages you speak
                </p>
              </div>
              <div className="space-y-6">
                {languages.map((lang, index) => (
                  <div key={lang.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Language {index + 1}</span>
                      {languages.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLanguage(lang.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Language</Label>
                          <Input
                            placeholder="English, Spanish, etc."
                            value={lang.name}
                            onChange={(e) => {
                              const updated = [...languages];
                              updated[index].name = e.target.value;
                              setLanguages(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Proficiency</Label>
                          <select
                            className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-blossom-400 dark:focus:border-blossom-600 transition-colors"
                            value={lang.proficiency}
                            onChange={(e) => {
                              const updated = [...languages];
                              updated[index].proficiency = e.target.value;
                              setLanguages(updated);
                            }}
                          >
                            <option value="native">Native</option>
                            <option value="fluent">Fluent</option>
                            <option value="advanced">Advanced</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="beginner">Beginner</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addLanguage}
                  variant="outline"
                  className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Language
                </Button>
              </div>
            </section>

            {/* Publications Section */}
            <section className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Publications
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Your academic publications
                </p>
              </div>
              <div className="space-y-6">
                {publications.map((pub, index) => (
                  <div key={pub.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Publication {index + 1}</span>
                      {publications.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePublication(pub.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Type</Label>
                        <select
                          className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-blossom-400 dark:focus:border-blossom-600 transition-colors"
                          value={pub.type}
                          onChange={(e) => {
                            const updated = [...publications];
                            updated[index].type = e.target.value;
                            setPublications(updated);
                          }}
                        >
                          <option value="reviewed">Reviewed Article</option>
                          <option value="non-reviewed">Non-Reviewed Article</option>
                          <option value="book">Book</option>
                          <option value="chapter">Book Chapter</option>
                          <option value="abstract">Abstract</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Citation</Label>
                        <Textarea
                          rows={3}
                          placeholder="Author(s). (Year). Title. Journal/Publisher, Volume(Issue), pages. DOI/URL"
                          value={pub.citation}
                          onChange={(e) => {
                            const updated = [...publications];
                            updated[index].citation = e.target.value;
                            setPublications(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addPublication}
                  variant="outline"
                  className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Publication
                </Button>
              </div>
            </section>

            {/* Creative Activity Section */}
            <section className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Creative Activity
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Publications, presentations, performances, exhibitions, projects
                </p>
              </div>
              <div className="space-y-6">
                {creativeWorks.map((work, index) => (
                  <div key={work.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Work {index + 1}</span>
                      {creativeWorks.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCreativeWork(work.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Type</Label>
                        <select
                          className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-blossom-400 dark:focus:border-blossom-600 transition-colors"
                          value={work.type}
                          onChange={(e) => {
                            const updated = [...creativeWorks];
                            updated[index].type = e.target.value;
                            setCreativeWorks(updated);
                          }}
                        >
                          <option value="publication">Publication</option>
                          <option value="presentation">Presentation</option>
                          <option value="performance">Performance</option>
                          <option value="exhibition">Exhibition</option>
                          <option value="project">Project</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</Label>
                        <Textarea
                          rows={3}
                          placeholder="Detailed description of the creative work..."
                          value={work.description}
                          onChange={(e) => {
                            const updated = [...creativeWorks];
                            updated[index].description = e.target.value;
                            setCreativeWorks(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addCreativeWork}
                  variant="outline"
                  className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Creative Work
                </Button>
              </div>
            </section>

            {/* Grants Section */}
            <section className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Grants
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Your grant proposals and funding
                </p>
              </div>
              <div className="space-y-6">
                {grants.map((grant, index) => (
                  <div key={grant.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Grant {index + 1}</span>
                      {grants.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGrant(grant.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Type</Label>
                          <select
                            className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-blossom-400 dark:focus:border-blossom-600 transition-colors"
                            value={grant.type}
                            onChange={(e) => {
                              const updated = [...grants];
                              updated[index].type = e.target.value;
                              setGrants(updated);
                            }}
                          >
                            <option value="external">External Grant</option>
                            <option value="internal">Internal Grant</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Status</Label>
                          <select
                            className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-blossom-400 dark:focus:border-blossom-600 transition-colors"
                            value={grant.status}
                            onChange={(e) => {
                              const updated = [...grants];
                              updated[index].status = e.target.value;
                              setGrants(updated);
                            }}
                          >
                            <option value="funded">Funded</option>
                            <option value="pending">Pending</option>
                            <option value="not-funded">Not Funded</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Proposal Title</Label>
                        <Input
                          placeholder="Title of the grant proposal"
                          value={grant.title}
                          onChange={(e) => {
                            const updated = [...grants];
                            updated[index].title = e.target.value;
                            setGrants(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Funding Agency</Label>
                          <Input
                            placeholder="e.g., NSF, NIH"
                            value={grant.agency}
                            onChange={(e) => {
                              const updated = [...grants];
                              updated[index].agency = e.target.value;
                              setGrants(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Role</Label>
                          <Input
                            placeholder="PI, Co-PI, etc."
                            value={grant.role}
                            onChange={(e) => {
                              const updated = [...grants];
                              updated[index].role = e.target.value;
                              setGrants(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Effort %</Label>
                          <Input
                            placeholder="e.g., 20%"
                            value={grant.effort}
                            onChange={(e) => {
                              const updated = [...grants];
                              updated[index].effort = e.target.value;
                              setGrants(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Budget</Label>
                          <Input
                            placeholder="e.g., $500,000"
                            value={grant.budget}
                            onChange={(e) => {
                              const updated = [...grants];
                              updated[index].budget = e.target.value;
                              setGrants(updated);
                            }}
                            className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Coverage Period</Label>
                        <Input
                          placeholder="e.g., 2023-2026"
                          value={grant.period}
                          onChange={(e) => {
                            const updated = [...grants];
                            updated[index].period = e.target.value;
                            setGrants(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addGrant}
                  variant="outline"
                  className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Grant
                </Button>
              </div>
            </section>

            {/* Teaching & Advising Section */}
            <section className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Teaching & Advising
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Your teaching experience and student supervision
                </p>
              </div>
              <div className="space-y-6">
                {teachingEntries.map((entry, index) => (
                  <div key={entry.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-900 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Entry {index + 1}</span>
                      {teachingEntries.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTeaching(entry.id)}
                          className="h-7 text-xs text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Type</Label>
                        <select
                          className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:border-blossom-400 dark:focus:border-blossom-600 transition-colors"
                          value={entry.type}
                          onChange={(e) => {
                            const updated = [...teachingEntries];
                            updated[index].type = e.target.value;
                            setTeachingEntries(updated);
                          }}
                        >
                          <option value="course">Course</option>
                          <option value="grad-supervision">Graduate Supervision</option>
                          <option value="undergrad-supervision">Undergraduate Supervision</option>
                          <option value="advising">Advising Activities</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Title/Name</Label>
                        <Input
                          placeholder="Course title, student name, or activity description"
                          value={entry.title}
                          onChange={(e) => {
                            const updated = [...teachingEntries];
                            updated[index].title = e.target.value;
                            setTeachingEntries(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Details</Label>
                        <Textarea
                          rows={3}
                          placeholder="Term/year, number of students, thesis title, additional information..."
                          value={entry.details}
                          onChange={(e) => {
                            const updated = [...teachingEntries];
                            updated[index].details = e.target.value;
                            setTeachingEntries(updated);
                          }}
                          className="border-gray-200 dark:border-gray-800 focus:border-blossom-400 dark:focus:border-blossom-600 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addTeaching}
                  variant="outline"
                  className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-blossom-400 dark:hover:border-blossom-600 text-gray-600 dark:text-gray-400 hover:text-blossom-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Teaching Entry
                </Button>
              </div>
            </section>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode: Full-screen Preview */
          <div className="overflow-y-auto bg-gray-50" style={{ height: 'calc(100vh - 73px)' }}>
            <div className="max-w-7xl mx-auto px-8 py-12">
              {/* Preview Content */}
              <div ref={previewRef} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <ModernPreview
                  personalInfo={personalInfo}
                  experiences={experiences}
                  education={education}
                  projects={projects}
                  skills={skills}
                  isAtsMode={isAtsMode}
                  sectionOrder={sectionOrder}
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Section Reorder Modal */}
      {showReorderModal && (
        <SectionReorder
          sectionOrder={sectionOrder}
          onOrderChange={setSectionOrder}
          onClose={() => setShowReorderModal(false)}
        />
      )}
    </main>
  );
}
