"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User, Mail, Shield, ShieldCheck, MapPin, Phone, Calendar, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  
  // Core Data States
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: '',
    role: 'customer',
    createdAt: ''
  });
  
  // UX Interaction States
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  // Sync user profile data metadata configuration safely
  const fetchUserProfile = useCallback(async (userId, userEmail) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile({
          fullName: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          role: data.role || 'customer',
          createdAt: data.created_at || ''
        });
      } else {
        // Fallback placeholder structure if row hasn't initialized yet
        setProfile(prev => ({ ...prev, fullName: userEmail.split('@')[0] }));
      }
    } catch (err) {
      console.error("Error matching profile metrics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Secure baseline session verification route check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push('/login');
      } else {
        setUser(session.user);
        await fetchUserProfile(session.user.id, session.user.email);
      }
    };
    
    checkSession();
  }, [router, fetchUserProfile]);

  // Handle premium context updating mutation updates
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    setFeedbackMsg({ type: '', text: '' });

    try {
      // Build the update payload dynamically to match table layout
      const updateData = {
        id: user.id,
        email: user.email,
        full_name: profile.fullName,
        phone: profile.phone,
        address: profile.address,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updateData, { onConflict: 'id' });

      if (error) throw error;

      setFeedbackMsg({ type: 'success', text: 'Account configuration metrics updated securely.' });
    } catch (err) {
      console.error("Profile mutation crash detail:", err);
      setFeedbackMsg({ 
        type: 'error', 
        text: err.message || 'Could not sync updates to database node.' 
      });
    } finally {
      setIsUpdating(false);
      // Fade message out smoothly after a brief window
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 5000);
    }
  };

 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center text-neutral-400 gap-2">
        <span className="animate-spin text-xl font-light">⟳</span>
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#777777]">Decrypting User Account Matrix...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased pb-16 md:pb-0">
      <main className="pt-8 md:pt-20 pb-24 md:pb-32 px-4 md:px-16 max-w-[1440px] mx-auto">
        {/* Header Block Section */}
        <div className="mb-8 md:mb-16 border-b border-black/[0.06] pb-4 md:pb-8 flex justify-between items-end">
          <div>
            <h1 className="font-semibold text-[28px] md:text-[38px] uppercase tracking-[-0.02em] leading-none mb-2 text-black">Account</h1>
            <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-[#777777]">
              Workspace Portal Identity Matrix
            </p>
          </div>
        
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Main Account Inputs Data Form Column Grid Block */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-black/[0.03] p-6 md:p-8 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-6 pb-2 border-b border-black/[0.04]">
              Personal Information Details
            </h2>

            {feedbackMsg.text && (
              <div className={`mb-6 text-[11px] uppercase tracking-wider font-semibold p-3 rounded-sm border ${
                feedbackMsg.type === 'success' ? 'bg-neutral-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Account Email Address</label>
                <div className="relative flex items-center">
                  <Mail size={14} className="absolute left-3 text-[#999999]" />
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="w-full h-11 pl-9 pr-4 bg-neutral-50 border border-black/[0.06] text-[12px] text-neutral-400 cursor-not-allowed uppercase tracking-wide rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Full Signature Identity Name</label>
                <div className="relative flex items-center">
                  <User size={14} className="absolute left-3 text-[#444444]" />
                  <input 
                    type="text" 
                    value={profile.fullName} 
                    onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter full name identity configuration"
                    required
                    className="w-full h-11 pl-9 pr-4 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Contact Mobile Connection Line</label>
                <div className="relative flex items-center">
                  <Phone size={14} className="absolute left-3 text-[#444444]" />
                  <input 
                    type="tel" 
                    value={profile.phone} 
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+92 300 1234567"
                    className="w-full h-11 pl-9 pr-4 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Shipping Logistics Hub Destination</label>
                <div className="relative flex items-center">
                  <MapPin size={14} className="absolute left-3 top-[14px] text-[#444444]" />
                  <textarea 
                    value={profile.address} 
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Complete delivery address layout mapping metrics"
                    rows={3}
                    className="w-full pl-9 pr-4 pt-3 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors resize-none font-sans"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full h-11 mt-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-900 transition-colors disabled:bg-neutral-300 rounded-sm"
              >
                {isUpdating ? 'Synchronizing State...' : 'Save Configuration Metrics'}
              </button>
            </form>
          </div>

          {/* Verification Side Block */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border border-black/[0.04] p-6 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-2 border-b border-black/[0.04]">
                Portal Clearances
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-neutral-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Privilege Clearance Route</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                    profile.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    {profile.role}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Security Gate Matrix Status</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    Verified
                  </span>
                </div>

                {profile.createdAt && (
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-neutral-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Creation Sequence Timestamp</span>
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-neutral-600">
                      {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#fafafa] border border-black/[0.02] p-6 rounded-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Workspace Curation Integrity</h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed uppercase tracking-wide text-justify">
                Synchronized state changes automatically clear data validation buffers. For complete security operations, terminate active token rows upon finishing sessions on shared devices.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}