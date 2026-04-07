'use client';

import { motion } from 'framer-motion';
import { MapPin, Plane, Building2, ShoppingBag, Landmark, FerrisWheel } from 'lucide-react';

export interface Pin {
  label: string;
  x: number; // percentage from left
  y: number; // percentage from top
  type?: 'airport' | 'landmark' | 'mall' | 'museum' | 'wheel' | 'main';
}

export interface AreaDetailsData {
  projectName: string;
  description: string;
  points: string[];
  distances: { label: string; time: string }[];
  mapImage: string;
  pins: Pin[];
}

const IconMap = {
  airport: Plane,
  landmark: Building2,
  mall: ShoppingBag,
  museum: Landmark,
  wheel: FerrisWheel,
  main: MapPin,
};

export function AreaDetails({ 
  data, 
  onMapClick 
}: { 
  data: AreaDetailsData, 
  onMapClick?: (x: number, y: number) => void 
}) {
  const commonTextStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '24px',
    background: 'linear-gradient(95deg, #FFF 47.33%, #EDEDED 70%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const descriptionStyle = {
    ...commonTextStyle,
    fontWeight: 700,
    lineHeight: '1.3',
  };

  const pointStyle = {
    ...commonTextStyle,
    fontWeight: 500,
    lineHeight: 'normal',
  };

  return (
    <div style={{ width: '1920px', height: '1080px' }} className="bg-white flex overflow-hidden relative shrink-0 font-sans tracking-tight focus:outline-none">
      
      {/* 1. BLUE CIRCLE */}
      <div 
        className="absolute"
        style={{ 
          width: '1200px', 
          height: '1200px', 
          borderRadius: '50%',
          top: '380px',
          left: '-305px',
          background: 'linear-gradient(180deg, #002864 30.5%, #144A9C 100%)',
          transform: 'rotate(77.78deg)',
          zIndex: 1
        }}
      />

      {/* 2. LEFT SIDE CONTENT */}
      <div style={{ width: '960px' }} className="h-full relative shrink-0 z-10">
        
        {/* Title area (On white) */}
        <div className="absolute top-[100px] left-[110px]">
          <h1 
              className="text-[#002864] font-serif uppercase tracking-tight font-normal whitespace-pre-wrap" 
              style={{ 
                  fontSize: '74px', 
                  lineHeight: '1.05',
                  maxWidth: '900px' // Increased to ensure 2 lines with moderate projectName lengths
              }}
          >
              Where is {data.projectName} Located?
          </h1>
        </div>

        {/* Text area - ABSOLUTE positioning to ensure it stays inside blue and is shifted lower */}
        <div 
          className="absolute max-w-[720px] left-[110px]"
          style={{ bottom: '190px' }}
        >
           {/* Description - Bold, narrower, font +2, max 2 lines */}
           <p style={{ ...descriptionStyle, fontSize: '26px' }} className="mb-[35px] max-w-[550px] line-clamp-2 overflow-hidden break-words">
             {data.description}
           </p>

           {/* Points - Normal weight, small dots, reduced gaps */}
           <div className="space-y-[12px]">
             {data.points.map((point, i) => (
               <div key={i} className="flex items-start gap-3">
                  <span className="text-white text-[20px] leading-none mt-[6px] shrink-0 opacity-80 text-white fill-white">•</span>
                  <p style={pointStyle} className={`opacity-90 break-words ${i === 1 ? 'line-clamp-2 overflow-hidden' : ''}`}>
                    {point}
                  </p>
               </div>
             ))}
           </div>
        </div>

        {/* FOOTER LOGO */}
        <div className="absolute bottom-[40px] left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div className="font-serif text-[#F3F3F3] text-[52px] opacity-20 uppercase tracking-[0.2em] leading-none">
            FOR YOU
          </div>
        </div>
      </div>

      {/* 3. RIGHT SIDE: MAP & LEGEND */}
      <div 
        style={{ width: '960px' }} 
        className={`h-full relative shrink-0 ${onMapClick ? 'cursor-crosshair' : ''}`}
        onClick={(e) => {
          if (!onMapClick) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          onMapClick(x, y);
        }}
      >
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <img 
            src={data.mapImage || "/map_bg.png"} 
            className="w-full h-full object-cover" 
            alt="Map" 
          />
        </div>

        {/* Legend Box */}
        <div 
          className="absolute top-[60px] left-[60px] p-[30px] rounded-[20px] shadow-2xl z-20"
          style={{ 
            background: 'linear-gradient(180deg, #002864 30.5%, #144A9C 100%)',
            minWidth: '350px' 
          }}
        >
           <div className="space-y-[10px]">
             {data.distances.map((item, i) => (
               <div key={i} className="flex items-center text-white gap-4">
                  <div className="w-[70px] font-sans font-bold text-[18px] text-right">{item.time}</div>
                  <div className="font-sans font-bold text-[18px] opacity-60">—</div>
                  <div className="flex-1 font-sans font-medium text-[18px] opacity-90 truncate">{item.label}</div>
               </div>
             ))}
           </div>
        </div>

        {/* Map Pins - Enabled for interactive project marker placement */}
        {data.pins.map((pin, i) => {
          const Icon = IconMap[pin.type || 'landmark'] || MapPin;
          const isMain = pin.type === 'main';
          
          return (
            <div 
              key={i} 
              className="absolute flex flex-col items-center z-30"
              style={{ 
                left: `${pin.x}%`, 
                top: `${pin.y}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="bg-white/95 px-[14px] py-[6px] border-[1.5px] border-[#002864] rounded-[3px] shadow-lg mb-[10px] backdrop-blur-sm">
                 <span className="text-[#002864] font-bold text-[12px] uppercase tracking-wider whitespace-nowrap px-1">
                   {pin.label || data.projectName}
                 </span>
              </div>
              <div className="w-[1.5px] h-[35px] bg-[#002864]" />
              <div className={`
                ${isMain || true ? 'w-[58px] h-[58px] bg-[#002864] text-white' : 'w-[52px] h-[52px] bg-white text-[#002864]'} 
                rounded-full border-[3.5px] border-[#002864] flex items-center justify-center shadow-xl
              `}>
                 <Icon size={28} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
