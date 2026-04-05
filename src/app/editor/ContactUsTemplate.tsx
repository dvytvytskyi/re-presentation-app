'use client';

import React from 'react';
import { Logo } from '@/components/Logo';

export interface ContactUsData {
  title: string;
  locations: {
    address: string;
    image: string;
    link?: string;
  }[];
  websiteLabel: string;
  websiteUrl: string;
  qrCode: string;
  qrLink?: string;
}

interface ContactUsProps {
  data: ContactUsData;
}

export const ContactUs: React.FC<ContactUsProps> = ({ data }) => {
  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#002864] flex flex-col items-center overflow-hidden shrink-0 font-sans">
      {/* Background Layer (Matching Slide 4) */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 z-10"
          style={{ 
            background: 'linear-gradient(180deg, #002864 30.5%, #144A9C 100%)',
            opacity: 0.95
          }} 
        />
        <img 
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2070&auto=format&fit=crop" 
          alt="bg" 
          className="w-full h-full object-cover scale-110"
        />
      </div>

      {/* HEADER */}
      <div className="relative z-10 pt-[100px] flex justify-center w-full">
        <h2 className="font-serif text-[#F3F3F3] tracking-[0.12em] uppercase leading-tight" style={{
          fontSize: '81px',
          fontWeight: 400
        }}>
          {data.title}
        </h2>
      </div>

      {/* MAPS SECTION */}
      <div className="relative z-10 mt-[100px] px-[160px] flex justify-between gap-[60px]">
        {data.locations.map((loc, idx) => (
          <div key={idx} className="flex-1 flex flex-col gap-8">
            <a 
              href={loc.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full h-[320px] bg-white rounded-[25px] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.3)] group hover:scale-[1.03] transition-all duration-500 cursor-pointer block border-[4px] border-white/0 hover:border-white/40"
            >
              <img src={loc.image} className="w-full h-full object-cover" alt="Location Map" />
            </a>
            <p className="text-[#F3F3F3] text-center text-[22px] font-medium leading-relaxed px-4 opacity-90 tracking-wide">
              {loc.address}
            </p>
          </div>
        ))}
      </div>

      {/* QR & LINKS SECTION */}
      <div className="relative z-10 mt-auto mb-[160px] flex flex-col items-center w-full">
        <div className="flex items-end justify-center gap-[60px] w-full">
          <div className="flex-1 flex justify-end pb-2">
            <span className="text-[#F3F3F3] text-[24px] font-light tracking-[0.25em] uppercase opacity-70 text-right">
              {data.websiteLabel}
            </span>
          </div>
          
          <a 
            href={data.qrLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-[120px] h-[120px] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shrink-0"
          >
            <img src={data.qrCode} className="w-full h-full object-contain" alt="QR Code" />
          </a>

          <div className="flex-1 flex justify-start pb-2">
            <span className="text-[#F3F3F3] text-[24px] font-light tracking-[0.25em] uppercase opacity-70">
              {data.websiteUrl}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER - Matching Slide 4 style */}
      <div className="absolute bottom-[40px] left-0 right-0 flex justify-center z-10">
        <div className="font-serif text-[#F3F3F3] text-[52px] opacity-20 uppercase tracking-[0.2em] leading-none">
          FOR YOU
        </div>
      </div>
    </div>
  );
};
