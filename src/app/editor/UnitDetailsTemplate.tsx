'use client';

import React from 'react';
import { Logo } from '@/components/Logo';

export interface UnitDetailsData {
  title: string;
  image: string;
  specs: {
    label: string;
    value: string;
  }[];
}

interface UnitDetailsProps {
  data: UnitDetailsData;
}

export const UnitPlan: React.FC<UnitDetailsProps> = ({ data }) => {
  return (
    <div 
      className="relative w-[1920px] h-[1080px] overflow-hidden flex flex-col font-sans"
      style={{
        background: 'linear-gradient(180deg, #002864 30.5%, #144A9C 100%)'
      }}
    >
      {/* BACKGROUND SVG DECORATIONS - RICH LAYERING */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* LEFT SIDE LAYERS */}
        <img 
          src="/unit_bg_decoration.svg" 
          className="absolute -left-[15%] -top-[10%] h-[120%] w-auto object-contain opacity-30 rotate-[-18deg] scale-[1.6] origin-center" 
          alt="" 
        />
        <img 
          src="/unit_bg_decoration.svg" 
          className="absolute -left-[5%] top-[10%] h-[100%] w-auto object-contain opacity-20 rotate-[-5deg] scale-[1.4] origin-center" 
          alt="" 
        />
        
        {/* RIGHT SIDE LAYERS */}
        <img 
          src="/unit_bg_decoration.svg" 
          className="absolute -right-[15%] -top-[10%] h-[120%] w-auto object-contain opacity-30 scale-x-[-1] rotate-[18deg] scale-[1.6] origin-center" 
          alt="" 
        />
        <img 
          src="/unit_bg_decoration.svg" 
          className="absolute -right-[5%] top-[10%] h-[100%] w-auto object-contain opacity-20 scale-x-[-1] rotate-[5deg] scale-[1.4] origin-center" 
          alt="" 
        />
      </div>

      {/* HEADER - Centered */}
      <div className="relative z-10 pt-[85px] flex justify-center w-full">
        <h2 className="font-serif text-[#F3F3F3] tracking-[0.12em] uppercase leading-tight" style={{
          fontSize: '78px',
          fontWeight: 400
        }}>
          {data.title}
        </h2>
      </div>

      {/* MAIN WHITE CARD - Horizontal Widescreen */}
      <div className="relative z-10 flex-none w-[1240px] h-[680px] mx-auto mt-[45px] bg-white rounded-[40px] flex flex-col p-14 overflow-hidden shadow-[0_45px_120px_rgba(0,0,0,0.45)]">
        {/* IMAGE CONTAINER */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          <img 
              src={data.image} 
              className="max-w-[78%] max-h-[85%] object-contain filter drop-shadow-lg" 
              alt="Unit Plan"
          />
        </div>

        {/* SPECS FOOTER INSIDE CARD */}
        <div className="w-full flex justify-between pt-12 border-t border-[#F3F4F6] mt-auto">
            {data.specs.map((spec, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                    <span className="text-[#9CA3AF] text-[15px] font-bold tracking-[0.1em] uppercase mb-3">{spec.label}</span>
                    <span className="text-[#002864] text-[18px] font-bold">
                      {spec.value.toLowerCase().includes('sq') ? spec.value : `${spec.value} sq. ft`}
                    </span>
                </div>
            ))}
        </div>
      </div>

      {/* FOOTER - Centered Logo */}
      <div className="relative z-10 flex justify-center w-full mt-auto pb-[65px]">
        <Logo color="#F3F3F3" className="w-[190px] h-auto opacity-100" />
      </div>
    </div>
  );
};
