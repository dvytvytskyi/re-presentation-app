'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface PropertyOfferData {
  title: string;
  developer: string;
  location: string;
  initialPayment: string;
  roi: string;
  price: string;
  image: string;
  specs: { label: string; value: string }[];
  features: string[];
}

export function PropertyOffer({ data }: { data: PropertyOfferData }) {
  return (
    <div style={{ width: '1920px', height: '1080px' }} className="bg-white flex overflow-hidden relative shrink-0">
      {/* Left Side: Image & Badges */}
      <div style={{ width: '960px' }} className="relative h-full bg-[#F3F3F3] shrink-0">
        <img 
          src={data.image} 
          alt={data.title}
          className="w-full h-full object-cover"
        />
        
        {/* Initial Payment Badge */}
        <motion.div 
          style={{
            width: '464.367px',
            height: '52px',
            borderRadius: '69.954px',
            background: 'linear-gradient(90deg, #144A9C 31.38%, #002864 89.16%)'
          }}
          className="absolute top-10 left-6 flex items-center justify-center shadow-lg"
        >
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '26.659px',
            fontWeight: 700,
            background: 'linear-gradient(72deg, #FFF 62.06%, #EDEDED 91.14%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Initial Payment: {data.initialPayment} AED
          </span>
        </motion.div>

        {/* ROI Badge */}
        <motion.div className="absolute bottom-10 left-6 shadow-lg">
          <div className="relative" style={{ width: '307.882px', height: '80.509px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="308" height="81" viewBox="0 0 308 81" fill="none">
              <path d="M0 9.80768C0 4.39104 4.39105 0 9.8077 0H298.075C303.491 0 307.882 4.39105 307.882 9.8077V70.7018C307.882 76.1184 303.491 80.5095 298.075 80.5095H9.80772C4.39108 80.5095 0 76.1184 0 70.7018V9.80768Z" fill="url(#paint0_linear_2461_200)"/>
              <defs>
                <linearGradient id="paint0_linear_2461_200" x1="-50.4699" y1="-72.6729" x2="327.024" y2="-11.2408" gradientUnits="userSpaceOnUse">
                  <stop offset="0.182871" stopColor="#A0C6FF"/>
                  <stop offset="1" stopColor="#E1EDFF"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-sans)' }} className="text-[#003077]">
                ROI ≈ {data.roi} %
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Info Block */}
      <div 
        style={{ 
          width: '960px',
          background: 'linear-gradient(180deg, #002864 30.5%, #144A9C 100%)',
          paddingLeft: '110px',
          paddingRight: '110px',
          paddingTop: '100px',
          paddingBottom: '110px'
        }}
        className="h-full flex flex-col justify-between relative overflow-hidden shrink-0"
      >
        <div className="relative z-10 w-full max-w-[800px]">
          {/* Titles */}
          <div className="mb-[42px]">
            <h1 className="text-[#F3F3F3] font-serif uppercase break-words overflow-hidden line-clamp-2" style={{
              fontSize: '86.209px',
              lineHeight: '87%',
              fontWeight: 400,
              marginBottom: '12px',
              maxWidth: '750px',
              maxHeight: '155px' // Strict 2-line limit (~75px per line + small margin)
            }}>
              {data.title}
            </h1>
            <p className="text-[#F3F3F3] font-serif uppercase opacity-90 break-words" style={{
              fontSize: '58.437px',
              lineHeight: '87%',
              fontWeight: 400,
              maxWidth: '750px'
            }}>
              {data.developer}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3" style={{ marginBottom: '51.5px' }}>
            <MapPin className="w-8 h-8 text-[#F3F3F3]" />
            <span className="font-sans font-bold text-[#F3F3F3] break-words" style={{
              fontSize: '35.633px',
              lineHeight: '110%',
              maxWidth: '700px'
            }}>
              {data.location}
            </span>
          </div>

          {/* Specs List */}
          <div className="space-y-1" style={{ marginBottom: '35px' }}>
            {data.specs.map((spec, i) => (
              <div key={i} className="flex items-start gap-4 max-w-[700px]">
                <span className="text-white text-2xl leading-none mt-1 shrink-0">•</span>
                <p className="break-words line-clamp-2" style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '24px',
                  fontWeight: 600,
                  background: 'linear-gradient(95deg, #FFF 47.33%, #EDEDED 70%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  maxWidth: '700px'
                }}>
                  {spec.label}: {spec.value}{spec.label === 'Size' ? ' sq. ft.' : ''}
                </p>
              </div>
            ))}
          </div>

          {/* Property Features Block */}
          <div className="space-y-4">
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: 'normal',
              background: 'linear-gradient(95deg, #FFF 47.33%, #EDEDED 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Property Features:
            </p>
            <div className="space-y-3" style={{ marginBottom: '51.5px' }}>
              {data.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4 max-w-[750px]">
                  <span className="text-white text-xl leading-none mt-1 opacity-70 shrink-0">•</span>
                  <p className="break-words whitespace-pre-wrap" style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: '1.3',
                    background: 'linear-gradient(95deg, #FFF 47.33%, #EDEDED 70%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Tag Button */}
          <div 
            style={{
              width: '258.503px',
              height: '51.111px',
              background: '#F3F3F3',
              borderRadius: '68.758px',
            }}
            className="flex items-center justify-center shadow-xl"
          >
            <span style={{
              color: '#003077',
              fontFamily: 'var(--font-sans)',
              fontSize: '26.203px',
              fontWeight: 700,
            }}>
              {data.price} AED
            </span>
          </div>
        </div>

        {/* Footer Logo - Fixed distance from bottom */}
        <div className="absolute bottom-[25px] left-[110px]">
          <div className="font-serif text-[#F3F3F3] text-[52px] opacity-40 uppercase tracking-widest leading-none">
            FOR YOU
          </div>
        </div>
      </div>
    </div>
  );
}
