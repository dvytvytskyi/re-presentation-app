"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Languages, 
  Settings, 
  Layers,
  Layout,
  Type,
  Image as ImageIcon,
  ChevronDown,
  Monitor,
  Sparkles,
  ImagePlus,
  MapPin,
  Upload,
  X,
  Loader2,
  Eye,
  EyeOff,
  LayoutDashboard,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { PropertyOffer } from './PropertyOfferTemplate';
import { AreaDetails, type AreaDetailsData } from './AreaDetailsTemplate';
import { ProjectAdvantages, type ProjectAdvantagesData } from './ProjectAdvantagesTemplate';
import { UnitPlan, type UnitDetailsData } from './UnitDetailsTemplate';
import { FullImageSlide, type FullImageData } from './FullImageTemplate';
import { ContactUs, type ContactUsData } from './ContactUsTemplate';

const LANGUAGES = [
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'AR', name: 'العربية', flag: '🇦🇪' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'ZH', name: '中文', flag: '🇨🇳' },
  { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'PT', name: 'Português', flag: '🇵🇹' },
  { code: 'TR', name: 'Türkçe', flag: '🇹🇷' }
];

interface PresentationVersion {
  offerData: any;
  areaData: any;
  advantagesData: any;
  advantages2Data: any;
  unitData: any;
  contactData: any;
  gallery1Data: any;
}

const AMENITIES_PRESETS = [
  {
    label: "SWIMMING POOL",
    title: "POOL & LEISURE AREAS",
    description: "Swimming pool with lounge zones, BBQ areas, and open-air dining spaces",
    image: "https://api.reelly.io/vault/ZZLvFZFt/Cmq-jOXP6-6x4IWQd-bgaNVA6jg/KH99KQ../25.webp"
  },
  {
    label: "GYM / FITNESS",
    title: "SPORTS & WELLNESS",
    description: "Modern fitness center, yoga studio, padel court, and basketball court",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1000"
  },
  {
    label: "GARDEN",
    title: "GARDENS & WALKING AREAS",
    description: "Landscaped gardens, open lounge areas, and a rooftop oasis with panoramic views",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000"
  },
  {
    label: "KIDS PLAYROOM",
    title: "CHILDREN’S AREAS",
    description: "Indoor playrooms and water play areas for kids",
    image: "https://api.reelly.io/vault/ZZLvFZFt/Cmq-jOXP6-6x4IWQd-bgaNVA6jg/KH99KQ../26.webp"
  },
  {
    label: "CINEMA",
    title: "PRIVATE CINEMA",
    description: "Luxury private cinema hall with premium sound system and comfortable seating",
    image: "https://api.reelly.io/vault/ZZLvFZFt/Cmq-jOXP6-6x4IWQd-bgaNVA6jg/KH99KQ../27.webp"
  },
  {
    label: "YOGA STUDIO",
    title: "YOGA & MINDFULNESS",
    description: "Serene yoga and meditation spaces designed for ultimate relaxation and focus",
    image: "https://images.unsplash.com/photo-1545208393-2160281b3f77?auto=format&fit=crop&w=1000"
  },
  {
    label: "BASKETBALL",
    title: "OUTDOOR SPORTS",
    description: "Professional grade basketball and multi-sports courts for active lifestyle",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000"
  }
];

// PREVENT SYSTEM OVERLOAD: Memoized Preview Component
const SlidePreview = React.memo(({ id, offerData, areaData, advantagesData, advantages2Data, gallery1Data, unitData, contactData }: any) => {
  return (
    <div className="absolute inset-0 origin-top-left scale-[0.117] pointer-events-none select-none">
       <div style={{ width: '1920px', height: '1080px' }}>
          {id === 'offer-1' && <PropertyOffer data={offerData} />}
          {id === 'area' && <AreaDetails data={areaData} />}
          {id === 'advantages' && <ProjectAdvantages data={advantagesData} />}
          {id === 'advantages-2' && <ProjectAdvantages data={advantages2Data} />}
          {id === 'gallery-1' && <FullImageSlide data={gallery1Data} />}
          {id === 'unit-1' && <UnitPlan data={unitData} />}
          {id === 'contact-us' && <ContactUs data={contactData} />}
       </div>
    </div>
  );
}, (prev, next) => {
  // Only re-render if data for this specific slide changed
  if (prev.id !== next.id) return false;
  if (prev.id === 'offer-1' && prev.offerData !== next.offerData) return false;
  if (prev.id === 'area' && prev.areaData !== next.areaData) return false;
  if (prev.id === 'advantages' && prev.advantagesData !== next.advantagesData) return false;
  if (prev.id === 'advantages-2' && prev.advantages2Data !== next.advantages2Data) return false;
  if (prev.id === 'gallery-1' && prev.gallery1Data !== next.gallery1Data) return false;
  if (prev.id === 'unit-1' && prev.unitData !== next.unitData) return false;
  if (prev.id === 'contact-us' && prev.contactData !== next.contactData) return false;
  return true;
});

export default function EditorPage() {
  const [zoom, setZoom] = useState(0.5); // Initial zoom to fit screen
  const [activePage, setActivePage] = useState('offer-1');
  const [rightSidebarWidth, setRightSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState<number | string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [offerData, setOfferData] = useState({
    title: "",
    developer: "",
    location: "",
    initialPayment: "",
    roi: "",
    price: "",
    image: "",
    specs: [
      { label: "Size", value: "" },
      { label: "Floor", value: "" },
      { label: "View", value: "" },
      { label: "Unit type", value: "" },
    ],
    features: ["", ""]
  });

  const [areaData, setAreaData] = useState<AreaDetailsData>({
    projectName: "",
    description: "",
    points: ["", "", "", ""],
    distances: [
      { label: "DUBAI MALL / BURJ KHALIFA", time: "" },
      { label: "DXB INTERNATIONAL AIRPORT", time: "" },
      { label: "PALM JUMEIRAH", time: "" },
      { label: "BURJ AL ARAB", time: "" },
      { label: "DOWNTOWN DUBAI", time: "" },
      { label: "DUBAI MARINA", time: "" }
    ],
    mapImage: "/map_bg.png",
    pins: []
  });

  const [advantagesData, setAdvantagesData] = useState<ProjectAdvantagesData>({
    advantages: [
      { title: "PRIME LOCATION", description: "", image: "" },
      { title: "LIFESTYLE AMENITIES", description: "", image: "" },
      { title: "INVESTMENT GROWTH", description: "" , image: "" }
    ]
  });
 
  const [advantages2Data, setAdvantages2Data] = useState<ProjectAdvantagesData>({
    advantages: [
      { title: "PREMIUM FINISHING", description: "" , image: "" },
      { title: "FLEXIBLE PAYMENT", description: "" , image: "" }
    ]
  });

  const [unitData, setUnitData] = useState<UnitDetailsData>({
    title: "",
    image: "",
    specs: [
      { label: "Internal Living Area", value: "" },
      { label: "Outdoor Living Area", value: "" },
      { label: "Total Living Area", value: "" },
    ]
  });

  const [gallery1Data, setGallery1Data] = useState<FullImageData>({
    image: ""
  });

  const [contactData, setContactData] = useState<ContactUsData>({
    title: "CONTACT US",
    locations: [
      { address: "EMAAR BEACHFRONT, DUBAI HARBOUR, DUBAI", image: "/map_left.png", link: "" },
      { address: "ONE BY OMNIYAT, BUSINESS BAY, DUBAI", image: "/map_right.png", link: "" }
    ],
    websiteLabel: "VISIT WEBSITE",
    websiteUrl: "https://presentation.foryou.ae",
    qrCode: "/qr_code.png",
    qrLink: "https://presentation.foryou.ae"
  });

  const [isMagicModalOpen, setIsMagicModalOpen] = useState(false);
  const [magicSourceText, setMagicSourceText] = useState("");
  const [isMagicGenerating, setIsMagicGenerating] = useState(false);
  
  // Manual overrides for Magic Fill
  const [manualData, setManualData] = useState({
    price: "",
    rooms: "1 BR",
    location: "Business Bay",
    internalSize: "",
    externalSize: "",
    totalSize: "",
    initialPayment: "",
    roi: "",
    floor: "Mid Floor"
  });

  const [currentLang, setCurrentLang] = useState('EN');
  const [selectedLang, setSelectedLang] = useState('EN');
  const [versions, setVersions] = useState<Record<string, PresentationVersion>>({
    'EN': { offerData, areaData, advantagesData, advantages2Data, unitData, contactData, gallery1Data }
  });
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hiddenSlides, setHiddenSlides] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const unitId = searchParams.get('unitId');
  const [isSyncingProject, setIsSyncingProject] = useState(false);

  // --- AUTOMATIC PROJECT DATA SYNC ---
  useEffect(() => {
    if (!projectId || !mounted) return;

    const syncProjectData = async () => {
      setIsSyncingProject(true);
      try {
        const res = await fetch(`/api/presentations-proxy/${projectId}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          const project = data.data;
          
          // 1. Basic offer data
          const projectName = project.title?.en || project.name || '';
          setOfferData({
            title: projectName.toUpperCase(),
            developer: (project.developer?.name || project.developer || 'FOR YOU').toString().toUpperCase(),
            location: (project.location || project.area?.nameEn || project.area || 'DUBAI').toString().toUpperCase(),
            price: project.priceFromAED ? Math.round(project.priceFromAED).toLocaleString() : 'TBD',
            image: project.photos?.[0] || "",
            initialPayment: project.paymentPlans?.split('/')?.[0] || "20%",
            roi: "8-12",
            features: project.amenities?.slice(0, 3) || project.facilities?.slice(0, 3) || [],
            specs: [
              { label: "BEDROOMS", value: `${project.bedroomsFrom || 1} - ${project.bedroomsTo || 4}` },
              { label: "SIZE FROM", value: project.sizeFromSqft ? `${Math.round(project.sizeFromSqft).toLocaleString()} SQFT` : 'TBD' },
              { label: "COMPLETION", value: project.completionDate || project.plannedCompletionAt || 'TBD' }
            ]
          });

          // 2. Area details
          setAreaData(prev => ({
            ...prev,
            projectName: (project.title?.en || project.name || '').toUpperCase(),
            description: project.description?.en || project.description || "",
            points: project.amenities?.slice(0, 4) || project.facilities?.slice(0, 4) || []
          }));

          // 3. Advantages Sync
          const amenities = project.amenities || project.facilities || [];
          setAdvantagesData({
              advantages: [
                { title: "PRIME LOCATION", description: `Situated in the prestigious ${project.area?.nameEn || project.area || 'Dubai'} area with stunning views and elite neighborhood.`, image: project.photos?.[1] || "" },
                { title: (amenities[0] || "LIFESTYLE AMENITIES").toString().toUpperCase(), description: `Offering premium ${amenities[0] || 'amenities'} for a comfortable and luxury living experience.`, image: project.photos?.[2] || "" },
                { title: (amenities[1] || "INVESTMENT GROWTH").toString().toUpperCase(), description: "Excellent opportunity for capital appreciation and high rental yields in a growing district.", image: project.photos?.[3] || "" }
              ]
          });

          // 4. Unit specific data
          if (unitId && project.units) {
             const unit = project.units.find((u: any) => u.id === unitId);
             if (unit) {
                setUnitData({
                  title: `${unit.bedrooms} BR APARTMENT`,
                  image: unit.planImage || (project.photos?.[project.photos.length - 1] || ""),
                  specs: [
                    { label: "Price", value: `${unit.price.toLocaleString()} AED` },
                    { label: "Internal Living Area", value: `${unit.totalSize} sqft` },
                    { label: "Total Living Area", value: `${unit.totalSize} sqft` }
                  ]
                });
                setManualData(prev => ({
                  ...prev,
                  price: `${unit.price.toLocaleString()} AED`,
                  rooms: `${unit.bedrooms} BR`,
                  totalSize: `${unit.totalSize} sqft`
                }));
             }
          } else if (project.units && project.units.length > 0) {
            const unit = project.units[0];
            setUnitData({
              title: `${unit.bedrooms} BR APARTMENT`,
              image: unit.planImage || (project.photos?.[project.photos.length - 1] || ""),
              specs: [
                { label: "Price", value: `${unit.price.toLocaleString()} AED` },
                { label: "Internal Living Area", value: `${unit.totalSize} sqft` },
                { label: "Total Living Area", value: `${unit.totalSize} sqft` }
              ]
            });
          }

          setMagicSourceText(`${project.name}\n${project.description}`);
          console.log('Project detailed data synced:', project.name);
        }
      } catch (err) {
        console.error('Project detail sync error:', err);
      } finally {
        setIsSyncingProject(false);
      }
    };

    syncProjectData();
  }, [projectId, unitId, mounted]);

  // --- LOCAL PERSISTENCE ---
  useEffect(() => {
    if (!mounted) return;
    const saved = localStorage.getItem('re_presentation_state_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.offerData) setOfferData(parsed.offerData);
        if (parsed.areaData) setAreaData(parsed.areaData);
        if (parsed.advantagesData) setAdvantagesData(parsed.advantagesData);
        if (parsed.advantages2Data) setAdvantages2Data(parsed.advantages2Data);
        if (parsed.unitData) setUnitData(parsed.unitData);
        if (parsed.gallery1Data) setGallery1Data(parsed.gallery1Data);
        if (parsed.contactData) setContactData(parsed.contactData);
        if (parsed.versions) setVersions(parsed.versions);
        if (parsed.currentLang) setCurrentLang(parsed.currentLang);
        if (parsed.hiddenSlides) setHiddenSlides(parsed.hiddenSlides);
        console.log('Restored from LocalStorage');
      } catch (e) {
        console.error('State restore failed', e);
      }
    }
  }, [mounted]);

  // --- LOCAL PERSISTENCE & VERSION SYNC ---
  useEffect(() => {
    if (!mounted) return;
    
    // Use an AbortController to handle cleanup properly
    const timeout = setTimeout(() => {
      // 1. Check if versions actually need update
      const currentVersion = versions[currentLang];
      const hasChanged = !currentVersion || 
        JSON.stringify(currentVersion.offerData) !== JSON.stringify(offerData) ||
        JSON.stringify(currentVersion.areaData) !== JSON.stringify(areaData);

      if (hasChanged) {
        setVersions(prev => ({
          ...prev,
          [currentLang]: {
            offerData, areaData, advantagesData, advantages2Data, unitData, contactData, gallery1Data
          }
        }));
      }

      // 3. Save to localStorage
      const stateToSave = {
        offerData, areaData, advantagesData, advantages2Data, unitData, gallery1Data, contactData, 
        currentLang, 
        hiddenSlides
      };
      
      try {
        localStorage.setItem('re_presentation_state_v3', JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }, 1500); // Increased debounce to 1.5s for stability

    return () => clearTimeout(timeout);
  }, [offerData, areaData, advantagesData, advantages2Data, unitData, gallery1Data, contactData, currentLang, hiddenSlides, mounted]);


  const switchLanguage = (langCode: string) => {
    const version = versions[langCode];
    if (version) {
      setCurrentLang(langCode);
      setOfferData(version.offerData);
      setAreaData(version.areaData);
      setAdvantagesData(version.advantagesData);
      setAdvantages2Data(version.advantages2Data);
      setUnitData(version.unitData);
      setContactData(version.contactData);
      setGallery1Data(version.gallery1Data);
    }
  };

  const handleTranslate = async (targetLang: string, createCopy: boolean) => {
    setIsTranslating(true);
    try {
      const currentState = {
        offerData,
        areaData,
        advantagesData,
        advantages2Data,
        unitData,
        contactData,
        gallery1Data
      };

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          state: currentState, 
          targetLang: LANGUAGES.find(l => l.code === targetLang)?.name,
          mode: 'translate'
        }),
      });
      
      const res = await response.json();
      if (res.result) {
        const translated = res.result;
        
        if (createCopy) {
          // 1. Create the version record
          setVersions(prev => ({
            ...prev,
            [targetLang]: translated
          }));
          // 2. Switch UI to the translated data
          setCurrentLang(targetLang);
          setOfferData(translated.offerData);
          setAreaData(translated.areaData);
          setAdvantagesData(translated.advantagesData);
          setAdvantages2Data(translated.advantages2Data);
          setUnitData(translated.unitData);
          setContactData(translated.contactData);
          setGallery1Data(translated.gallery1Data);
        } else {
          setOfferData(translated.offerData);
          setAreaData(translated.areaData);
          setAdvantagesData(translated.advantagesData);
          setAdvantages2Data(translated.advantages2Data);
          setUnitData(translated.unitData);
          setContactData(translated.contactData);
          setGallery1Data(translated.gallery1Data);
        }
        setIsTranslateModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAIEdit = async (index: number | string) => {
    let limit = 120;
    let currentText = "";
    
    if (activePage === 'offer-1') {
      limit = index === 0 ? 62 : 120;
      currentText = offerData.features[index as number];
    } else if (activePage === 'area') {
      if (index === 'intro') {
        limit = 74;
        currentText = areaData.description;
      } else {
        const pointLimits = [48, 95, 48, 48];
        limit = pointLimits[index as number] || 120;
        currentText = areaData.points[index as number];
      }
    } else if (activePage === 'advantages') {
      limit = 120;
      const isString = typeof index === 'string';
      const itemIdx = isString ? parseInt(index.split('-')[0]) : (index as number);
      currentText = advantagesData.advantages[itemIdx].description;
    } else if (activePage === 'advantages-2') {
      limit = 120;
      const isString = typeof index === 'string';
      const itemIdx = isString ? parseInt(index.split('-')[0]) : (index as number);
      currentText = advantages2Data.advantages[itemIdx].description;
    }
    
    setGeneratingIndex(index);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText, maxLength: limit }),
      });
      
      const res = await response.json();
      
      if (!response.ok) {
        const errorMsg = res.error || res.message || 'Unknown API Error';
        if (response.status === 429) {
          alert(`Rate Limit: Please wait 15-20 seconds. ${errorMsg}`);
        } else {
          alert(`AI Request Failed (${response.status}): ${errorMsg}`);
        }
        setGeneratingIndex(null);
        return;
      }

      if (res.result) {
        if (activePage === 'offer-1') {
          const newFeatures = [...offerData.features];
          newFeatures[index as number] = res.result;
          setOfferData(prev => ({ ...prev, features: newFeatures }));
        } else if (activePage === 'area') {
          if (index === 'intro') {
            setAreaData(prev => ({ ...prev, description: res.result }));
          } else {
            const newPoints = [...areaData.points];
            newPoints[index as number] = res.result;
            setAreaData(prev => ({ ...prev, points: newPoints }));
          }
        } else if (activePage === 'advantages') {
          const isString = typeof index === 'string';
          const itemIdx = isString ? parseInt(index.split('-')[0]) : (index as number);
          const field = isString ? index.split('-')[1] : 'desc';
          
          const newAdvantages = [...advantagesData.advantages];
          if (field === 'title') newAdvantages[itemIdx].title = res.result;
          else newAdvantages[itemIdx].description = res.result;
          setAdvantagesData({ advantages: newAdvantages });
        } else if (activePage === 'advantages-2') {
          const isString = typeof index === 'string';
          const itemIdx = isString ? parseInt(index.split('-')[0]) : (index as number);
          const field = isString ? index.split('-')[1] : 'desc';

          const newAdvantages = [...advantages2Data.advantages];
          if (field === 'title') newAdvantages[itemIdx].title = res.result;
          else newAdvantages[itemIdx].description = res.result;
          setAdvantages2Data({ advantages: newAdvantages });
        }
        
        // Use a slight delay before allowing next click to avoid RPM issues
        setTimeout(() => {
          // Visual flash
          const id = typeof index === 'string' ? `area-intro` : (activePage === 'area' ? `area-point-${index}` : `feature-area-${index}`);
          const el = document.getElementById(id);
          if (el) {
            el.classList.add('ring-4', 'ring-[#002864]/20');
            setTimeout(() => el.classList.remove('ring-4', 'ring-[#002864]/20'), 1000);
          }
          setGeneratingIndex(null);
        }, 300);
      } else {
        setGeneratingIndex(null);
      }
    } catch (err: any) {
      alert(`Connection Error: ${err.message}`);
      setGeneratingIndex(null);
    }
  };

  const formatNumber = (val: string) => {
    if (!val) return "";
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return new Intl.NumberFormat('en-US').format(Number(num));
  };

  const handleMagicFill = async () => {
    if (!magicSourceText.trim()) return;
    setIsMagicGenerating(true);
    console.log('--- Magic Fill Start ---');
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: magicSourceText, 
          mode: 'magic-fill'
        }),
      });
      
      const res = await response.json();
      console.log('--- Magic Fill AI Response ---', res);

      if (res.result && typeof res.result === 'object') {
        const data = res.result;
        
        // 1. Offer Slide
        if (data.slide1_offer) {
          setOfferData(prev => ({ 
            ...prev, 
            title: `${manualData.rooms} IN ${data.slide1_offer.projectName || prev.title}`.toUpperCase(),
            developer: data.slide1_offer.tagline || prev.developer,
            features: [
              data.slide1_offer.feature1,
              data.slide1_offer.feature2
            ].filter(Boolean),
            specs: [
              { label: 'Size', value: manualData.totalSize || 'TBD' },
              { label: 'Floor', value: manualData.floor },
              { label: 'View', value: data.slide1_offer.view || "" },
              { label: 'Unit type', value: data.slide1_offer.unitType || "" }
            ],
            price: manualData.price || prev.price,
            location: manualData.location || prev.location,
            initialPayment: manualData.initialPayment || prev.initialPayment,
            roi: manualData.roi || prev.roi
          }));
        }

        // 2. Area Slide
        if (data.slide2_area) {
          setAreaData(prev => ({
            ...prev,
            projectName: data.slide2_area.areaName || prev.projectName,
            description: data.slide2_area.description || prev.description,
            points: Array.isArray(data.slide2_area.points) ? data.slide2_area.points : (prev.points || []),
            distances: Array.isArray(data.slide2_area.distances) ? data.slide2_area.distances : (prev.distances || [])
          }));
        }

        // 3. Advantages Slide 1
        if (data.slide3_advantages) {
          setAdvantagesData(prev => ({
            advantages: prev.advantages.map((adv, idx) => ({
              ...adv,
              title: data.slide3_advantages[idx]?.title || adv.title,
              description: data.slide3_advantages[idx]?.description || adv.description
            }))
          }));
        }

        // 4. Advantages Slide 2
        if (data.slide4_advantages) {
          setAdvantages2Data(prev => ({
            advantages: prev.advantages.map((adv, idx) => ({
              ...adv,
              title: data.slide4_advantages[idx]?.title || adv.title,
              description: data.slide4_advantages[idx]?.description || adv.description
            }))
          }));
        }

        // 5. Unit Plan
        if (data.slide5_unit) {
          setUnitData(prev => ({
            ...prev,
            title: data.slide5_unit.title || prev.title,
            specs: [
              { label: 'Internal Living Area', value: manualData.internalSize || '—' },
              { label: 'Outdoor Living Area', value: manualData.externalSize || '—' },
              { label: 'Total Living Area', value: manualData.totalSize || '—' }
            ]
          }));
        }
        
        setIsMagicModalOpen(false);
        setMagicSourceText("");
      } else {
        alert(res.error || "AI failed to generate a valid structure. Please try shorter text.");
      }
    } catch (err) {
      console.error('Magic Fill Error:', err);
      alert("Magic Fill failed. Connection error.");
    } finally {
      setIsMagicGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large! Please upload under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOfferData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle resizing sidebar
  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 320 && newWidth <= 700) {
        setRightSidebarWidth(newWidth);
      }
    };

    const stopResizing = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
    };
  }, [isResizing]);

  // Calculate zoom to fit screen
  useEffect(() => {
    const updateZoom = () => {
      const containerWidth = window.innerWidth - (256 + rightSidebarWidth + 100); // 256px left + dynamic right + 100px padding
      const containerHeight = window.innerHeight - 150; // Account for header + padding
      const zoomX = containerWidth / 1920;
      const zoomY = containerHeight / 1080;
      setZoom(Math.min(zoomX, zoomY, 1));
    };
    updateZoom();
    window.addEventListener('resize', updateZoom);
    return () => window.removeEventListener('resize', updateZoom);
  }, [rightSidebarWidth]);

  return (
    <div className={`h-screen w-full bg-[#E5E7EB] flex flex-col overflow-hidden font-sans ${isResizing ? 'select-none' : ''}`}>
      {/* Project Sync Overlay */}
      <AnimatePresence>
        {isSyncingProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#00183F]/80 backdrop-blur-md flex flex-col items-center justify-center text-white"
          >
             <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mb-8 border border-white/20">
                <Building2 className="w-12 h-12 text-white animate-pulse" />
             </div>
             <div className="text-center space-y-4">
                <h2 className="text-3xl font-serif italic tracking-wider">Syncing Project Data</h2>
                <div className="flex flex-col items-center gap-2">
                   <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Accessing Real Estate Cloud</span>
                   </div>
                   <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Please wait while we populate the slides...</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Translate Modal */}
      <AnimatePresence>
        {isTranslateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTranslateModalOpen(false)}
              className="absolute inset-0 bg-[#00183F]/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl font-sans"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#002864] mb-1 uppercase tracking-tight">AI Translation</h2>
                    <p className="text-gray-400 text-sm font-medium">Translate your entire presentation in seconds</p>
                  </div>
                  <button 
                    onClick={() => setIsTranslateModalOpen(false)}
                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="space-y-4">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Select Target Language</span>
                     <div className="grid grid-cols-2 gap-2">
                        {LANGUAGES.map(lang => (
                           <button
                              key={lang.code}
                              onClick={() => setSelectedLang(lang.code)}
                              className={`
                                 p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer
                                 ${selectedLang === lang.code ? 'bg-[#002864] border-[#002864] text-white shadow-lg' : 'bg-white border-gray-100 hover:border-gray-300'}
                              `}
                           >
                              <span className="text-lg">{lang.flag}</span>
                              <span className="font-bold text-[13px] tracking-tight">{lang.name}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="bg-gray-50/80 rounded-2xl p-6 flex flex-col justify-center gap-6">
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-[#002864]">Translation Mode</p>
                        <p className="text-xs text-gray-400">Choose how to apply translated content</p>
                     </div>
                     
                     <div className="space-y-2">
                        <button
                          onClick={() => handleTranslate(selectedLang, false)}
                          disabled={isTranslating}
                          className="w-full h-12 bg-white border border-gray-200 text-[#002864] rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:border-gray-800 transition-all cursor-pointer disabled:opacity-50"
                        >
                           {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4 text-gray-400" />}
                           REPLACE CURRENT
                        </button>
                        <button
                          onClick={() => handleTranslate(selectedLang, true)}
                          disabled={isTranslating}
                          className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                        >
                           {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                           CREATE COPY (NEW TAB)
                        </button>
                     </div>
                  </div>
                </div>

                <div className="bg-[#002864]/5 rounded-xl p-4 border border-[#002864]/10">
                   <p className="text-[11px] text-[#002864]/70 leading-relaxed italic text-center">
                      Our AI maintains strict character limits and preserves the premium layout for all supported languages. Note: manual changes in one tab do not affect other versions.
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <Logo color="#002864" className="w-24 h-auto" />
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            For You Presentation Manager
          </h2>
          <div className="h-4 w-px bg-slate-200" />
          <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#002864] transition-all uppercase tracking-widest px-3 py-1.5 border border-slate-100 hover:border-[#002864]/20 rounded-lg bg-slate-50/50">
            <LayoutDashboard className="w-3 h-3" />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Tabs */}
          <div className="flex items-center gap-1 bg-white/50 border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto max-w-[600px] no-scrollbar">
            {LANGUAGES.filter(l => versions[l.code]).map(lang => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`
                  px-3 h-8 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap
                  ${currentLang === lang.code 
                    ? 'bg-[#002864] text-white shadow-md scale-105' 
                    : 'hover:bg-white text-gray-500 hover:text-[#002864]'}
                `}
              >
                <span className="text-sm">{lang.flag}</span>
                <span className="text-xs font-bold uppercase tracking-wider">{lang.code}</span>
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-gray-200 mx-2" />

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsTranslateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#002864] rounded-xl text-[13px] font-semibold transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
            >
              <Languages className="w-3.5 h-3.5 text-[#8B5CF6]" />
              AI Translate
            </button>
            <button 
              onClick={() => setIsMagicModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white rounded-xl text-[13px] font-semibold transition-all hover:scale-[1.02] border border-white/20 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Magic Fill
            </button>
            <button className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-[#002864] hover:bg-[#001d4a] rounded-lg transition-all shadow-md cursor-pointer active:scale-95">
              <Download className="w-4 h-4" />
              Export to PDF
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 overflow-y-auto">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pages / 7</span>
            <button title="Coming soon" className="p-1 hover:bg-gray-100 rounded text-brand-navy cursor-help">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 p-4 space-y-8 overflow-y-auto bg-[#F9FAFB]">
            {[
              { id: 'offer-1', label: 'Property Offer' },
              { id: 'area', label: 'Area Details' },
              { id: 'advantages', label: 'Project Advantages 1' },
              { id: 'advantages-2', label: 'Project Advantages 2' },
              { id: 'gallery-1', label: 'Gallery Photo 1' },
              { id: 'unit-1', label: 'Unit Plan 1' },
              { id: 'contact-us', label: 'Contact Us' },
            ].map((page) => (
              <div key={page.id} className="group/slide flex flex-col gap-3 relative">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold tracking-tight uppercase ${
                      activePage === page.id ? 'text-[#002864]' : 'text-gray-400'
                    }`}>
                      {page.label}
                    </span>
                    {hiddenSlides.includes(page.id) && (
                      <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-tighter bg-red-50 px-1 rounded">Hidden</span>
                    )}
                  </div>
                  <div className={`h-1 w-8 rounded-full transition-all duration-500 ${
                    activePage === page.id ? 'bg-[#002864] w-12' : 'bg-gray-200'
                  }`} />
                </div>

                <div className="relative group">
                  <button 
                    onClick={() => setActivePage(page.id)}
                    className={`w-full relative aspect-video rounded-xl overflow-hidden transition-all duration-500 ease-out bg-white ${
                      activePage === page.id 
                      ? 'ring-2 ring-[#002864]/10 border border-[#002864] shadow-md scale-[1.03]' 
                      : 'border border-gray-100 shadow-sm hover:border-[#002864]/20 hover:shadow-md hover:scale-[1.01]'
                    } ${hiddenSlides.includes(page.id) ? 'opacity-40 grayscale-[0.5]' : ''}`}
                  >
                    <SlidePreview 
                      id={page.id}
                      offerData={offerData}
                      areaData={areaData}
                      advantagesData={advantagesData}
                      advantages2Data={advantages2Data}
                      gallery1Data={gallery1Data}
                      unitData={unitData}
                      contactData={contactData}
                    />

                    {activePage === page.id && !hiddenSlides.includes(page.id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#002864] rounded-full flex items-center justify-center border-4 border-white shadow-lg z-30">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHiddenSlides(prev => 
                        prev.includes(page.id) ? prev.filter(p => p !== page.id) : [...prev, page.id]
                      );
                    }}
                    className={`absolute top-2 left-2 p-2 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 z-40 ${
                      hiddenSlides.includes(page.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-[#002864]'
                    } shadow-lg scale-90 hover:scale-100`}
                  >
                    {hiddenSlides.includes(page.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#002864] flex items-center justify-center text-white text-xs font-bold">
                AV
              </div>
              <div className="flex-1 overflow-hidden text-xs">
                <p className="font-bold text-gray-700">Artem V.</p>
                <p className="text-gray-400 truncate">Admin Account</p>
              </div>
              <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </aside>

        {/* Center: Canvas Area */}
        <main className="flex-1 bg-[#F3F4F6] relative overflow-hidden flex items-center justify-center p-8">
          {/* Zoom Control */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full flex items-center gap-4 shadow-xl z-10 transition-all hover:scale-105">
            <button onClick={() => setZoom(z => Math.max(0.1, z - 0.05))} className="p-1 hover:text-[#002864] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs font-bold w-12 text-center text-gray-600">{(zoom * 100).toFixed(0)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.05))} className="p-1 hover:text-[#002864] transition-colors"><ChevronRight className="w-4 h-4" /></button>
            <div className="h-4 w-px bg-gray-200" />
            <button onClick={() => {
               const containerWidth = window.innerWidth - (256 + rightSidebarWidth + 100);
               const containerHeight = window.innerHeight - 150;
               setZoom(Math.min(containerWidth / 1920, containerHeight / 1080));
            }} className="p-1 hover:text-[#002864] transition-colors"><Monitor className="w-4 h-4" /></button>
          </div>

          {/* Actual Sheet Container */}
          <div 
            className="shadow-2xl origin-center transition-transform duration-75 ease-out"
            style={{ 
              transform: `scale(${zoom})`,
              width: '1920px',
              height: '1080px'
            }}
          >
            {activePage === 'offer-1' && (
              <PropertyOffer 
                data={offerData} 
              />
            )}
            {activePage === 'area' && (
              <AreaDetails 
                data={areaData} 
                onMapClick={(x, y) => {
                  setAreaData(prev => ({
                    ...prev,
                    pins: [{ label: prev.projectName, x, y, type: 'main' }]
                  }));
                }}
              />
            )}
            {activePage === 'advantages' && (
              <ProjectAdvantages data={advantagesData} />
            )}
            {activePage === 'advantages-2' && (
              <ProjectAdvantages data={advantages2Data} />
            )}
            {activePage === 'gallery-1' && (
              <FullImageSlide data={gallery1Data} />
            )}
            {activePage === 'unit-1' && (
              <UnitPlan data={unitData} />
            )}
            {activePage === 'contact-us' && (
              <ContactUs data={contactData} />
            )}
          </div>
        </main>

        {/* Right Sidebar: Dynamic Editor Form */}
        <aside 
          className="bg-white border-l border-gray-200 flex flex-col z-20 shadow-2xl relative"
          style={{ width: `${rightSidebarWidth}px` }}
        >
          {/* Resize Handle */}
          <div 
            onMouseDown={startResizing}
            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#002864]/30 transition-colors z-50 group shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)]"
          >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isResizing ? 'opacity-100 bg-[#002864]' : ''}`} />
          </div>
          
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-bold text-gray-700 tracking-tight uppercase text-xs tracking-widest">Content Editor</span>
            </div>
            <button 
              onClick={() => {
                if (confirm('Clear all data and start from scratch?')) {
                  localStorage.removeItem('re_presentation_state_v3');
                  window.location.reload();
                }
              }}
              className="text-[9px] font-bold text-red-500 hover:bg-red-50 transition-colors uppercase tracking-widest border border-red-100 px-2 py-1 rounded-md"
            >
              Reset All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activePage === 'offer-1' && (
              <>
                {/* Title Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Main Title</label>
                    <span className={`text-[10px] font-bold ${offerData.title.length >= 20 ? 'text-red-500' : 'text-gray-300'}`}>
                      {offerData.title.length}/25
                    </span>
                  </div>
                  <textarea 
                    value={offerData.title}
                    onChange={(e) => setOfferData({...offerData, title: e.target.value.toUpperCase()})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-[#002864] focus:ring-2 focus:ring-[#002864]/20 transition-all outline-none resize-none h-20"
                    maxLength={25}
                  />
                </div>

                {/* Developer Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Developer</label>
                    <span className={`text-[10px] font-bold ${offerData.developer.length >= 17 ? 'text-red-500' : 'text-gray-300'}`}>
                      {offerData.developer.length}/20
                    </span>
                  </div>
                  <input 
                    type="text"
                    value={offerData.developer}
                    onChange={(e) => setOfferData({...offerData, developer: e.target.value.toUpperCase()})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-[#002864] focus:ring-2 focus:ring-[#002864]/20 transition-all outline-none"
                    maxLength={20}
                  />
                </div>

                {/* Location & Price */}
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Location</label>
                    <input 
                      type="text"
                      value={offerData.location}
                      onChange={(e) => setOfferData({...offerData, location: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-[#002864] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Price</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={offerData.price}
                          onChange={(e) => setOfferData({...offerData, price: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-xl p-3 pr-12 text-sm font-semibold text-[#002864] outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">AED</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">ROI %</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={offerData.roi}
                          onChange={(e) => setOfferData({...offerData, roi: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-xl p-3 pr-8 text-sm font-semibold text-[#002864] outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Initial Payment</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={offerData.initialPayment}
                        onChange={(e) => setOfferData({...offerData, initialPayment: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 pr-12 text-sm font-semibold text-[#002864] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">AED</span>
                    </div>
                  </div>
                </div>

                {/* Specs Editor */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-1 mb-1 block">Property Specs</label>
                  {offerData.specs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100/50">
                      <div className="w-20 text-[9px] font-extrabold text-gray-400 uppercase ml-1">{spec.label}</div>
                      <div className="relative flex-1">
                        <input 
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = [...offerData.specs];
                            newSpecs[idx].value = e.target.value;
                            setOfferData({...offerData, specs: newSpecs});
                          }}
                          className={`w-full bg-white border-none rounded-lg p-2 text-xs font-bold text-[#002864] outline-none focus:ring-1 focus:ring-blue-200 shadow-sm ${spec.label === 'Size' ? 'pr-14' : ''}`}
                        />
                        {spec.label === 'Size' && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 uppercase">sq. ft.</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features Editor */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-1 mb-1 block">Key Features</label>
                  {offerData.features.map((feature, idx) => {
                    const limit = idx === 0 ? 62 : 120;
                    return (
                      <div key={idx} className="space-y-1.5 pt-2">
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm transition-colors duration-300 ${
                              generatingIndex === idx ? 'bg-blue-500 animate-pulse text-white' : 'bg-[#002864] text-white'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest leading-none">Feature</span>
                          </div>
                          <span className={`text-[9px] font-bold ${
                            feature.length >= limit ? 'text-red-600' : 
                            feature.length >= limit * 0.9 ? 'text-orange-500' : 
                            'text-gray-300'
                          }`}>
                            {feature.length}/{limit}
                          </span>
                        </div>
                        <div className="relative group">
                          <textarea 
                            id={mounted ? `feature-area-${idx}` : undefined}
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...offerData.features];
                              newFeatures[idx] = e.target.value;
                              setOfferData({...offerData, features: newFeatures});
                            }}
                            className={`w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pr-12 text-[11px] font-semibold text-gray-600 outline-none focus:ring-2 focus:ring-blue-50/50 min-h-[90px] resize-none leading-relaxed transition-all duration-300 ${
                              generatingIndex === idx ? 'opacity-50' : 'opacity-100'
                            }`}
                            placeholder={generatingIndex === idx ? 'AI is thinking...' : `Explain benefit ${idx + 1}...`}
                            maxLength={limit}
                            disabled={generatingIndex !== null}
                          />
                          {/* AI Edit Button */}
                          <button 
                            onClick={() => handleAIEdit(idx)}
                            disabled={generatingIndex !== null}
                            title="AI Edit"
                            className={`absolute right-3 top-3 p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-[#002864] hover:text-blue-600 hover:scale-110 active:scale-95 transition-all md:block ${
                              generatingIndex === idx ? 'animate-spin text-blue-500' : 'group-hover:block hidden'
                            } disabled:cursor-not-allowed`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-5">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-1 block">Property Image</label>
                  <input 
                    type="file" 
                    id="image-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <button 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="w-full h-44 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-all group relative"
                  >
                    {offerData.image && !offerData.image.includes('unsplash.com') ? (
                      <>
                        <img src={offerData.image} alt="Upload" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                          <ImagePlus size={24} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Replace Rendering</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                        </div>
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Replace Rendering</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Magic Button */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <Languages className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-blue-700">AI Personalization</span>
                  </div>
                  <p className="text-[11px] text-blue-600 leading-relaxed">
                    Need a better description? Our AI can rewrite features to sound more premium.
                  </p>
                  <button className="mt-3 w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
                    Optimize Description
                  </button>
                </div>
              </>
            )}

            {activePage === 'area' && (
              <>
                 {/* Project Name Input */}
                 <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Project Name</label>
                  </div>
                  <input 
                    type="text"
                    value={areaData.projectName}
                    onChange={(e) => setAreaData({...areaData, projectName: e.target.value.toUpperCase()})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-[#002864] outline-none focus:ring-2 focus:ring-[#002864]/20 transition-all"
                  />
                </div>

                {/* Description Editor */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Location Intro</label>
                    <span className={`text-[10px] font-bold ${areaData.description.length >= 74 ? 'text-red-500' : areaData.description.length >= 68 ? 'text-orange-500' : 'text-gray-300'}`}>
                      {areaData.description.length}/74
                    </span>
                  </div>
                  <div className="relative group">
                    <textarea 
                      id="area-intro"
                      value={areaData.description}
                      onChange={(e) => setAreaData({...areaData, description: e.target.value})}
                      className={`w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pr-12 text-[11px] font-semibold text-gray-600 outline-none focus:ring-2 focus:ring-blue-50/50 min-h-[90px] resize-none leading-relaxed transition-all duration-300 ${
                        generatingIndex === 'intro' ? 'opacity-50' : 'opacity-100'
                      }`}
                      maxLength={74}
                      disabled={generatingIndex !== null}
                    />
                    <button 
                      onClick={() => handleAIEdit('intro')}
                      disabled={generatingIndex !== null}
                      title="AI Edit"
                      className={`absolute right-3 top-3 p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-[#002864] hover:text-blue-600 hover:scale-110 active:scale-95 transition-all ${
                        generatingIndex === 'intro' ? 'animate-spin text-blue-500' : 'group-hover:block hidden'
                      } disabled:cursor-not-allowed`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Points Editor */}
                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-1 mb-1 block">Key Location Points</label>
                  {areaData.points.map((point, idx) => {
                    const pointLimits = [48, 95, 48, 48];
                    const limit = pointLimits[idx] || 120;
                    return (
                    <div key={idx} className="space-y-1.5 pt-2">
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm transition-colors duration-300 ${
                            generatingIndex === idx ? 'bg-blue-500 animate-pulse text-white' : 'bg-[#002864] text-white'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest leading-none">Location Point</span>
                        </div>
                        <span className={`text-[9px] font-bold ${
                          point.length >= limit ? 'text-red-600' : 
                          point.length >= limit * 0.9 ? 'text-orange-500' : 
                          'text-gray-300'
                        }`}>
                          {point.length}/{limit}
                        </span>
                      </div>
                      <div className="relative group">
                        <textarea 
                          id={`area-point-${idx}`}
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...areaData.points];
                            newPoints[idx] = e.target.value;
                            setAreaData({...areaData, points: newPoints});
                          }}
                          className={`w-full bg-gray-50 border border-gray-100 rounded-xl p-3 pr-12 text-[11px] font-semibold text-gray-500 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none h-20 ${
                             generatingIndex === idx ? 'opacity-50' : 'opacity-100'
                          }`}
                          maxLength={limit}
                          disabled={generatingIndex !== null}
                        />
                        <button 
                          onClick={() => handleAIEdit(idx)}
                          disabled={generatingIndex !== null}
                          title="AI Edit"
                          className={`absolute right-3 top-3 p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-[#002864] hover:text-blue-600 hover:scale-110 active:scale-95 transition-all md:block ${
                            generatingIndex === idx ? 'animate-spin text-blue-500' : 'group-hover:block hidden'
                          } disabled:cursor-not-allowed`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>

                 {/* Distances Editor */}
                 <div className="space-y-3 pt-4 border-t border-gray-100">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-1 mb-1 block">Travel Times</label>
                  {areaData.distances.map((dist, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                         type="text"
                         value={dist.time}
                         onChange={(e) => {
                            const newDist = [...areaData.distances];
                            newDist[idx].time = e.target.value;
                            setAreaData({...areaData, distances: newDist});
                         }}
                         className="w-24 bg-gray-50 border-none rounded-lg p-2 text-xs font-bold text-[#002864] outline-none"
                      />
                      <input 
                         type="text"
                         value={dist.label}
                         onChange={(e) => {
                            const newDist = [...areaData.distances];
                            newDist[idx].label = e.target.value;
                            setAreaData({...areaData, distances: newDist});
                         }}
                         className="flex-1 bg-gray-50 border-none rounded-lg p-2 text-xs font-semibold text-gray-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {activePage === 'advantages' && (
              <>
                <div className="flex items-center justify-between px-1 mb-2">
                   <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em]">Pros & Advantages</label>
                </div>
                {advantagesData.advantages.map((adv, idx) => (
                  <div key={idx} className="space-y-4 pt-6 border-t border-gray-100 first:border-t-0 first:pt-0 pb-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#002864] text-white flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Advantage {idx + 1}</span>
                       </div>
                       
                       <select 
                         className="bg-gray-100 border-none rounded-lg text-[9px] font-bold uppercase tracking-wider px-2 py-1 outline-none text-[#002864] cursor-pointer hover:bg-gray-200 transition-colors"
                         onChange={(e) => {
                           const preset = AMENITIES_PRESETS.find(p => p.label === e.target.value);
                           if (preset) {
                             const newAdv = [...advantagesData.advantages];
                             newAdv[idx] = { ...preset };
                             setAdvantagesData({ advantages: newAdv });
                           }
                         }}
                         value=""
                       >
                         <option value="" disabled>Choose Preset...</option>
                         {AMENITIES_PRESETS.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Heading</label>
                        <div className="relative group">
                          <input 
                              type="text"
                              value={adv.title}
                              maxLength={40}
                              onChange={(e) => {
                                const newAdv = [...advantagesData.advantages];
                                newAdv[idx].title = e.target.value.toUpperCase();
                                setAdvantagesData({ advantages: newAdv });
                              }}
                              className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-[#002864] outline-none h-12"
                          />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                          <div className="flex items-center gap-2">
                             <button
                               onClick={() => handleAIEdit(idx)}
                               disabled={generatingIndex === idx}
                               className={`text-[9px] flex items-center gap-1 font-bold uppercase tracking-wider transition-colors cursor-pointer ${generatingIndex === idx ? 'text-blue-300' : 'text-blue-500 hover:text-blue-700'}`}
                             >
                               <Sparkles className="w-2.5 h-2.5" />
                               {generatingIndex === idx ? 'Generating...' : 'Enhance'}
                             </button>
                             <span className="text-[9px] font-bold text-gray-300 ml-1">{adv.description.length}/120</span>
                          </div>
                        </div>
                        <div className="relative group">
                          <textarea 
                              value={adv.description}
                              onChange={(e) => {
                                const newAdv = [...advantagesData.advantages];
                                newAdv[idx].description = e.target.value;
                                setAdvantagesData({ advantages: newAdv });
                              }}
                              className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-semibold text-gray-500 outline-none h-24 resize-none"
                              maxLength={120}
                          />
                        </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                         <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Image URL / File</label>
                         <button 
                           onClick={() => document.getElementById(`file-adv-1-${idx}`)?.click()}
                           className="flex items-center gap-1 text-[9px] font-bold text-gray-400 hover:text-[#002864] transition-colors"
                         >
                           <Upload className="w-2.5 h-2.5" />
                           UPLOAD
                         </button>
                         <input 
                            id={`file-adv-1-${idx}`} 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newAdv = [...advantagesData.advantages];
                                  newAdv[idx].image = reader.result as string;
                                  setAdvantagesData({ advantages: newAdv });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                         />
                      </div>
                      <input 
                        type="text"
                        value={adv.image}
                        placeholder="Paste image URL here..."
                        onChange={(e) => {
                          const newAdv = [...advantagesData.advantages];
                          newAdv[idx].image = e.target.value;
                          setAdvantagesData({ advantages: newAdv });
                        }}
                        className="w-full bg-gray-100/50 border-none rounded-xl p-2 text-[10px] font-medium text-gray-400 outline-none truncate"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {activePage === 'advantages-2' && (
              <>
                <div className="flex items-center justify-between px-1 mb-2">
                   <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em]">Pros & Advantages (Slide 2)</label>
                </div>
                {advantages2Data.advantages.map((adv, idx) => (
                  <div key={idx} className="space-y-4 pt-6 border-t border-gray-100 first:border-t-0 first:pt-0 pb-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#002864] text-white flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Advantage {idx + 1}</span>
                       </div>
                       
                       <select 
                         className="bg-gray-100 border-none rounded-lg text-[9px] font-bold uppercase tracking-wider px-2 py-1 outline-none text-[#002864] cursor-pointer hover:bg-gray-200 transition-colors"
                         onChange={(e) => {
                           const preset = AMENITIES_PRESETS.find(p => p.label === e.target.value);
                           if (preset) {
                             const newAdv = [...advantages2Data.advantages];
                             newAdv[idx] = { ...preset };
                             setAdvantages2Data({ advantages: newAdv });
                           }
                         }}
                         value=""
                       >
                         <option value="" disabled>Choose Preset...</option>
                         {AMENITIES_PRESETS.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Heading</label>
                        <input 
                            type="text"
                            value={adv.title}
                            maxLength={40}
                            onChange={(e) => {
                              const newAdv = [...advantages2Data.advantages];
                              newAdv[idx].title = e.target.value.toUpperCase();
                              setAdvantages2Data({ advantages: newAdv });
                            }}
                            className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-[#002864] outline-none h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                          <button
                               onClick={() => handleAIEdit(idx)}
                               disabled={generatingIndex === idx}
                               className={`text-[9px] flex items-center gap-1 font-bold uppercase tracking-wider transition-colors ${generatingIndex === idx ? 'text-blue-300' : 'text-blue-500 hover:text-blue-700'}`}
                             >
                               <Sparkles className="w-2.5 h-2.5" />
                               {generatingIndex === idx ? 'Generating...' : 'Enhance'}
                             </button>
                        </div>
                        <textarea 
                            value={adv.description}
                            onChange={(e) => {
                              const newAdv = [...advantages2Data.advantages];
                              newAdv[idx].description = e.target.value;
                              setAdvantages2Data({ advantages: newAdv });
                            }}
                            className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-semibold text-gray-500 outline-none h-24 resize-none"
                            maxLength={120}
                        />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                         <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Image URL / File</label>
                         <button 
                           onClick={() => document.getElementById(`file-adv-2-${idx}`)?.click()}
                           className="flex items-center gap-1 text-[9px] font-bold text-gray-400 hover:text-[#002864] transition-colors"
                         >
                           <Upload className="w-2.5 h-2.5" />
                           UPLOAD
                         </button>
                         <input 
                            id={`file-adv-2-${idx}`} 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newAdv = [...advantages2Data.advantages];
                                  newAdv[idx].image = reader.result as string;
                                  setAdvantages2Data({ advantages: newAdv });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                         />
                      </div>
                      <input 
                        type="text"
                        value={adv.image}
                        placeholder="Paste image URL here..."
                        onChange={(e) => {
                          const newAdv = [...advantages2Data.advantages];
                          newAdv[idx].image = e.target.value;
                          setAdvantages2Data({ advantages: newAdv });
                        }}
                        className="w-full bg-gray-100/50 border-none rounded-xl p-2 text-[10px] font-medium text-gray-400 outline-none truncate"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {activePage === 'unit-1' && (
              <>
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-1 mb-1 block">Unit Plan Settings</label>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Unit Title</label>
                        <input 
                            type="text"
                            value={unitData.title}
                            onChange={(e) => setUnitData({ ...unitData, title: e.target.value.toUpperCase() })}
                            className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-[#002864] outline-none h-12"
                        />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                         <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Plan Image (URL or Upload)</label>
                         <button 
                           onClick={() => document.getElementById(`file-unit-1`)?.click()}
                           className="flex items-center gap-1 text-[9px] font-bold text-gray-400 hover:text-[#002864] transition-colors"
                         >
                           <Upload className="w-2.5 h-2.5" />
                           UPLOAD
                         </button>
                         <input 
                            id={`file-unit-1`} 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setUnitData({ ...unitData, image: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                         />
                      </div>
                      <input 
                        type="text"
                        value={unitData.image}
                        onChange={(e) => setUnitData({ ...unitData, image: e.target.value })}
                        className="w-full bg-gray-100/50 border-none rounded-xl p-2 text-[10px] font-medium text-gray-400 outline-none truncate"
                      />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Specifications (Lliving Areas)</label>
                        {unitData.specs.map((spec, sIdx) => (
                           <div key={sIdx} className="grid grid-cols-2 gap-2">
                               <input 
                                 type="text" 
                                 value={spec.label} 
                                 onChange={(e) => {
                                    const newSpecs = [...unitData.specs];
                                    newSpecs[sIdx].label = e.target.value;
                                    setUnitData({ ...unitData, specs: newSpecs });
                                 }}
                                 className="bg-gray-50 border-none rounded-lg p-2 text-[10px] font-bold text-gray-400 outline-none"
                                 placeholder="Label"
                               />
                               <input 
                                 type="text" 
                                 value={spec.value} 
                                 onChange={(e) => {
                                    const newSpecs = [...unitData.specs];
                                    newSpecs[sIdx].value = e.target.value;
                                    setUnitData({ ...unitData, specs: newSpecs });
                                 }}
                                 className="bg-gray-50 border-none rounded-lg p-2 text-[11px] font-semibold text-[#002864] outline-none"
                                 placeholder="Value"
                               />
                           </div>
                        ))}
                    </div>
                </div>
              </>
            )}

            {activePage === 'gallery-1' && (
              <>
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-1 mb-1 block">Gallery Settings</label>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Main Image</label>
                            <button 
                                onClick={() => document.getElementById(`file-gallery-1`)?.click()}
                                className="flex items-center gap-1 text-[9px] font-bold text-gray-400 hover:text-[#002864] transition-colors"
                            >
                                <Upload className="w-2.5 h-2.5" />
                                UPLOAD
                            </button>
                            <input 
                                id={`file-gallery-1`} 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setGallery1Data({ ...gallery1Data, image: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        <input 
                            type="text"
                            value={gallery1Data.image}
                            onChange={(e) => setGallery1Data({ ...gallery1Data, image: e.target.value })}
                            className="bg-gray-50 border-none rounded-xl p-3 text-xs text-[#002864] outline-none h-12 w-full font-medium truncate"
                            placeholder="Image URL"
                        />
                    </div>
                </div>
              </>
            )}

            {activePage === 'contact-us' && (
              <>
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.2em] px-1 mb-1 block">Contact Settings</label>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Title</label>
                        <input 
                            type="text"
                            value={contactData.title}
                            onChange={(e) => setContactData({ ...contactData, title: e.target.value })}
                            className="bg-gray-50 border-none rounded-xl p-3 text-xs text-[#002864] outline-none h-12 w-full font-medium"
                        />
                    </div>
                    
                    {contactData.locations.map((loc, idx) => (
                        <div key={idx} className="space-y-2 p-2 bg-[#F3F4F6]/30 rounded-2xl border border-gray-100">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Location {idx + 1} Address</label>
                            <textarea 
                                value={loc.address}
                                onChange={(e) => {
                                    const newLocs = [...contactData.locations];
                                    newLocs[idx].address = e.target.value;
                                    setContactData({ ...contactData, locations: newLocs });
                                }}
                                className="bg-white border-none rounded-xl p-3 text-xs text-[#002864] outline-none w-full font-medium h-20 resize-none shadow-sm"
                            />
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Web Label</label>
                            <input 
                                type="text"
                                value={contactData.websiteLabel}
                                onChange={(e) => setContactData({ ...contactData, websiteLabel: e.target.value })}
                                className="bg-gray-50 border-none rounded-xl p-3 text-xs text-[#002864] outline-none h-12 w-full font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Web URL</label>
                            <input 
                                type="text"
                                value={contactData.websiteUrl}
                                onChange={(e) => setContactData({ ...contactData, websiteUrl: e.target.value })}
                                className="bg-gray-50 border-none rounded-xl p-3 text-xs text-[#002864] outline-none h-12 w-full font-medium"
                            />
                        </div>
                    </div>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* AI MAGIC FILL MODAL */}
      {isMagicModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#002864]/40 backdrop-blur-sm p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[48px] shadow-2xl p-10 relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsMagicModalOpen(false)}
              className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#002864]">AI Magic Fill</h3>
                <p className="text-sm text-gray-500">Intelligently parse project info and fill all slides</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Text Source */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="flex items-center justify-between mb-2 shrink-0">
                   <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-1">Raw Project Information</label>
                </div>
                <textarea
                  value={magicSourceText}
                  onChange={(e) => setMagicSourceText(e.target.value)}
                  placeholder="Paste raw project text, brochure content, or meeting notes here..."
                  className="w-full flex-1 bg-gray-50 border-2 border-gray-100 rounded-[24px] p-6 text-sm text-[#002864] outline-none focus:border-[#8B5CF6]/30 transition-all font-medium resize-none min-h-[500px]"
                />
              </div>

              {/* Right Column: Critical Data Overrides */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between mb-2 shrink-0">
                   <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-1">Critical Project Data</label>
                </div>
                <div className="flex-1 bg-[#f9fafb] rounded-[32px] p-8 space-y-6 border border-gray-100 flex flex-col justify-between">
                  <div className="space-y-4">
                     <label className="text-[10px] font-extrabold text-[#002864] uppercase tracking-widest px-1">Critical Data (Manual)</label>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Price (AED)*</span>
                           <input 
                              type="text" 
                              value={manualData.price}
                              onChange={(e) => setManualData({...manualData, price: formatNumber(e.target.value)})}
                              placeholder="e.g. 1,850,000"
                              className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm font-bold text-[#002864] outline-none focus:border-[#8B5CF6]/50 transition-all shadow-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Floor*</span>
                           <div className="relative">
                             <select 
                                value={manualData.floor}
                                onChange={(e) => setManualData({...manualData, floor: e.target.value})}
                                className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm font-bold text-[#002864] outline-none cursor-pointer hover:border-gray-300 transition-colors shadow-sm appearance-none pr-10"
                             >
                                {["Low Floor", "Mid Floor", "High Floor", "Penthouse Level"].map(f => (
                                   <option key={f} value={f}>{f}</option>
                                ))}
                             </select>
                             <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Bedrooms*</span>
                           <div className="relative">
                             <select 
                                value={manualData.rooms}
                                onChange={(e) => setManualData({...manualData, rooms: e.target.value})}
                                className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm font-bold text-[#002864] outline-none cursor-pointer hover:border-gray-300 transition-colors shadow-sm appearance-none pr-10"
                             >
                                {["Studio", "1 BR", "2 BR", "3 BR", "4 BR", "5 BR", "6 BR", "7 BR", "8 BR"].map(r => (
                                   <option key={r} value={r}>{r}</option>
                                ))}
                             </select>
                             <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">ROI %*</span>
                           <input 
                              type="text" 
                              value={manualData.roi}
                              onChange={(e) => setManualData({...manualData, roi: e.target.value})}
                              placeholder="e.g. 6.5 - 7.2"
                              className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm font-bold text-[#002864] outline-none focus:border-[#8B5CF6]/50 transition-all shadow-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Initial (AED)*</span>
                           <input 
                              type="text" 
                              value={manualData.initialPayment}
                              onChange={(e) => setManualData({...manualData, initialPayment: formatNumber(e.target.value)})}
                              placeholder="e.g. 240,000"
                              className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm font-bold text-[#002864] outline-none focus:border-[#8B5CF6]/50 transition-all shadow-sm"
                           />
                        </div>
                     </div>

                     <div className="space-y-2 pt-2">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Location / Area</span>
                        <div className="relative">
                          <select 
                             value={manualData.location}
                             onChange={(e) => setManualData({...manualData, location: e.target.value})}
                             className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm font-bold text-[#002864] outline-none cursor-pointer hover:border-gray-300 transition-colors shadow-sm appearance-none pr-10"
                          >
                             {["Business Bay", "Downtown Dubai", "Dubai Creek Harbour", "Palm Jumeirah", "Sobha Hartland", "Meydan", "Dubai Marina", "JVC", "Dubai South", "Damac Lagoons"].map(l => (
                                <option key={l} value={l}>{l}</option>
                             ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                     </div>

                     <div className="pt-6 border-t border-gray-200 mt-6 space-y-4">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Dimensions (sq.ft)</span>
                        <div className="grid grid-cols-3 gap-3">
                           <div className="space-y-1">
                              <span className="text-[8px] font-extrabold text-gray-400 text-center block">INTERNAL</span>
                              <input 
                                 type="text" 
                                 value={manualData.internalSize}
                                 onChange={(e) => setManualData({...manualData, internalSize: formatNumber(e.target.value)})}
                                 className="w-full h-10 bg-white border border-gray-200 rounded-lg text-[12px] font-bold text-center text-[#002864] outline-none focus:border-[#8B5CF6]/30 shadow-sm"
                              />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] font-extrabold text-gray-400 text-center block">OUTDOOR</span>
                              <input 
                                 type="text" 
                                 value={manualData.externalSize}
                                 onChange={(e) => setManualData({...manualData, externalSize: formatNumber(e.target.value)})}
                                 className="w-full h-10 bg-white border border-gray-200 rounded-lg text-[12px] font-bold text-center text-[#002864] outline-none focus:border-[#8B5CF6]/30 shadow-sm"
                              />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] font-extrabold text-gray-400 text-center block">TOTAL</span>
                              <input 
                                 type="text" 
                                 value={manualData.totalSize}
                                 onChange={(e) => setManualData({...manualData, totalSize: formatNumber(e.target.value)})}
                                 className="w-full h-10 bg-white border border-gray-200 rounded-lg text-[12px] font-bold text-center text-[#002864] outline-none text-[#3B82F6] border-blue-200 shadow-sm"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  <button
                    onClick={handleMagicFill}
                    disabled={isMagicGenerating || !magicSourceText.trim() || !manualData.price || !manualData.initialPayment || !manualData.roi || !manualData.floor}
                    className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white rounded-xl font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] cursor-pointer shadow-lg shadow-blue-500/10 active:scale-95 text-sm"
                  >
                    {isMagicGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        GENERATING MAGIC...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        GENERATE ALL SLIDES
                      </>
                    )}
                  </button>
                  {(!manualData.price || !manualData.initialPayment || !manualData.roi || !manualData.floor) && (
                     <p className="text-[10px] text-center text-red-500/80 font-bold uppercase tracking-widest leading-relaxed">
                        Required fields missing:<br/> 
                        {!manualData.price && "• PRICE "}
                        {!manualData.initialPayment && "• INITIAL PAYMENT "}
                        {!manualData.roi && "• ROI"}
                        {!manualData.floor && "• FLOOR"}
                     </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
