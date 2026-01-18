"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { InkCursor, CursorEffect } from '@/components/ink-cursor';
import { CursorSelector } from '@/components/cursor-selector';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [cursorEffect, setCursorEffect] = useState<CursorEffect>('none');

  useEffect(() => {
    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    // Navbar scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Canvas ink animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      maxRadius: number;
      minRadius: number;
      growing: boolean;
      color: string;
      
      update: () => void;
      draw: () => void;
    }

    const particles: Particle[] = [];
    const colors = ['rgba(47, 54, 64, 0.08)', 'rgba(188, 63, 60, 0.05)', 'rgba(200, 200, 200, 0.05)'];
    
    const particleCount = window.innerWidth < 768 ? 5 : 10;
    
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 150 + 100;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: radius,
        maxRadius: radius * 1.5,
        minRadius: radius * 0.8,
        growing: Math.random() > 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        
        update: function() {
          this.x += this.vx;
          this.y += this.vy;
          
          if (this.x < -this.radius || this.x > width + this.radius) this.vx *= -1;
          if (this.y < -this.radius || this.y > height + this.radius) this.vy *= -1;
          
          if (this.growing) {
            this.radius += 0.2;
            if (this.radius > this.maxRadius) this.growing = false;
          } else {
            this.radius -= 0.2;
            if (this.radius < this.minRadius) this.growing = true;
          }
        },
        
        draw: function() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'multiply';
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="min-h-screen bg-washi overflow-x-hidden">
      {/* Ink Cursor Effect */}
      <InkCursor effect={cursorEffect} />
      
      {/* Texture Overlays */}
      <div className="noise-overlay" />
      <div className="paper-wash" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-6 bg-washi/90 backdrop-blur-md' 
          : 'py-12 bg-gradient-to-b from-washi/95 to-transparent'
      }`}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo-02.png" 
                alt="ZenResume Logo" 
                width={80}
                height={80}
                className="h-16 md:h-20 w-auto"
                priority
              />
            </Link>
            
            <ul className="hidden md:flex gap-12">
              <li><a href="#philosophy" className="text-sm uppercase tracking-widest text-sumi hover:text-vermilion transition-colors relative group">
                Philosophy
                <span className="absolute bottom-0 left-0 w-full h-px bg-vermilion scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left" />
              </a></li>
              <li><a href="#templates" className="text-sm uppercase tracking-widest text-sumi hover:text-vermilion transition-colors relative group">
                Templates
                <span className="absolute bottom-0 left-0 w-full h-px bg-vermilion scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left" />
              </a></li>
              <li><a href="#pricing" className="text-sm uppercase tracking-widest text-sumi hover:text-vermilion transition-colors relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-full h-px bg-vermilion scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left" />
              </a></li>
            </ul>
            
            <div className="flex items-center space-x-4">
              <CursorSelector currentEffect={cursorEffect} onEffectChange={setCursorEffect} />
              
              <Link href="/builder">
                <Button className="relative h-14 px-8 text-sm uppercase tracking-widest font-semibold bg-transparent text-sumi border border-sumi overflow-hidden group">
                  <span className="relative z-10 group-hover:text-washi transition-colors duration-300">Get Started</span>
                  <span className="absolute inset-0 bg-sumi scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 md:pt-20 overflow-hidden">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-multiply z-0" />
        
        {/* Geometric Shapes - Hidden on mobile */}
        <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full pointer-events-none z-10">
          <div className="absolute w-[600px] h-[600px] border-2 border-sumi rounded-full opacity-80 animate-rotate-enso" style={{ top: '10%', right: '-10%' }} />
          <div className="absolute w-[400px] h-[400px] border-4 border-vermilion rounded-full opacity-50 animate-rotate-enso" style={{ top: '40%', right: '20%', borderRightColor: 'transparent' }} />
        </div>

        <div className="container mx-auto px-6 md:px-6 max-w-7xl relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-0 items-center">
            {/* Vertical Text - Hidden on mobile */}
            <div className="hidden md:flex items-start justify-end pr-12">
              <div className="relative">
                <div className="vertical-text text-sm tracking-[0.3em] text-indigo/60 font-light" style={{ letterSpacing: '0.5em' }}>
                  <span className="inline-block">S</span>
                  <span className="inline-block">I</span>
                  <span className="inline-block">M</span>
                  <span className="inline-block">P</span>
                  <span className="inline-block">L</span>
                  <span className="inline-block">I</span>
                  <span className="inline-block">C</span>
                  <span className="inline-block">I</span>
                  <span className="inline-block">T</span>
                  <span className="inline-block">Y</span>
                </div>
                <div className="absolute right-0 top-0 h-full w-px bg-vermilion" style={{ right: '-1rem' }}></div>
              </div>
            </div>
            
            {/* Hero Content */}
            <div className="mix-blend-multiply py-12 md:py-0">
              <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-indigo leading-[0.9] md:leading-[0.85] mb-6 md:mb-8 reveal-up opacity-0 stagger-1" style={{ letterSpacing: '-0.03em' }}>
                Create your <br />
                <span className="italic text-vermilion font-serif">Next opportunity</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-lg font-light border-l-2 border-vermilion pl-4 md:pl-8 reveal-up opacity-0 stagger-2 text-sumi/70">
                In a world of noise, find your signal.
              </p>
              
              <div className="reveal-up opacity-0 stagger-3">
                <Link href="/builder">
                  <Button className="relative h-12 md:h-16 px-8 md:px-12 text-xs md:text-sm uppercase tracking-widest font-semibold bg-transparent text-sumi border border-sumi overflow-hidden group">
                    <span className="relative z-10 group-hover:text-washi transition-colors duration-300">Start your journey</span>
                    <span className="absolute inset-0 bg-sumi scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </Button>
                </Link>
              </div>
              
              {/* Decorative Stamp - Hidden on mobile */}
              <div className="hidden md:flex absolute bottom-20 left-0 w-20 h-20 border-3 border-vermilion text-vermilion items-center justify-center font-serif font-bold transform -rotate-15 opacity-80 mix-blend-multiply">
                合格
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="relative py-32 px-6 bg-white overflow-hidden">
        {/* Large Background Character */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[40vw] text-black/[0.03] pointer-events-none select-none z-0">
          和
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-12 gap-8">
            {/* Philosophy Intro */}
            <div className="col-span-12 md:col-span-5 mb-24 reveal-up opacity-0">
              <span className="text-xs uppercase tracking-[0.2em] text-vermilion font-bold mb-6 block">The Philosophy</span>
              <h2 className="font-serif text-6xl md:text-7xl text-indigo mb-8">The Art of <br />Empty Space</h2>
              <p className="text-lg leading-relaxed text-gray-700">
                In Japanese aesthetics, <strong>Ma</strong> (間) is the &ldquo;negative space&rdquo; or interval. We apply this principle to resume design, ensuring your achievements breathe and stand out without clutter.
              </p>
            </div>

            {/* Card 1 - Large Vertical Card */}
            <div className="col-span-12 md:col-span-7 md:row-span-2 reveal-up opacity-0">
              <div className="relative h-full min-h-[600px] p-16 bg-washi border border-black/5 zen-card-hover flex flex-col justify-between overflow-hidden">
                <div className="absolute -bottom-5 -right-2 font-serif text-[8rem] text-black/[0.03] pointer-events-none transition-all duration-500">01</div>
                <div>
                  <span className="font-serif text-5xl text-vermilion mb-4 inline-block">01</span>
                  <h3 className="font-serif text-4xl md:text-5xl text-indigo mb-6">Simplicity (Kanso)</h3>
                  <p className="text-xl leading-relaxed text-gray-600">
                    Eliminate the non-essential. Our layouts are stripped of distraction, focusing purely on the value you provide. No over-styled graphics, just elegant typography.
                  </p>
                </div>
                <div className="w-full h-px bg-black/10 mt-8" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-span-12 md:col-span-5 reveal-up opacity-0 stagger-1">
              <div className="relative p-16 bg-washi border border-black/5 zen-card-hover overflow-hidden">
                <div className="absolute -bottom-5 -right-2 font-serif text-[8rem] text-black/[0.03] pointer-events-none transition-all duration-500">02</div>
                <span className="font-serif text-5xl text-vermilion mb-4 inline-block">02</span>
                <h3 className="font-serif text-4xl text-indigo mb-6">Nature (Shizen)</h3>
                <p className="text-xl leading-relaxed text-gray-600">
                  Organic balance. We use grid systems that mimic natural proportions, ensuring your career path feels fluid rather than rigid.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-span-12 md:col-span-5 reveal-up opacity-0 stagger-2">
              <div className="relative p-16 bg-washi border border-black/5 zen-card-hover overflow-hidden">
                <div className="absolute -bottom-5 -right-2 font-serif text-[8rem] text-black/[0.03] pointer-events-none transition-all duration-500">03</div>
                <span className="font-serif text-5xl text-vermilion mb-4 inline-block">03</span>
                <h3 className="font-serif text-4xl text-indigo mb-6">Stillness (Seijaku)</h3>
                <p className="text-xl leading-relaxed text-gray-600">
                  Calm the reader. A chaotic resume creates anxiety. A structured, spacious resume creates confidence and trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-32 px-6 bg-indigo text-washi overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute w-[300px] h-[300px] rounded-full animate-pulse-blob" style={{ 
          top: '20%', 
          left: '10%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
        }} />
        <div className="absolute w-[400px] h-[400px] rounded-full animate-pulse-blob" style={{ 
          bottom: '-100px', 
          right: '-50px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animationDelay: '2s'
        }} />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center reveal-up opacity-0">
            <p className="font-serif text-4xl md:text-5xl lg:text-6xl italic leading-tight mb-8">
              &ldquo;The obstacle is the path.&rdquo;
            </p>
            <span className="inline-block text-xs uppercase tracking-[0.3em] mt-8 border-t border-white/30 pt-4">
              — Zen Proverb
            </span>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="relative py-32 px-6 bg-washi">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-20 reveal-up opacity-0">
            <span className="text-xs uppercase tracking-[0.2em] text-vermilion font-bold mb-6 block">The Collection</span>
            <h2 className="font-serif text-6xl md:text-7xl text-indigo mb-6">Curated Harmony</h2>
            <p className="text-xl text-gray-700">Designed for impact. Built for ATS systems. Aesthetically pleasing for humans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Template 1 - Clean Professional (Current) */}
            <div className="relative h-[600px] bg-white border-2 border-sumi/10 overflow-hidden group reveal-up opacity-0">
              <Image 
                src="/resume-template-clean.png" 
                alt="Clean Professional Resume Template" 
                width={400}
                height={600}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h4 className="font-serif text-3xl text-white mb-2">Clean Professional</h4>
                <p className="text-white/80">Minimalist. ATS-friendly. Available now.</p>
              </div>
            </div>

            {/* Template 2 - Coming Soon */}
            <div className="relative h-[600px] bg-gray-100 border-2 border-dashed border-sumi/20 overflow-hidden group reveal-up opacity-0 stagger-1 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="font-serif text-8xl text-sumi/10 mb-4">禅</div>
                <h4 className="font-serif text-3xl text-indigo mb-3">The Void</h4>
                <p className="text-sumi/60 mb-4">Maximum negative space. For executives.</p>
                <span className="inline-block px-6 py-2 bg-sumi/5 text-sumi/50 text-sm uppercase tracking-wider rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>

            {/* Template 3 - Coming Soon */}
            <div className="relative h-[600px] bg-gray-100 border-2 border-dashed border-sumi/20 overflow-hidden group reveal-up opacity-0 stagger-2 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="font-serif text-8xl text-sumi/10 mb-4">侘</div>
                <h4 className="font-serif text-3xl text-indigo mb-3">Wabi-Sabi</h4>
                <p className="text-sumi/60 mb-4">Perfectly imperfect. For creatives.</p>
                <span className="inline-block px-6 py-2 bg-sumi/5 text-sumi/50 text-sm uppercase tracking-wider rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 reveal-up opacity-0">
            <span className="text-xs uppercase tracking-[0.2em] text-vermilion font-bold mb-6 block">Pricing</span>
            <h2 className="font-serif text-6xl md:text-7xl text-indigo mb-6">Simple & Honest</h2>
            <p className="text-xl text-gray-700">No hidden costs. No subscriptions. Just build your resume.</p>
          </div>

          <div className="max-w-2xl mx-auto reveal-up opacity-0">
            <div className="relative p-16 bg-washi border-2 border-sumi/10 text-center overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[20rem] text-black/[0.02] pointer-events-none select-none">
                無
              </div>
              
              <div className="relative z-10">
                <div className="font-serif text-8xl text-indigo mb-6">Free</div>
                <div className="text-2xl text-sumi/70 mb-8">Forever</div>
                
                <div className="space-y-4 mb-12 text-left max-w-md mx-auto">
                  <div className="flex items-start space-x-3">
                    <span className="text-vermilion text-xl">✓</span>
                    <span className="text-lg text-sumi/80">Unlimited resumes</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-vermilion text-xl">✓</span>
                    <span className="text-lg text-sumi/80">Export as PDF & LaTeX</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-vermilion text-xl">✓</span>
                    <span className="text-lg text-sumi/80">ATS-friendly templates</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-vermilion text-xl">✓</span>
                    <span className="text-lg text-sumi/80">No watermarks</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-vermilion text-xl">✓</span>
                    <span className="text-lg text-sumi/80">No credit card required</span>
                  </div>
                </div>

                <Link href="/builder">
                  <Button className="relative h-16 px-12 text-sm uppercase tracking-widest font-semibold bg-transparent text-sumi border border-sumi overflow-hidden group">
                    <span className="relative z-10 group-hover:text-washi transition-colors duration-300">Start Building Free</span>
                    <span className="absolute inset-0 bg-sumi scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </Button>
                </Link>

                <p className="mt-8 text-sm text-sumi/50 italic">
                  Built with 💜 for job seekers worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 bg-sumi text-white/50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="relative font-serif text-3xl font-black text-white mb-4">
                ZenResume.
                <span className="absolute -top-2 -right-4 text-sm text-vermilion">禅</span>
              </div>
              <p className="text-white/70">Designed with mindful intention.</p>
            </div>
            
            <div className="flex gap-12">
              <a href="#" className="text-white/50 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-white/50 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-white/50 hover:text-white transition-colors">Email</a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-white/40 text-xs">
            &copy; 2023 ZenResume Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
