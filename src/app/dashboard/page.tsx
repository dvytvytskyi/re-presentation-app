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

  const handleGenerate = () => {
    if (!selectedProject) return;
    const params = new URLSearchParams();
    params.set('projectId', selectedProject.id);
    if (selectedUnit) params.set('unitId', selectedUnit.id);
    router.push(`/editor?${params.toString()}`);
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
                     disabled={!selectedProject}
                     onClick={handleGenerate}
                     className="px-8 py-3 bg-[#002864] text-white rounded-xl text-xs font-bold transition-all enabled:hover:scale-105 enabled:active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                   >
                      <Sparkles className="w-4 h-4" />
                      GENERATE PRESENTATION
                   </button>
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

