import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import Navbar from '~/components/Navbar';

const ResultsPage = () => {
    const { id } = useParams();
    const { kv, fs } = usePuterStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // 1. Get from KV
                const savedJson = await kv.get(`resume:${id}`);
                if (!savedJson) throw new Error("No data found");

                const parsed = JSON.parse(savedJson);
                
                // 2. Fix URL fetching - logic is now safe
                if (parsed.imagePath) {
                    const url = await fs.get_read_url(parsed.imagePath);
                    parsed.viewableImage = url;
                }

                // 3. Safety check for feedback parsing
                if (typeof parsed.feedback === 'string') {
                    try {
                        parsed.feedback = JSON.parse(parsed.feedback);
                    } catch (e) {
                        // Stay as string if not valid JSON
                    }
                }
                
                setData(parsed);
            } catch (err) {
                console.error("Error fetching result:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, fs, kv]);

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-400 font-medium animate-pulse">Analyzing results...</p>
        </div>
    );
    
    if (!data) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
            <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10">
                <h2 className="text-2xl font-bold mb-2">Analysis Not Found</h2>
                <p className="text-gray-400">The requested ID does not exist or has expired.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-blue-500/30">
            <Navbar />
            
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 container mx-auto max-w-7xl px-6 py-12">
                
                {/* Top Title Section */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        {data.jobTitle}
                    </h1>
                    <div className="flex items-center gap-4 text-lg">
                        <span className="text-blue-400 font-semibold tracking-wide uppercase text-sm">Target Company:</span>
                        <span className="text-white">{data.companyName}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* LEFT COLUMN: Resume Preview (Sticky) */}
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Resume Snapshot</h3>
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">OCR Active</span>
                            </div>
                            <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl transition-all hover:border-blue-500/50">
                                <img 
                                    src={data.viewableImage} 
                                    alt="Resume Scan" 
                                    className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: AI Analysis */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                        
                        {/* Summary Section */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-black">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </span>
                                AI Feedback Summary
                            </h3>

                            <div className="space-y-6">
                                {typeof data.feedback === 'object' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(data.feedback).map(([key, value]: any) => (
                                            <div key={key} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <p className="text-[10px] uppercase font-bold text-blue-400 mb-2 tracking-widest">{key.replace('_', ' ')}</p>
                                                <p className="text-slate-200 leading-relaxed text-sm font-medium">
                                                    {Array.isArray(value) ? value.join(', ') : value.toString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-lg text-slate-300 leading-relaxed italic">
                                        "{data.feedback}"
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Card */}
                        <div className="relative group p-[2px] rounded-[2.5rem] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden shadow-2xl">
                            <div className="relative bg-[#030712] rounded-[2.4rem] p-10">
                                <h4 className="text-2xl font-bold text-white mb-2">Ready for the next step?</h4>
                                <p className="text-slate-400 mb-8 max-w-md">Our AI suggests these improvements could increase your matching score by up to 35%.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="flex-1 py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                                        RE-OPTIMIZE RESUME
                                    </button>
                                    <button className="flex-1 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all">
                                        SHARE REPORT
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResultsPage;