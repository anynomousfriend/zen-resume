# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have Node.js installed:

```bash
node --version  # Should be v20 or higher
npm --version   # Should be v9 or higher
```

If you don't have Node.js, install it from [nodejs.org](https://nodejs.org/)

---

## 🌸 Three Ways to Start

### Option 1: Using the Start Script (Recommended)
```bash
cd resume-blossom
./start-dev.sh
```

### Option 2: Manual npm commands
```bash
cd resume-blossom
npm install
npm run dev
```

### Option 3: Using yarn or pnpm
```bash
cd resume-blossom

# With yarn
yarn install
yarn dev

# With pnpm
pnpm install
pnpm dev
```

---

## 📱 Access the Application

Once the development server starts, open your browser to:

**🌐 http://localhost:3000**

You should see:
- 🌸 Cherry blossom ASCII art animation
- 🎨 Beautiful pink and white gradient background
- ✨ Smooth animations throughout
- 🌙 Theme toggle in the header

---

## 🎯 Quick Tour

### 1. Landing Page (/)
- Animated cherry blossom ASCII art
- Floating petals in the background
- Feature cards with glass effect
- "Start Creating" button to begin

### 2. Resume Builder (/builder)
- Click "Start Creating" or navigate to `/builder`
- Use the sidebar to switch between sections:
  - 👤 Personal Info
  - 💼 Experience
  - 🎓 Education
  - 💻 Skills
- Fill in the form fields (all animated!)
- Click ➕ to add multiple entries
- Click 🗑️ to remove entries

### 3. Theme Toggle
- Click the sun/moon icon in the header
- Watch the smooth transition from day to night theme
- Notice how colors change to darker pink shades

---

## ⚡ What You'll See

### On First Load:
1. ✨ Hero text fades in with stagger effect
2. 🌸 ASCII cherry blossoms float and rotate
3. 💮 Petals fall gracefully across the screen
4. 🎴 Feature cards animate into view on scroll

### When Navigating:
1. 🔄 Smooth page transitions
2. 📋 Forms slide in with scale animation
3. 🎨 Colors transition smoothly
4. ✨ Micro-interactions on every element

---

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
npm run dev -- -p 3001
```
Then open http://localhost:3001

### Dependencies Not Installing
Try clearing cache:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
Ensure TypeScript is installed:
```bash
npm install -D typescript @types/react @types/node
```

### Animations Not Working
Make sure anime.js is installed:
```bash
npm install animejs
```

---

## 📦 What Gets Installed

When you run `npm install`, you'll get:

### Core (5 packages)
- Next.js 15
- React 19
- TypeScript 5

### Styling (4 packages)
- Tailwind CSS
- tailwindcss-animate
- next-themes
- PostCSS

### UI Components (3 packages)
- @radix-ui/react-label
- @radix-ui/react-slot
- lucide-react (icons)

### Utilities (3 packages)
- class-variance-authority
- clsx
- tailwind-merge

### Animations (2 packages)
- anime.js
- framer-motion

**Total: ~17 main packages + their dependencies**

---

## 🎨 Testing the Theme

### Light Mode (Default)
- Pink and white colors
- Soft shadows
- Bright, cheerful atmosphere

### Dark Mode
- Click the moon icon
- Darker pink tones
- Deep purple-pink background
- Glowing effects

Try toggling between themes while on different pages to see the smooth transitions!

---

## 💡 Pro Tips

1. **Open DevTools**: Press F12 to see the beautiful animations in slow motion
2. **Resize Window**: Watch the responsive design adapt smoothly
3. **Hover Everything**: Every interactive element has a hover effect
4. **Focus States**: Tab through the form to see accessibility features
5. **Scroll Animations**: Scroll down on the landing page to trigger animations

---

## 🎯 Next Steps

After exploring the app:

1. **Customize Colors**: Edit `tailwind.config.ts` to change the theme
2. **Add Features**: The codebase is well-structured for extensions
3. **Deploy**: Run `npm run build` to create a production build

---

## 📚 Documentation

- **README.md**: Full project documentation
- **PROJECT-SUMMARY.md**: Detailed feature list and status
- **VISUAL-GUIDE.md**: Visual design reference

---

## 🆘 Need Help?

Check the project structure:
```bash
cd resume-blossom
ls -la app/
ls -la components/
```

All set! Enjoy building beautiful resumes! 🌸

---

**Time to First View**: ~2-3 minutes (including npm install)
**First Impression**: Stunning cherry blossom animations ✨
