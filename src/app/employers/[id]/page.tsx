'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BuildingOfficeIcon, ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SingleEmployer() {
  const { id } = useParams();
  
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchApi(`/profile/${id}`);
        setProfile(response);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-slate-50">
        <h1 className="text-3xl font-bold mb-4">Company Not Found</h1>
        <Link href="/employers" className="text-amber-400 hover:underline flex items-center"><ArrowLeftIcon className="w-4 h-4 mr-2"/> Back to Employers</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/employers" className="inline-flex items-center text-slate-400 hover:text-black mb-8 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Companies
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden backdrop-blur-md"
        >
          {/* Header Cover */}
          <div className="h-48 bg-slate-900 border-b border-slate-700 relative flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: profile.cover?.url ? `url(${profile.cover.url})` : 'none' }}>
             {!profile.cover?.url && (
               <>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                 <BuildingOfficeIcon className="w-32 h-32 text-slate-800 opacity-50 absolute right-10 bottom-[-20px]" />
               </>
             )}
          </div>
          
          <div className="px-8 md:px-12 pb-12 flex flex-col sm:flex-row items-center sm:items-start -mt-16 relative z-10">
            <div className="w-32 h-32 rounded-2xl border-4 border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex items-center justify-center shrink-0">
              <img src={profile.avatar || '/default-avatar.png'} alt="" className="w-full h-full object-cover" />
            </div>
            
            <div className="text-center sm:text-left sm:ml-8 mt-6 sm:mt-20 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">{profile.name}</h1>
              <p className="text-lg text-amber-400 font-medium mb-4">{profile.tagline || 'Leading Organization'}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-400">
                <span className="flex items-center bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700"><MapPinIcon className="w-4 h-4 mr-2" /> {profile.location?.country_state_name || 'Remote'}</span>
              </div>
            </div>
          </div>
          
          <div className="px-8 md:px-12 py-10 border-t border-slate-700/50 bg-slate-900/30">
            <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wider text-sm">About Company</h3>
            <div className="prose prose-invert max-w-none prose-lg text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: profile.description || 'No description provided.' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
