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

      {/* FOOTER */}
      <div className="relative z-10 pt-[30px] pb-[10px] flex justify-center w-full">
        <Logo color="#F3F3F3" className="w-[180px] h-auto opacity-100" />
      </div>
    </div>
  );
};
