'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';

export default function DesignCodePage() {
  const colors = [
    { name: 'Navy Blue', hex: '#001B3D', variable: 'bg-brand-navy', text: 'text-white' },
    { name: 'Royal Blue', hex: '#0047AB', variable: 'bg-brand-blue', text: 'text-white' },
    { name: 'Azure', hex: '#0096FF', variable: 'bg-brand-azure', text: 'text-white' },
    { name: 'Gold', hex: '#C5A059', variable: 'bg-brand-gold', text: 'text-white' },
    { name: 'White', hex: '#FFFFFF', variable: 'bg-white', border: 'border border-gray-200', text: 'text-brand-navy' },
    { name: 'Light Gray', hex: '#F5F5F7', variable: 'bg-brand-gray', text: 'text-brand-navy' },
  ];

  return (
    <div className="min-h-screen bg-white p-8 md:p-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-16"
      >
        {/* Header */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-brand-gray pb-8 gap-6">
          <div>
            <p className="text-brand-gold font-serif text-xl mb-2 italic tracking-widest">Official Branding</p>
            <h1 className="text-5xl font-serif text-brand-navy">Design Code System</h1>
          </div>
          <Logo className="w-48 h-auto" color="#001B3D" />
        </section>

        {/* Typography */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-widest text-brand-gold mb-6 font-sans">Typography — Serif</h2>
            <p className="font-serif text-7xl text-brand-navy leading-none">Cormorant Garamond</p>
            <p className="font-serif text-2xl text-brand-navy opacity-80">
              Used for titles, logos and luxury accents. It brings an air of sophistication and heritage to the brand.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-widest text-brand-gold mb-6 font-sans">Typography — Sans</h2>
            <p className="font-sans font-bold text-7xl text-brand-navy leading-none">Inter</p>
            <p className="font-sans text-xl text-brand-navy opacity-80">
              Clear, modern, and highly readable. Used for descriptions, interface elements, and body text.
            </p>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h2 className="text-sm uppercase tracking-widest text-brand-gold mb-8 font-sans">Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {colors.map((color, idx) => (
              <motion.div 
                key={color.name}
                whileHover={{ y: -5 }}
                className="space-y-2"
              >
                <div className={`h-32 w-full rounded-lg ${color.variable} ${color.border || ''} shadow-sm`} />
                <p className="text-sm font-bold text-brand-navy">{color.name}</p>
                <p className="text-xs text-slate-500 uppercase">{color.hex}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Visual Assets - Logo Showcase */}
        <section>
          <h2 className="text-sm uppercase tracking-widest text-brand-gold mb-8 font-sans">Brand Logos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-navy p-12 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
               <Logo className="w-48 h-auto mb-4" color="white" />
               <p className="text-xs text-white/50 tracking-widest uppercase font-sans">White (Negative)</p>
            </div>
            
            <div className="bg-brand-gray p-12 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
              <Logo className="w-48 h-auto mb-4" color="#001B3D" />
              <p className="text-xs text-brand-navy/50 tracking-widest uppercase font-sans">Navy (Primary)</p>
            </div>

            <div className="bg-white border border-brand-gold/30 p-12 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
              <Logo className="w-48 h-auto mb-4" color="#C5A059" />
              <p className="text-xs text-brand-gold tracking-widest uppercase font-sans">Gold (Premium)</p>
            </div>
          </div>
        </section>

        {/* Assets & Patterns */}
        <section>
          <h2 className="text-sm uppercase tracking-widest text-brand-gold mb-8 font-sans">UI Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons */}
            <div className="bg-brand-gray p-12 rounded-2xl flex flex-col items-center justify-center gap-4">
              <div className="w-full flex flex-col gap-3">
                <button className="w-full bg-brand-navy text-white font-sans py-3 rounded-md hover:bg-brand-blue transition-all">
                  Primary Button
                </button>
                <button className="w-full border border-brand-navy text-brand-navy font-sans py-3 rounded-md hover:bg-brand-navy hover:text-white transition-all">
                  Secondary Button
                </button>
                <button className="w-full text-brand-gold font-serif py-2 border-b border-brand-gold hover:opacity-70 text-center">
                  Classic Serif Link
                </button>
              </div>
            </div>

            {/* Icon Style */}
            <div className="border border-brand-gray p-12 rounded-2xl flex items-center justify-center gap-12">
               <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 bg-brand-gold/10 flex items-center justify-center text-brand-gold rounded-full italic font-serif text-3xl">i</div>
                 <span className="text-[10px] uppercase tracking-tighter text-slate-400">Icon Label</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 bg-brand-navy flex items-center justify-center text-brand-white rounded-full font-serif text-3xl">F</div>
                 <span className="text-[10px] uppercase tracking-tighter text-slate-400">Accent</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 bg-brand-azure flex items-center justify-center text-brand-white rounded-full font-serif text-3xl">Y</div>
                 <span className="text-[10px] uppercase tracking-tighter text-slate-400">Accent</span>
               </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
