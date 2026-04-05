'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { MapPin, CheckCircle2 } from 'lucide-react';

interface PropertyOfferProps {
  id?: string;
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

const defaultOffer: PropertyOfferProps = {
  id: "412272414",
  title: "1BR APARTMENTS IN HIGHBURY",
  developer: "BY ELLINGTON",
  location: "Sobha Hartland, Dubai",
  initialPayment: "1 160 068 AED",
  roi: "6,6–7,1 %",
  price: "1 860 000 AED",
  image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop", // Преміальний інтер'єр
  specs: [
    { label: "Size", value: "882.96 sq. ft." },
    { label: "Floor", value: "Mid floor" },
    { label: "View", value: "Overlooking villas and the landscaped community area" },
    { label: "Unit type", value: "Corner apartment" },
  ],
  features: [
    "Elegant design with refined interior finishes",
    "Ellington quality — with a pricing potential 20–30% higher than competitors upon handover",
  ]
};

export default function OfferDemoPage() {
  const data = defaultOffer;

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-0 md:p-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '1920px', height: '1080px', minWidth: '1920px', minHeight: '1080px' }}
        className="bg-white shadow-2xl flex overflow-hidden relative mx-auto shrink-0"
      >
        {/* Left Side: Image & Badges */}
        <div className="w-1/2 relative h-full bg-[#F3F3F3]">
          <img 
            src={data.image} 
            alt={data.title}
            className="w-full h-full object-cover"
          />
          
          {/* Initial Payment Badge */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              width: '464.367px',
              height: '52px',
              borderRadius: '69.954px',
              background: 'linear-gradient(90deg, #144A9C 31.38%, #002864 89.16%)'
            }}
            className="absolute top-10 left-6 flex items-center justify-center shadow-lg"
          >
            <span style={{
              fontFamily: 'font-sans',
              fontSize: '26.659px',
              fontWeight: 700,
              background: 'linear-gradient(72deg, #FFF 62.06%, #EDEDED 91.14%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Initial Payment: {data.initialPayment}
            </span>
          </motion.div>

          {/* ROI Badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-10 left-6 shadow-lg"
          >
            <div className="relative" style={{ width: '307.882px', height: '80.509px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="308" height="81" viewBox="0 0 308 81" fill="none">
                <path d="M0 9.80768C0 4.39104 4.39105 0 9.8077 0H298.075C303.491 0 307.882 4.39105 307.882 9.8077V70.7018C307.882 76.1184 303.491 80.5095 298.075 80.5095H9.80772C4.39108 80.5095 0 76.1184 0 70.7018V9.80768Z" fill="url(#paint0_linear_2461_200)"/>
                <defs>
                  <linearGradient id="paint0_linear_2461_200" x1="-50.4699" y1="-72.6729" x2="327.024" y2="-11.2408" gradientUnits="userSpaceOnUse">
                    <stop offset="0.182871" stop-color="#A0C6FF"/>
                    <stop offset="1" stop-color="#E1EDFF"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#003077] font-bold text-2xl">ROI ≈ {data.roi}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Info Block */}
        <div 
          style={{ background: 'linear-gradient(180deg, #002864 30.5%, #144A9C 100%)' }}
          className="w-1/2 h-full p-20 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="relative z-10">
            {/* Titles */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-[#F3F3F3] font-serif uppercase" style={{
                fontSize: '86.209px',
                lineHeight: '87%',
                fontWeight: 400,
                marginBottom: '29.81px'
              }}>
                {data.title}
              </h1>
              <p className="text-[#F3F3F3] font-serif uppercase opacity-90" style={{
                fontSize: '58.437px',
                lineHeight: '87%',
                fontWeight: 400,
                marginBottom: '84.19px'
              }}>
                {data.developer}
              </p>
            </motion.div>

            {/* Location */}
            <div className="flex items-center gap-3" style={{ marginBottom: '51.5px' }}>
              <MapPin className="w-8 h-8 text-[#F3F3F3]" />
              <span className="font-sans font-bold text-[#F3F3F3]" style={{
                fontSize: '35.633px',
                lineHeight: '110%',
              }}>
                {data.location}
              </span>
            </div>

            {/* Specs List */}
            <div className="space-y-1" style={{ marginBottom: '35px' }}>
              {data.specs.map((spec, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-white text-2xl leading-none mt-1">•</span>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '24px',
                    fontWeight: 600,
                    background: 'linear-gradient(95deg, #FFF 47.33%, #EDEDED 70%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {spec.label}: {spec.value}
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
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-white text-xl leading-none mt-1 opacity-70">•</span>
                    <p style={{
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
            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={{
                width: '258.503px',
                height: '51.111px',
                background: '#F3F3F3',
                borderRadius: '68.758px',
              }}
              className="flex items-center justify-center shadow-xl cursor-pointer"
            >
              <span style={{
                color: '#003077',
                fontFamily: 'var(--font-sans)',
                fontSize: '26.203px',
                fontWeight: 700,
              }}>
                {data.price}
              </span>
            </motion.div>
          </div>

          {/* Footer Logo */}
          <div className="mt-8">
            <div className="font-serif text-[#F3F3F3] text-[52px] opacity-40 uppercase tracking-widest">
              FOR YOU
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
