'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-navy flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg fill="none" viewBox="0 0 400 400" className="w-[150%] h-[150%] absolute -top-1/4 -left-1/4 rotate-12">
          <path d="M0 100 Q 100 50, 200 100 T 400 100" stroke="white" strokeWidth="1" />
          <path d="M0 150 Q 100 100, 200 150 T 400 150" stroke="white" strokeWidth="1" />
          <path d="M0 200 Q 100 150, 200 200 T 400 200" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 flex flex-col items-center"
      >
        <Logo className="w-64 md:w-80 h-auto mb-12" color="#C5A059" />
        <h1 className="text-4xl md:text-6xl font-serif mb-12">Presentations Generator</h1>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link href="/editor" className="px-16 py-5 bg-brand-gold text-brand-navy font-sans font-black hover:bg-white hover:scale-105 active:scale-95 transition-all rounded-sm uppercase tracking-[0.2em] text-sm shadow-2xl shadow-brand-gold/20">
            Open Editor
          </Link>
          <div className="flex flex-col gap-4">
            <Link href="/dashboard" className="px-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-sans font-bold hover:bg-white hover:text-brand-navy hover:scale-105 active:scale-95 transition-all rounded-sm uppercase tracking-[0.2em] text-xs text-center">
              Go to Dashboard
            </Link>
            <div className="flex gap-4">
              <Link href="/design-code" className="px-8 py-3 border border-white/30 text-white/70 font-sans hover:bg-white hover:text-brand-navy transition-all rounded-sm uppercase tracking-widest text-[10px]">
                Design Code
              </Link>
              <Link href="/presentation/demo" className="px-8 py-3 border border-white/30 text-white/70 font-sans hover:bg-white hover:text-brand-navy transition-all rounded-sm uppercase tracking-widest text-[10px]">
                Mock Demo
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-10 text-brand-gold/50 font-sans text-xs tracking-widest">
        PREMIUM REAL ESTATE SOLUTIONS
      </div>
    </main>
  );
}
