'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FilePlus, 
  Download, 
  Trash2, 
  Clock, 
  Languages, 
  BarChart3, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Files,
  ArrowRight,
  Search,
  Building2,
  FileText,
  X,
  Loader2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);
  const [selectedUnit, setSelectedUnit] = React.useState<any>(null);

  // History State
  const [presentations, setPresentations] = React.useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = React.useState(true);

  // Overview Modal State
  const [isOverviewModalOpen, setIsOverviewModalOpen] = React.useState(false);
  const [overviewData, setOverviewData] = React.useState<any>(null);
  const [isProcessingAI, setIsProcessingAI] = React.useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = React.useState(false);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/presentations');
      const data = await res.json();
      if (data.success) {
        setPresentations(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/presentations-proxy?mode=lite&limit=500');
      const data = await res.json();
      if (data.success) {
        // Updated structure: fallback to projects array
        setProjects(data.data?.projects || data.data?.data || data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const filteredProjects = React.useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return projects.filter((p: any) => {
      const name = p.title?.en || p.name || '';
      const dev = p.developer?.name || p.developer || '';
      const area = p.location || p.area?.nameEn || '';
      const searchLower = searchQuery.toLowerCase();
      
      return name.toLowerCase().includes(searchLower) || 
             dev.toLowerCase().includes(searchLower) ||
             area.toLowerCase().includes(searchLower);
    });
  }, [projects, searchQuery]);

  const handleGenerate = async () => {
    if (!selectedProject) return;
    
    setIsFetchingDetail(true);
    
    try {
      const res = await fetch(`/api/presentations-proxy/${selectedProject.id}`);
      const data = await res.json();
      
      if (data.success && data.data) {
        setIsModalOpen(false);
        const project = data.data;
        
        const priceValue = project.price?.amounts?.sale || project.priceFromAED || null;
        
        // Extract floor from title or description
        const combinedText = `${project.title?.en} ${project.description?.en}`.toLowerCase();
        let extractedFloor = "TBD";
        const floorMatch = combinedText.match(/(highest|ground|low|mid|(\d+)(st|nd|rd|th))\s+floor/i);
        if (floorMatch) extractedFloor = floorMatch[0].toUpperCase();

        const brRaw = project.bedrooms || project.specifications?.bedrooms;
        const unitType = (project.specifications?.unitType || project.type || 'APARTMENT').toString().toUpperCase().replace('BR ','').replace(' BR','');
        
        let displayTitle = "1 BR APARTMENT";
        const isStudio = brRaw === '0' || brRaw === 0 || unitType.includes('STUDIO') || brRaw?.toString().toUpperCase().includes('STUDIO');
        
        if (isStudio) {
          displayTitle = unitType.includes('STUDIO') ? unitType : `STUDIO ${unitType}`;
          displayTitle = displayTitle.replace(' BR', '').replace('BR ', '');
        } else if (brRaw) {
          displayTitle = `${brRaw} BR ${unitType}`;
        }

        const allPhotos = (project.images || []).map((img: any) => img.url || img);
        
        const stagingData = {
          id: project.id,
          photos: allPhotos,
          // SLIDE 1: OFFER
          slide1: {
            projectName: displayTitle.toUpperCase(),
            developer: (project.developer?.name || project.developer || 'FOR YOU').toString().toUpperCase(),
            location: (project.location?.name || project.location || project.area?.nameEn || 'DUBAI').toString().toUpperCase(),
            price: priceValue ? `AED ${Number(priceValue).toLocaleString()}` : 'AED TBD',
            size: project.specifications?.size ? `${Number(project.specifications.size).toLocaleString()} SQFT` : 'TBD',
            floor: extractedFloor,
            unitType: unitType.toUpperCase(),
            furnishing: (project.specifications?.furnishingType || project.furnishingType || 'Semi-furnished').toString().toUpperCase(),
            feature1: "Premium investment opportunity in the heart of Dubai",
            feature2: "Experience world-class amenities and sophisticated architectural design",
            image: allPhotos[0] || ""
          },
          // SLIDE 2: AREA
          slide2: {
            areaName: (project.location?.name || project.location || project.area?.nameEn || 'DUBAI').toString().toUpperCase(),
            title: "A vibrant district offering the perfect balance of luxury and lifestyle.",
            points: [
               "Close to major landmarks and business hubs",
               "Surrounded by lush greenery and leisure zones",
               "Heart of an active and healthy community",
               "Exclusive neighborhood with premium status"
            ]
          },
          // SLIDE 3: AMENITIES (3 ITEMS + 3 IMAGES)
          slide3: {
            title: "WORLD-CLASS AMENITIES",
            items: (project.amenities || []).slice(0, 3).map((a: any) => ({
               name: a.toString().toUpperCase().replace(/-/g, ' '),
               description: "Luxury amenity offering a unique experience for residents of this premium development."
            })),
            images: allPhotos.sort(() => 0.5 - Math.random()).slice(0, 3),
          },
          // SLIDE 4: AMENITIES (2 ITEMS + 2 IMAGES)
          slide4: {
            title: "RESORT-STYLE LIFESTYLE",
            items: (project.amenities || []).slice(3, 5).map((a: any) => ({
               name: a.toString().toUpperCase().replace(/-/g, ' '),
               description: "Exclusive lifestyle facility providing wellness and relaxation in the heart of the project."
            })),
            images: allPhotos.sort(() => 0.5 - Math.random()).slice(3, 5),
          },
          // FINANCIALS (Redundant but kept for sync)
          fixed: {
            price: priceValue ? `AED ${Number(priceValue).toLocaleString()}` : 'AED TBD',
            bedrooms: project.bedrooms || project.specifications?.bedrooms ? `${project.bedrooms || project.specifications.bedrooms} BR` : 'TBD',
            size: project.specifications?.size ? `${Number(project.specifications.size).toLocaleString()} SQFT` : 'TBD',
            completion: project.specifications?.completionDate || project.plannedCompletionAt || 'TBD',
            initialPayment: "20%",
            roi: "8-12%"
          },
          rawDescription: project.description?.en || ""
        };
        
        setOverviewData(stagingData);
        setIsOverviewModalOpen(true);
        
        // AUTO-TRIGGER AI ENRICHMENT
        triggerAutoAI(stagingData);
      } else {
        alert("Failed to fetch project details.");
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      alert("Error: " + err.message);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const triggerAutoAI = async (initialData: any) => {
    setIsProcessingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enrich',
          data: { ...initialData, sourceText: initialData.rawDescription }
        })
      });
      const data = await res.json();
      if (data.success && data.content) {
        setOverviewData((prev: any) => ({
          ...prev,
          slide1: { ...prev.slide1, ...data.content.slide1 },
          slide2: { ...prev.slide2, ...data.content.slide2 },
          slide3: { ...prev.slide3, ...data.content.slide3 },
          slide4: { ...prev.slide4, ...data.content.slide4 }
        }));
      }
    } catch (err) {
      console.error('Auto AI failed', err);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const processAI = async (specificField?: string, index?: number) => {
    if (!overviewData) return;
    setIsProcessingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enrich',
          specificField, 
          index,
          data: { ...overviewData, sourceText: overviewData.rawDescription }
        })
      });
      const data = await res.json();
      console.log('AI Response data:', data);
      
      if (data.success && data.content) {
        setOverviewData((prev: any) => {
          const newData = { ...prev };
          if (specificField === 'feature1' || specificField === 'feature2') {
            newData.slide1 = { ...prev.slide1, [specificField]: data.content.slide1[specificField] };
          } else if (specificField === 'title') {
            newData.slide2 = { ...prev.slide2, title: data.content.slide2.title };
          } else if (specificField === 's3_item' && index !== undefined) {
            const items = [...prev.slide3.items];
            items[index] = data.content.slide3.items[index];
            newData.slide3 = { ...prev.slide3, items };
          } else if (specificField === 's4_item' && index !== undefined) {
             const items = [...prev.slide4.items];
             items[index] = data.content.slide4.items[index];
             newData.slide4 = { ...prev.slide4, items };
          } else if (specificField === 'point' && index !== undefined) {
             const newPts = [...prev.slide2.points];
             newPts[index] = data.content.slide2.points[index];
             newData.slide2 = { ...prev.slide2, points: newPts };
          } else {
            newData.slide1 = { ...prev.slide1, ...data.content.slide1 };
            newData.slide2 = { ...prev.slide2, ...data.content.slide2 };
            newData.slide3 = { ...prev.slide3, ...data.content.slide3 };
            newData.slide4 = { ...prev.slide4, ...data.content.slide4 };
          }
          return newData;
        });
      }
    } catch (err) {
      console.error('AI Processing failed', err);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const confirmAndRedirect = () => {
    // Save to session storage for the editor to pick up
    sessionStorage.setItem('staged_presentation_data', JSON.stringify(overviewData));
    router.push(`/editor?projectId=${overviewData.id}&source=staging`);
  };

  // Grouping History helpers
  const groupPresentationsByDate = (list: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const groups: Record<string, any[]> = {
      'Today': [],
      'Earlier': []
    };

    list.forEach(item => {
      const date = new Date(item.createdAt).toISOString().split('T')[0];
      if (date === today) {
        groups['Today'].push(item);
      } else {
        groups['Earlier'].push(item);
      }
    });

    return groups;
  };

  const groupedHistory = groupPresentationsByDate(presentations);

  // Stats calculation
  const totalGenerations = presentations.length;
  const topProjects = presentations.reduce((acc: any, p) => {
    const name = p.name || 'Untitled';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const sortedTopProjects = Object.entries(topProjects)
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const bestProjectName = sortedTopProjects[0]?.name || 'No data';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#002864]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/">
               <Logo color="#002864" className="w-24 h-auto" />
             </Link>
             <div className="h-4 w-px bg-slate-200" />
             <h1 className="text-[10px] font-black tracking-widest uppercase text-slate-400">Dashboard</h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group flex items-center gap-2 bg-[#002864] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-[#001d4a] active:scale-95 cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              CREATE NEW
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-2xl shadow-blue-900/10 p-1 z-50"
                >
                  <button 
                    onClick={() => router.push('/editor')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                      <FileText className="w-4 h-4" />
                    </div>
                    CREATE FROM SCRATCH
                  </button>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsModalOpen(true);
                      fetchProjects();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    SELECT PROJECT
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Select Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-[#002864]/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                   <div>
                      <h2 className="text-xl font-bold tracking-tight">Select Project</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Automatic Data Generation</p>
                   </div>
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-300 hover:text-slate-600 cursor-pointer"
                   >
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="p-8 space-y-6">
                   {/* Search */}
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Database</label>
                      <div className="relative">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                         <input 
                           type="text" 
                           placeholder="Type project name..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#002864]/5 transition-all"
                         />
                      </div>
                   </div>

                   {/* Project Selection */}
                   <div className="space-y-4">
                      <div className="max-h-[240px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                         {loading ? (
                           <div className="py-12 flex flex-col items-center gap-3 text-slate-300">
                              <Loader2 className="w-8 h-8 animate-spin" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Accessing Real Estate API...</span>
                           </div>
                         ) : filteredProjects.length > 0 ? (
                            filteredProjects.map(project => (
                               <button 
                                 key={project.id}
                                 onClick={() => {
                                   setSelectedProject(project);
                                   setSelectedUnit(null);
                                 }}
                                 className={`
                                   w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group cursor-pointer
                                   ${selectedProject?.id === project.id 
                                     ? 'bg-[#002864] border-[#002864] text-white' 
                                     : 'bg-white border-slate-100 hover:border-slate-200'}
                                 `}
                               >
                                  <div className="flex items-center gap-4">
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedProject?.id === project.id ? 'bg-white/10' : 'bg-slate-50 text-slate-400'}`}>
                                        <Building2 className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <div className="text-sm font-bold truncate max-w-[400px]">
                                          {project.title?.en || project.name || 'Untitled Project'}
                                        </div>
                                        <div className={`text-[10px] font-bold uppercase tracking-tighter ${selectedProject?.id === project.id ? 'text-white/60' : 'text-slate-400'}`}>
                                           {project.location || project.area?.nameEn || 'Dubai'} • {project.developer?.name || project.developer || 'Developer'}
                                        </div>
                                     </div>
                                  </div>
                                  <ChevronRight className={`w-5 h-5 transition-transform shrink-0 ${selectedProject?.id === project.id ? 'translate-x-1' : 'text-slate-200'}`} />
                               </button>
                            ))
                         ) : (
                            <div className="py-12 text-center text-slate-300">
                               <p className="text-sm font-bold">No projects found</p>
                            </div>
                         )}
                      </div>
                   </div>

                   {/* Unit Selection (only if project selected and has units) */}
                   <AnimatePresence>
                     {selectedProject && selectedProject.units && selectedProject.units.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-slate-50 space-y-3"
                        >
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Unit (Optional)</label>
                           <div className="flex flex-wrap gap-2">
                              {selectedProject.units.map((unit: any) => (
                                <button 
                                  key={unit.id}
                                  onClick={() => setSelectedUnit(selectedUnit?.id === unit.id ? null : unit)}
                                  className={`
                                    px-3 py-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer
                                    ${selectedUnit?.id === unit.id 
                                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}
                                  `}
                                >
                                   {unit.bedrooms} BR • {unit.totalSize} sqft
                                </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                   </AnimatePresence>
                 </div>

                 <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      {selectedProject && (
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           Selected: <span className="text-[#002864]">{selectedProject.name}</span>
                        </div>
                      )}
                   </div>
                   <button 
                     disabled={!selectedProject || isFetchingDetail}
                     onClick={handleGenerate}
                     className="px-8 py-3 bg-[#002864] text-white rounded-xl text-xs font-bold transition-all enabled:hover:scale-105 enabled:active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                   >
                      {isFetchingDetail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isFetchingDetail ? 'FETCHING DETAILS...' : 'REVIEW & GENERATE'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Overview Modal (Staging Area) */}
      <AnimatePresence>
        {isOverviewModalOpen && overviewData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 overflow-y-auto pt-[100px] mb-[50px]">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOverviewModalOpen(false)}
               className="fixed inset-0 bg-[#002864]/60 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 50, scale: 0.95 }}
               className="relative z-50 w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex h-[85vh]"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="grid grid-cols-1 lg:grid-cols-10 h-[90vh]">
                    {/* Left: Quick Actions & Photos (2/10) */}
                    <div className="lg:col-span-2 bg-[#002864] p-8 pb-16 flex flex-col justify-between overflow-y-auto">
                       <div className="space-y-8">
                          <div>
                             <h2 className="text-white text-xl font-black italic tracking-tighter">PROJECT STAGING</h2>
                             <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1">Manual Content Refinement</p>
                          </div>

                          <button 
                             onClick={() => processAI()}
                             disabled={isProcessingAI}
                             className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-xl shadow-emerald-500/10 cursor-pointer pointer-events-auto"
                           >
                              {isProcessingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                              {isProcessingAI ? 'AI Enrolling...' : 'Refill with AI'}
                           </button>

                          <div className="space-y-4">
                             <h3 className="text-white/30 text-[8px] font-black uppercase tracking-widest">Media Assets</h3>
                             <div className="grid grid-cols-2 gap-2">
                                {overviewData.photos.slice(0, 6).map((url: string, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 group relative">
                                     <img src={url} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all" />
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="pt-8 flex flex-col gap-3">
                          <button 
                            onClick={() => setIsOverviewModalOpen(false)}
                            className="w-full py-3 text-white/30 text-[9px] font-black shadow-lg uppercase tracking-widest hover:text-white transition-all cursor-pointer"
                          >
                             Back to List
                          </button>
                          <button 
                            onClick={confirmAndRedirect}
                            className="w-full py-4 bg-white text-[#002864] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl cursor-pointer"
                          >
                             Push to Slides
                          </button>
                       </div>
                    </div>

                    {/* Right: Form Control (8/10) */}
                    <div className="lg:col-span-8 p-12 overflow-y-auto custom-scrollbar bg-white">
                       <div className="max-w-4xl mx-auto space-y-16 pb-32">
                          
                          {/* Section: Slide 1 - Offer */}
                          <div className="space-y-8">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#002864]">01</div>
                                <h3 className="text-sm font-black text-[#002864] uppercase tracking-widest">Slide 1: Principal Offer</h3>
                             </div>
                             <div className="grid grid-cols-1 gap-6">
                                <InputField label="PROJECT NAME" value={overviewData.slide1.projectName} onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, projectName: v}})} />
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <InputField label="DEVELOPER" value={overviewData.slide1.developer} onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, developer: v}})} />
                                <InputField label="LOCATION" value={overviewData.slide1.location} onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, location: v}})} />
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <InputField label="PRICE" value={overviewData.slide1.price} onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, price: v}})} />
                                <InputField label="SIZE" value={overviewData.slide1.size} onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, size: v}})} />
                             </div>
                             <div className="grid grid-cols-3 gap-4">
                                <InputField label="FLOOR" value={overviewData.slide1.floor} onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, floor: v}})} />
                                <InputField label="UNIT TYPE" value={overviewData.slide1.unitType} onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, unitType: v}})} />
                                <InputField label="FURNISHING" value={overviewData.slide1.furnishing} onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, furnishing: v}})} />
                             </div>
                             <div className="grid grid-cols-1 gap-6">
                                 <TextAreaField 
                                   label="PRIMARY HOOK" 
                                   limit={62} 
                                   value={overviewData.slide1.feature1} 
                                   onRefill={() => processAI('feature1')}
                                   isProcessing={isProcessingAI}
                                   onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, feature1: v}})} 
                                 />
                                 <TextAreaField 
                                   label="VALUE PROPOSITION" 
                                   limit={120} 
                                   value={overviewData.slide1.feature2} 
                                   onRefill={() => processAI('feature2')}
                                   isProcessing={isProcessingAI}
                                   onChange={(v) => setOverviewData({...overviewData, slide1: {...overviewData.slide1, feature2: v}})} 
                                 />
                             </div>
                          </div>

                          {/* Section: Slide 2 - Area */}
                          <div className="space-y-8">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#002864]">02</div>
                                <h3 className="text-sm font-black text-[#002864] uppercase tracking-widest">Slide 2: District & Lifestyle</h3>
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <InputField label="AREA NAME" value={overviewData.slide2.areaName} onChange={(v) => setOverviewData({...overviewData, slide2: {...overviewData.slide2, areaName: v}})} />
                                 <TextAreaField 
                                   label="AREA TITLE" 
                                   limit={74} 
                                   value={overviewData.slide2.title} 
                                   onRefill={() => processAI('title')}
                                   isProcessing={isProcessingAI}
                                   onChange={(v) => setOverviewData({...overviewData, slide2: {...overviewData.slide2, title: v}})} 
                                 />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                {overviewData.slide2.points.map((p: string, idx: number) => (
                                   <TextAreaField 
                                     key={idx} 
                                     label={`POINT ${idx + 1}`} 
                                     limit={idx === 1 ? 95 : 48} 
                                     value={p} 
                                     onRefill={() => processAI('point', idx)}
                                     isProcessing={isProcessingAI}
                                     onChange={(v) => {
                                       const pts = [...overviewData.slide2.points];
                                       pts[idx] = v;
                                       setOverviewData({...overviewData, slide2: {...overviewData.slide2, points: pts}});
                                     }} 
                                   />
                                ))}
                             </div>
                          </div>

                           {/* Section: Slide 3 - Amenities Page 1 */}
                           <div className="space-y-8 border-t border-slate-100 pt-16">
                              <div className="flex items-center gap-4">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#002864]">03</div>
                                 <h3 className="text-sm font-black text-[#002864] uppercase tracking-widest">Slide 3: Amenities (3 Items)</h3>
                              </div>
                              <div className="space-y-6">
                                 <InputField label="SLIDE TITLE" value={overviewData.slide3.title} onChange={(v) => setOverviewData({...overviewData, slide3: {...overviewData.slide3, title: v}})} />
                                 <div className="space-y-6">
                                    {overviewData.slide3.items?.map((item: any, idx: number) => (
                                       <div key={idx} className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                          <InputField label={`AMENITY ${idx+1}`} value={item.name} onChange={(v) => {
                                             const items = [...overviewData.slide3.items];
                                             items[idx].name = v;
                                             setOverviewData({...overviewData, slide3: {...overviewData.slide3, items}});
                                          }} />
                                          <TextAreaField 
                                             label={`AMENITY ${idx+1} DESCRIPTION`} 
                                             limit={120} 
                                             value={item.description} 
                                             onRefill={() => processAI('s3_item', idx)}
                                             isProcessing={isProcessingAI}
                                             onChange={(v) => {
                                                const items = [...overviewData.slide3.items];
                                                items[idx].description = v;
                                                setOverviewData({...overviewData, slide3: {...overviewData.slide3, items}});
                                             }} 
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           {/* Section: Slide 4 - Amenities Page 2 */}
                           <div className="space-y-8 border-t border-slate-100 pt-16">
                              <div className="flex items-center gap-4">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#002864]">04</div>
                                 <h3 className="text-sm font-black text-[#002864] uppercase tracking-widest">Slide 4: Amenities (2 Items)</h3>
                              </div>
                              <div className="space-y-6">
                                 <InputField label="SLIDE TITLE" value={overviewData.slide4.title} onChange={(v) => setOverviewData({...overviewData, slide4: {...overviewData.slide4, title: v}})} />
                                 <div className="space-y-6">
                                    {overviewData.slide4.items?.map((item: any, idx: number) => (
                                       <div key={idx} className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                          <InputField label={`AMENITY ${idx+1}`} value={item.name} onChange={(v) => {
                                             const items = [...overviewData.slide4.items];
                                             items[idx].name = v;
                                             setOverviewData({...overviewData, slide4: {...overviewData.slide4, items}});
                                          }} />
                                          <TextAreaField 
                                             label={`AMENITY ${idx+1} DESCRIPTION`} 
                                             limit={120} 
                                             value={item.description} 
                                             onRefill={() => processAI('s4_item', idx)}
                                             isProcessing={isProcessingAI}
                                             onChange={(v) => {
                                                const items = [...overviewData.slide4.items];
                                                items[idx].description = v;
                                                setOverviewData({...overviewData, slide4: {...overviewData.slide4, items}});
                                             }} 
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                          {/* Section: Fixed Financials */}
                       </div>
                    </div>
                 </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        
        {/* Statistics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Presentations" 
            value={totalGenerations.toString()} 
            icon={<Files className="w-5 h-5" />}
          />
          <StatCard 
            title="Active Projects" 
            value={sortedTopProjects.length.toString()} 
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard 
            title="Top Language" 
            subtitle="English"
            icon={<Languages className="w-5 h-5" />}
          />
          <StatCard 
            title="Best Project" 
            subtitle={bestProjectName}
            icon={<BarChart3 className="w-5 h-5" />}
          />
        </section>

        {/* Popular Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Top 5 Projects (Real) */}
           <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 transition-all">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800">
                    TOP PROJECTS
                 </h2>
                 <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Local Reach</span>
              </div>
              <div className="space-y-6">
                 {sortedTopProjects.length > 0 ? sortedTopProjects.map((proj, idx) => (
                   <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-300 font-black">0{idx+1}</span>
                            <span className="text-slate-700">{proj.name}</span>
                         </div>
                         <span className="text-slate-400 font-medium">{proj.count} Gen</span>
                      </div>
                      <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(proj.count / sortedTopProjects[0].count) * 100}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full bg-slate-300"
                         />
                      </div>
                   </div>
                 )) : (
                    <div className="py-20 text-center text-slate-200 uppercase text-[10px] font-black tracking-widest">No project statistics yet</div>
                 )}
              </div>
           </div>

           {/* Top 3 Languages (Mock for now, but placeholder) */}
           <div className="bg-white rounded-2xl p-6 border border-slate-100 transition-all flex flex-col justify-between">
              <div className="mb-4">
                <h2 className="text-sm font-bold flex items-center gap-2 mb-8 text-slate-800">
                   LANGUAGES
                </h2>
                <div className="space-y-5">
                   {[
                     { lang: 'English', code: 'EN', share: totalGenerations > 0 ? 100 : 0 },
                   ].map((l, idx) => (
                     <div key={idx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:bg-[#002864] group-hover:text-white transition-all">
                              {l.code}
                           </div>
                           <span className="text-xs font-bold text-slate-600">{l.lang}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-300 tracking-tighter">{l.share}%</span>
                     </div>
                   ))}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50">
                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">Most Popular In Dashboard</p>
              </div>
           </div>
        </div>

        {/* Presentations List History */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">
                 HISTORY
              </h2>
              <div className="h-px flex-1 mx-8 bg-slate-100 opacity-50" />
              <button className="text-[10px] font-black text-slate-300 hover:text-slate-500 tracking-widest transition-colors uppercase">Archive</button>
           </div>

           <div className="space-y-10">
              {presentations.length > 0 ? Object.entries(groupedHistory).map(([date, list]) => (
                list.length > 0 && (
                  <div key={date} className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
                          {date}
                        </span>
                        <div className="h-px flex-1 bg-slate-50" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                        {list.map((item: any) => (
                          <div 
                            key={item.id} 
                            className="group bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between transition-all hover:border-slate-200 hover:shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                                  <Files className="w-5 h-5 text-slate-300" />
                                </div>
                                <div className="space-y-0.5">
                                  <h3 className="font-bold text-sm tracking-tight text-slate-700">{item.name}</h3>
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                                      <span className="uppercase tracking-tighter">Dubai, UAE</span>
                                      <span className="opacity-30">|</span>
                                      <div className="flex gap-1.5 uppercase tracking-tighter">
                                        <span>EN</span>
                                      </div>
                                      <span className="opacity-30">|</span>
                                      <span className="uppercase tracking-tighter">{new Date(item.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-[#002864] hover:bg-slate-50 rounded-lg transition-all cursor-pointer uppercase">
                                  Download
                                </button>
                                <button className="px-3 py-1.5 text-[10px] font-bold text-white bg-[#002864] hover:bg-[#001d4a] rounded-lg transition-all cursor-pointer uppercase">
                                  Edit
                                </button>
                                <div className="w-px h-4 bg-slate-100 mx-1" />
                                <button className="p-2 text-slate-200 hover:text-red-500 transition-all cursor-pointer">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )) : historyLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                   <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
                   <div className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Loading history...</div>
                </div>
              ) : (
                <div className="py-24 flex flex-col items-center gap-6 bg-white rounded-3xl border border-dashed border-slate-200">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <Files className="w-8 h-8 text-slate-200" />
                   </div>
                   <div className="text-center space-y-1">
                      <h3 className="font-bold text-slate-800">Your history is empty</h3>
                      <p className="text-xs text-slate-400">Generate your first presentation to see it here.</p>
                   </div>
                   <button 
                     onClick={() => setIsModalOpen(true)}
                     className="px-6 py-2.5 bg-[#002864] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                   >
                     Create First Presentation
                   </button>
                </div>
              )}
           </div>
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="py-16 border-t border-slate-100 flex flex-col items-center gap-3">
          <div className="text-[9px] font-black text-slate-200 tracking-[0.5em] uppercase">Powered By</div>
          <div className="text-xl font-serif italic text-slate-100 select-none uppercase tracking-widest">FOR YOU</div>
      </footer>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { 
  title: string, 
  value?: string, 
  subtitle?: string, 
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 transition-all">
      <div className="flex items-center justify-between mb-3 text-slate-300">
         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
            {icon}
         </div>
      </div>
      <div className="space-y-0.5">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{title}</h3>
        {value ? (
          <p className="text-xl font-bold tracking-tight text-slate-800">{value}</p>
        ) : (
          <p className="text-sm font-bold text-slate-700">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, readOnly = false, limit, min }: { label: string, value: string, onChange?: (v: string) => void, readOnly?: boolean, limit?: number, min?: number }) {
  const currentCount = value?.length || 0;
  const effectiveMin = min || (limit ? Math.floor(limit * 0.85) : 0);
  const isTooShort = effectiveMin > 0 && currentCount < effectiveMin;
  const isOver = limit && currentCount > limit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between ml-1">
         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
         {limit && (
           <span className={`text-[10px] font-bold ${isOver || isTooShort ? 'text-red-500' : 'text-slate-300'}`}>
              {currentCount} / {effectiveMin}-{limit}
           </span>
         )}
      </div>
      <input 
        type="text" 
        value={value || ''} 
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-5 py-4 rounded-2xl text-sm font-bold border transition-all ${readOnly ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white border-slate-200 text-[#002864] focus:border-[#002864] focus:ring-4 focus:ring-blue-500/5'}`}
      />
    </div>
  );
}

const TextAreaField = ({ label, value, onChange, limit, onRefill, isProcessing }: { label: string, value: string, onChange: (v: string) => void, limit?: number, onRefill?: () => void, isProcessing?: boolean }) => {
  const percentage = limit ? (value?.length || 0) / limit : 0;
  const isTooShort = limit ? (value?.length || 0) < Math.floor(limit * 0.85) : false;
  const isOver = limit ? (value?.length || 0) > limit : false;
  const minLimit = limit ? Math.floor(limit * 0.85) : 0;

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          {label}
          {onRefill && (
            <button 
              onClick={onRefill}
              disabled={isProcessing}
              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-all text-emerald-600 disabled:opacity-30 cursor-pointer flex items-center gap-1 border border-emerald-100/50"
              title="Refill this specific field with AI"
            >
              {isProcessing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
              <span className="text-[8px] font-black uppercase tracking-tighter">AI Regenerate</span>
            </button>
          )}
        </label>
        {limit && (
          <span className={`text-[10px] font-black tabular-nums transition-colors duration-300 ${(isTooShort || isOver) ? 'text-red-500 underline decoration-2 underline-offset-4' : 'text-slate-300'}`}>
            {value?.length || 0} / {minLimit}-{limit}
          </span>
        )}
      </div>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 text-sm font-bold text-[#002864] focus:border-[#002864]/20 focus:ring-0 transition-all min-h-[120px] outline-none resize-none leading-relaxed shadow-sm group-hover:border-slate-200"
      />
    </div>
  );
};
