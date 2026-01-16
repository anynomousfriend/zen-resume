# 🌸 ZenResume

> A beautiful, mindful resume builder with AI-powered certificate parsing and multiple export formats.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🎨 Beautiful UI/UX
- **Cherry Blossom Theme**: Pink and white color scheme with stunning dark mode
- **Animated ASCII Art**: Cherry blossom animations using anime.js
- **Glass-morphism Effects**: Modern, elegant design patterns
- **Smooth Transitions**: Delightful micro-interactions throughout
- **Fully Responsive**: Perfect on mobile, tablet, and desktop

### 📝 Resume Building
- **Intuitive Form Builder**: Section-based navigation (Personal Info, Experience, Education, Skills)
- **Drag & Drop Reordering**: Organize sections with ease
- **Real-time Preview**: See changes instantly with modern and academic templates
- **Dynamic Fields**: Add/remove entries for experience, education, and skills

### 🎓 Certificate Auto-Fill
- **PDF Upload**: Parse certificates from PDF files
- **AI-Powered Extraction**: Automatically extract course name, organization, date, and description
- **Smart Metadata Detection**: Uses PDF metadata and content analysis
- **One-Click Population**: Instantly fill education fields with parsed data

### 📤 Export Formats
- **LaTeX**: Professional templates (Modern, Clean, Academic)
- **PDF**: Direct export with custom styling
- **DOCX**: Microsoft Word compatible format
- **HTML**: Web-ready format

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
- **PDF Processing**: [pdf-lib](https://pdf-lib.js.org/)
- **PDF Export**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **DOCX**: [docx](https://docx.js.org/)
- **LaTeX**: Custom generators

### Utilities
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **File Export**: [file-saver](https://github.com/eligrey/FileSaver.js/)

## 📂 Project Structure

```
zen-resume/
├── app/
│   ├── api/
│   │   └── fetch-certificate/    # Certificate parsing API endpoint
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
│   ├── certificate-metadata-extractor.ts  # PDF metadata extraction
│   ├── certificate-parser.ts              # Certificate parsing logic
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

ZenResume embraces a **mindful, calm approach** to resume building:

### Color Palette

**Light Mode (Cherry Blossom Day)**
- Primary: `#ff3b94` to `#ff61ad`
- Background: White with pink gradients
- Accents: Soft pink tones

**Dark Mode (Cherry Blossom Night)**
- Primary: `#ec4899` to `#db2777`
- Background: Deep purple-pink (`#500724` to `#831843`)
- Accents: Muted pink with glow effects

### Animation Principles
- **Purposeful**: Every animation serves a function
- **Smooth**: 60fps transitions with proper easing
- **Subtle**: Enhance, don't distract
- **Accessible**: Respects prefers-reduced-motion

## 🎓 Certificate Auto-Fill Usage

1. Navigate to the Resume Builder
2. Go to the Education section
3. Click "Upload Certificate PDF"
4. Select a certificate PDF file
5. The system automatically extracts:
   - Course/Degree name
   - Institution/Organization
   - Completion date
   - Description/Details
6. Review and edit the auto-filled information
7. Add more entries as needed

**Supported formats**: PDF certificates from major platforms (Coursera, Udemy, edX, LinkedIn Learning, etc.)

## 📚 Documentation

Additional documentation is available in the `docs/` directory:

- [Certificate Auto-Fill Guide](docs/CERTIFICATE-AUTO-FILL.md)
- [Certificate Auto-Fill Usage](docs/CERTIFICATE-AUTO-FILL-USAGE.md)
- [Deployment Checklist](docs/DEPLOYMENT-CHECKLIST.md)
- [Quick Start Guide](docs/QUICK-START.md)
- [Visual Guide](docs/VISUAL-GUIDE.md)
- [Project Summary](docs/PROJECT-SUMMARY.md)
- [Documentation Index](docs/INDEX.md)

## 🔜 Roadmap

- [ ] AI-powered content suggestions
- [ ] Resume templates library expansion
- [ ] Multi-language support
- [ ] Cloud storage & sync
- [ ] Resume version control
- [ ] Collaborative editing
- [ ] ATS optimization checker
- [ ] Cover letter generator
- [ ] Portfolio integration

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

**ZenResume** is designed to make resume building a delightful, stress-free experience. In a world of noise, we help you find your signal and craft your professional story with elegance and intention.

Built with ❤️ and 🌸 by developers who care about craft.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components
- The open-source community for incredible tools and libraries

---

**Craft your path with mindfulness** 🌸✨

