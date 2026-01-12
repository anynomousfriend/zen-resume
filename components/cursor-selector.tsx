"use client"

import { useState, useRef, useEffect } from 'react';
import { Paintbrush, ChevronDown } from 'lucide-react';
import { CursorEffect } from './ink-cursor';

interface CursorSelectorProps {
  currentEffect: CursorEffect;
  onEffectChange: (effect: CursorEffect) => void;
}

const effects: { value: CursorEffect; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'No cursor effect' },
  { value: 'brush', label: 'Brush Stroke', description: 'Traditional calligraphy' },
  { value: 'splash', label: 'Ink Splash', description: 'Splatter drops' },
  { value: 'water', label: 'Water Ink', description: 'Sumi-e dispersion' },
  { value: 'smoke', label: 'Smoke Trail', description: 'Ethereal mist' },
];

export function CursorSelector({ currentEffect, onEffectChange }: CursorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = effects.find(e => e.value === currentEffect)?.label || 'None';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-sumi/60 hover:text-sumi transition-colors"
        aria-label="Select cursor effect"
      >
        <Paintbrush className="w-4 h-4" />
        <span className="hidden md:inline text-xs">{currentLabel}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-sumi/10 shadow-lg z-50">
          {effects.map((effect) => (
            <button
              key={effect.value}
              onClick={() => {
                onEffectChange(effect.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-washi transition-colors ${
                currentEffect === effect.value ? 'bg-washi/50' : ''
              }`}
            >
              <div className="font-medium text-sm text-sumi">{effect.label}</div>
              <div className="text-xs text-sumi/60 mt-1">{effect.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
