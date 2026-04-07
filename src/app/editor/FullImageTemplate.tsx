'use client';

import React from 'react';
import { Logo } from '@/components/Logo';

export interface FullImageData {
  image: string;
}

interface FullImageProps {
  data: FullImageData;
}

export const FullImageSlide: React.FC<FullImageProps> = ({ data }) => {
  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#002864] overflow-hidden flex flex-col p-10 font-sans">
      {/* MAIN IMAGE CONTAINER - No radius or shadow as requested */}
      <div className="relative flex-1 w-full overflow-hidden bg-gray-900/10">
        <img 
          src={data.image} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Gallery Image"
        />
      </div>

      {/* FOOTER LOGO */}
      <div className="absolute bottom-[40px] left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="font-serif text-[#F3F3F3] text-[52px] opacity-20 uppercase tracking-[0.2em] leading-none">
          FOR YOU
        </div>
      </div>
    </div>
  );
};
