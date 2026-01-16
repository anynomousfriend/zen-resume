# 🌸 ZenResume

> A beautiful, mindful resume builder with automated certificate data extraction and multiple export formats.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🎨 Beautiful UI/UX
- **Zen Design System**: Japanese-inspired minimalist aesthetic with washi (cream paper), sumi (ink black), indigo, and vermilion accent colors
- **Animated ASCII Art**: Cherry blossom animations using anime.js on the landing page
- **Minimal Glassmorphism**: Subtle backdrop-blur effects on headers for depth
- **Smooth Transitions**: Delightful micro-interactions with cubic-bezier easing
- **Fully Responsive**: Perfect on mobile, tablet, and desktop
- **Dark Mode Support**: Thoughtfully designed dark theme with adjusted color palette

### 📝 Resume Building
- **Intuitive Form Builder**: Section-based navigation (Personal Info, Experience, Education, Skills, Projects, Certifications)
- **Drag & Drop Reordering**: Organize sections with ease using @dnd-kit
- **Real-time Preview**: See changes instantly with modern and academic templates
- **Dynamic Fields**: Add/remove entries for all sections
- **Auto-save**: Your data is automatically saved to browser localStorage

### 🎓 Certificate Auto-Fill
- **Paste Certificate URL**: Simply paste your certificate link from supported platforms
- **Automatic Data Extraction**: Fetches and parses certificate metadata from the web
- **Smart Platform Detection**: Automatically detects Coursera, Credly, edX, LinkedIn Learning, Udemy, and more
- **One-Click Population**: Instantly fills certificate name, issuer, date, and credential ID
- **Supported Platforms**:
  - Coursera
  - Credly (with JSON API support)
  - edX
  - LinkedIn Learning
  - Udemy
  - And many more...

### 📤 Export Formats
- **LaTeX (.tex)**: Professional LaTeX source with clean, modern template
- **PDF**: Print-friendly export via browser print dialog
- **DOCX (.docx)**: Microsoft Word compatible format (ATS-friendly)
- **HTML**: Web-ready format

### 🎯 Additional Features
- **ATS Mode**: Toggle between human-readable and ATS-optimized views
- **Section Reordering**: Customize the order of resume sections
- **Template Switching**: Choose between Modern and Academic templates
- **Floating Labels**: Elegant form inputs with animated labels
- **Japanese Typography**: Noto Serif JP and Playfair Display fonts

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/anynomousfriend/zen-resume.git
cd zen-resume

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)

### UI & Animations
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (custom themed)
- **Animations**: [anime.js](https://animejs.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### Document Generation
- **PDF Export**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **DOCX**: [docx](https://docx.js.org/)
- **LaTeX**: Custom generators

### Certificate Parsing
- **URL Parsing**: Custom certificate URL parser supporting 10+ platforms
- **Web Scraping**: Platform-specific metadata extractors
- **API Integration**: Credly JSON API for enhanced data

### Utilities
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **File Export**: [file-saver](https://github.com/eligrey/FileSaver.js/)

## 📂 Project Structure

```
zen-resume/
├── app/
│   ├── api/
│   │   └── fetch-certificate/    # Certificate data fetching API endpoint
│   ├── builder/                   # Resume builder page
│   ├── globals.css                # Global styles & animations
│   ├── layout.tsx                 # Root layout with theme provider
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── cherry-blossom-ascii.tsx   # ASCII art animation
│   ├── cursor-selector.tsx        # Custom cursor component
│   ├── ink-cursor.tsx             # Ink effect cursor
│   ├── preview-academic.tsx       # Academic resume preview
│   ├── preview-modern.tsx         # Modern resume preview
│   ├── section-reorder.tsx        # Drag & drop section reordering
│   ├── theme-provider.tsx         # Theme context
│   └── theme-toggle.tsx           # Dark/light mode toggle
├── lib/
│   ├── certificate-metadata-extractor.ts  # Platform-specific metadata extraction
│   ├── certificate-parser.ts              # Certificate URL parsing
│   ├── docx-generator.ts                  # DOCX export
│   ├── latex-clean-generator.ts           # Clean LaTeX template
│   ├── latex-generator.ts                 # LaTeX base generator
│   ├── latex-modern-generator.ts          # Modern LaTeX template
│   ├── latex-resume-generator.ts          # Resume LaTeX generator
│   ├── pdf-html-generator.ts              # PDF/HTML export
│   └── utils.ts                           # Utility functions
├── public/                        # Static assets
├── docs/                          # Documentation files
└── README.md                      # This file
```

## 🎨 Design Philosophy

ZenResume embraces a **Japanese-inspired, minimalist approach** to resume building:

### Zen Design System Color Palette

**Core Colors**
- **Washi** (和紙): `#F2F0EB` - Cream paper color for backgrounds
- **Sumi** (墨): `#1A1A1A` - Deep ink black for text
- **Indigo** (藍): `#2F3640` - Muted blue-gray for headings
- **Vermilion** (朱): `#BC3F3C` - Red accent for highlights
- **Gold** (金): `#D4AF37` - Metallic gold for special elements
- **Sakura** (桜): `#E6C0C0` - Soft pink for subtle touches

### Design Principles
- **Ma (間)**: Negative space and breathing room
- **Kanso (簡素)**: Simplicity and elimination of clutter
- **Shizen (自然)**: Natural and effortless feel
- **Shibui (渋い)**: Subtle and understated elegance
- **Seijaku (静寂)**: Tranquility and calm

### Typography
- **Serif**: Playfair Display & Noto Serif JP for elegance
- **Sans**: Inter for clean body text
- **Monospace**: Courier New for ASCII art

### Animation Principles
- **Purposeful**: Every animation serves a function
- **Smooth**: 60fps transitions with cubic-bezier(0.16, 1, 0.3, 1) easing
- **Subtle**: Enhance, don't distract
- **Accessible**: Respects prefers-reduced-motion

## 🎓 Certificate Auto-Fill Usage

### How It Works

1. **Navigate** to the Resume Builder
2. **Go to** the Certifications section
3. **Paste** your certificate URL in the "Certificate Link" field
   - Example: `https://www.coursera.org/account/accomplishments/certificate/XXXXX`
4. **Click** the "Fetch Details" button
5. The system automatically:
   - Detects the platform (Coursera, Credly, edX, etc.)
   - Fetches the certificate page
   - Extracts metadata using platform-specific parsers
   - Auto-fills: Certificate name, Issuer, Date, and Credential ID
6. **Review** and edit the auto-filled information as needed
7. **Add** more certificates by repeating the process

### Supported Certificate Platforms

- **Coursera**: Full metadata extraction
- **Credly**: JSON API integration for reliable data
- **edX**: Course name, organization, and date extraction
- **LinkedIn Learning**: Certificate details parsing
- **Udemy**: Course completion certificates
- **Google Career Certificates**: Via Coursera/Credly
- **IBM Digital Badges**: Via Credly
- **AWS Training**: Via Credly
- **And more...**

### Technical Details

The certificate auto-fill feature works by:
- **Parsing** the certificate URL to identify the platform
- **Fetching** the certificate webpage (server-side to avoid CORS)
- **Extracting** metadata using platform-specific HTML/API parsers
- **Formatting** dates to YYYY-MM format
- **Handling** errors gracefully with helpful messages

**No AI is used** - this is pure web scraping and API integration.

## 📚 Documentation

Additional documentation is available in the `docs/` directory:

- [Certificate Auto-Fill Guide](docs/CERTIFICATE-AUTO-FILL.md) - Technical implementation details
- [Certificate Auto-Fill Usage](docs/CERTIFICATE-AUTO-FILL-USAGE.md) - User guide
- [Deployment Checklist](docs/DEPLOYMENT-CHECKLIST.md) - Production deployment guide
- [Quick Start Guide](docs/QUICK-START.md) - Getting started quickly
- [Visual Guide](docs/VISUAL-GUIDE.md) - UI/UX walkthrough
- [Project Summary](docs/PROJECT-SUMMARY.md) - Complete project overview
- [Documentation Index](docs/INDEX.md) - Full documentation index

## 🔜 Roadmap

- [ ] More certificate platform support
- [ ] Resume templates library expansion
- [ ] Multi-language support
- [ ] Cloud storage & sync
- [ ] Resume version control
- [ ] Collaborative editing
- [ ] ATS optimization checker
- [ ] Cover letter generator
- [ ] Portfolio integration
- [ ] LinkedIn profile import

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌸 About

**ZenResume** is designed to make resume building a delightful, stress-free experience. Inspired by Japanese aesthetics and the principles of Zen design, we help you find your signal in a world of noise and craft your professional story with elegance and intention.

Built with ❤️ and 禅 by developers who care about craft.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment platform
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components
- Certificate platforms for providing accessible public certificate data
- The open-source community for incredible tools and libraries
- Japanese design philosophy for inspiring the aesthetic

---

**Craft your path with mindfulness** 🌸✨
