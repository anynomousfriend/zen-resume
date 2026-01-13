# 🌸 ZenResume

A beautiful resume building platform with mindful intention. Built with modern web technologies to provide a calm, clean, and delightful user experience.

## ✨ Features

- **🎨 Beautiful Cherry Blossom Theme**: Pink and white color scheme inspired by cherry blossoms, with a stunning dark mode featuring darker pink shades for a nighttime blossom aesthetic
- **🎭 ASCII Art Animations**: Animated cherry blossom ASCII art on the landing page using anime.js
- **📝 Intuitive Form Builder**: Gorgeous form fields with smooth interactions for building your resume
- **🌓 Light & Dark Mode**: Seamless theme switching with carefully crafted color palettes
- **✨ Micro-interactions**: Delightful animations and transitions throughout the application
- **📱 Fully Responsive**: Works beautifully on all devices
- **🎯 Section-based Navigation**: Organized sections for Personal Info, Experience, Education, and Skills

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (custom themed)
- **Animations**: anime.js & Framer Motion
- **Icons**: Lucide React
- **Theme Management**: next-themes

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
cd zenresume
```

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

```
zenresume/
├── app/
│   ├── builder/          # Resume builder page
│   ├── globals.css       # Global styles with custom animations
│   ├── layout.tsx        # Root layout with theme provider
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components (Button, Input, Card, etc.)
│   ├── cherry-blossom-ascii.tsx  # ASCII art animation component
│   ├── theme-provider.tsx        # Theme context provider
│   └── theme-toggle.tsx          # Dark/light mode toggle
├── lib/
│   └── utils.ts          # Utility functions
└── tailwind.config.ts    # Tailwind configuration with custom theme
\`\`\`

## 🎨 Color Palette

### Light Mode (Cherry Blossom Day)
- Primary: Pink shades (#ff3b94 - #ff61ad)
- Background: White with pink gradients
- Accents: Soft pink tones

### Dark Mode (Cherry Blossom Night)
- Primary: Darker pink shades (#ec4899 - #db2777)
- Background: Deep purple-pink (#500724 - #831843)
- Accents: Muted pink with glow effects

## 🌟 Key Components

### Landing Page
- Animated cherry blossom ASCII art
- Floating petal animations
- Feature showcase with glass-morphism cards
- Smooth scroll animations

### Resume Builder
- Section-based navigation (Personal Info, Experience, Education, Skills)
- Dynamic form fields with add/remove functionality
- Real-time form state management
- Beautiful input components with focus states
- Smooth transitions between sections

## 🎭 Animations

- **ASCII Art**: Floating cherry blossoms with rotation and opacity changes
- **Page Transitions**: Smooth fade-in and scale animations
- **Interactive Elements**: Hover effects, button press animations, and focus states
- **Floating Petals**: CSS-based falling petal animations
- **Micro-interactions**: Scale, shadow, and color transitions on user interaction

## 🔜 Future Enhancements

- Resume preview functionality
- PDF export with custom templates
- Multiple resume templates
- Resume data persistence (localStorage/database)
- Resume sharing capabilities
- Print-friendly layouts
- More customization options

## 📝 License

This project is open source and available under the MIT License.

## 🌸 About

ZenResume is designed to make resume building a delightful experience with mindful intention. In a world of noise, find your signal and craft your path with elegance.

---

**Crafted with love and cherry blossoms** 🌸
