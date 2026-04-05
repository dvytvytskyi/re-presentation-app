'use client';

import { motion } from 'framer-motion';

export interface AdvantageItem {
  title: string;
  description: string;
  image: string;
}

export interface ProjectAdvantagesData {
  advantages: AdvantageItem[];
}

export function ProjectAdvantages({ data }: { data: ProjectAdvantagesData }) {
  // Default data fallback if data is missing or empty
  const items = (data?.advantages && data.advantages.length > 0) ? data.advantages : [
    {
      title: "GARDENS & WALKING AREAS",
      description: "Landscaped gardens, open lounge areas, and a rooftop oasis with panoramic views",
      image: "https://images.unsplash.com/photo-1512918766427-d40f1d044234?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "POOL & LEISURE AREAS",
      description: "Swimming pool with lounge zones, BBQ areas, and open-air dining spaces",
      image: "https://api.reelly.io/vault/ZZLvFZFt/Cmq-jOXP6-6x4IWQd-bgaNVA6jg/KH99KQ../25.webp"
    },
    {
      title: "SPORTS & WELLNESS",
      description: "Modern fitness center, yoga studio, padel court, and basketball court",
      image: "https://images.unsplash.com/photo-1540497077202-3c1807336674?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div style={{ width: '1920px', height: '1080px' }} className="bg-[#002864] flex flex-col items-center relative overflow-hidden shrink-0">
      {/* Background Layer: Gradient + Subtle Building Image */}
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
      <div className="relative z-10 pt-[100px] mb-[60px] text-center">
        <h2 className="font-serif text-[#F3F3F3] tracking-[0.12em] uppercase leading-tight" style={{
          fontSize: '81px',
          fontWeight: 400
        }}>
          Project Advantages
        </h2>
      </div>

      {/* ADVANTAGES GRID - Fixed width columns to prevent layout shifts */}
      <div 
        className="relative z-10 w-full px-[110px] grid gap-[40px] items-stretch justify-center"
        style={{ 
          gridTemplateColumns: items.length === 3 ? 'repeat(3, 530px)' : items.length === 2 ? 'repeat(2, 650px)' : `repeat(${items.length}, 530px)`,
          justifyContent: 'center'
        }}
      >
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            {/* Image Box - Smaller height as requested */}
            <div 
              style={{
                height: '340px',
                marginBottom: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              className="w-full rounded-[20px] overflow-hidden shadow-2xl relative"
            >
              <img 
                src={item.image} 
                className="w-full h-full object-cover" 
                alt={item.title}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content Box - Perfectly aligned width */}
            <div 
              style={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                minHeight: '300px'
              }}
              className="flex-1 rounded-[20px] border-[1.5px] px-8 py-10 flex flex-col items-center text-center justify-center gap-6 bg-[#002864]/40 backdrop-blur-md shadow-xl overflow-hidden"
            >
              <h3 className="text-[#F3F3F3] font-sans uppercase tracking-[0.05em] break-words w-full line-clamp-2" style={{
                fontSize: '30px',
                fontWeight: 'bold'
              }}>
                {item.title}
              </h3>
              <p className="text-[#F3F3F3] font-sans opacity-80 leading-[1.35] max-w-full whitespace-pre-wrap break-words" style={{
                fontSize: '22px',
                fontWeight: 400
              }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER LOGO */}
      <div className="absolute bottom-[35px] left-0 right-0 flex justify-center z-10">
        <div className="font-serif text-[#F3F3F3] text-[52px] opacity-20 uppercase tracking-[0.2em] leading-none">
          FOR YOU
        </div>
      </div>
    </div>
  );
}
