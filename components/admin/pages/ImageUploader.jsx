// components/admin/pages/ImageUploader.jsx
"use client";
import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export function ImageUploader({ value, onUploadComplete, label }) {
  const [uploading, setUploading] = useState(false);

  const handleAssetUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `canvas-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `studio-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('page-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('page-assets').getPublicUrl(filePath);
      onUploadComplete(data.publicUrl);
    } catch (err) {
      alert(`Storage System Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555]">{label || "Asset Image Content"}</label>
      <div className="flex items-center gap-4 p-3 border border-dashed rounded bg-neutral-50 border-neutral-200">
        {value ? (
          <img src={value} alt="Preview" className="w-14 h-14 object-cover rounded border bg-white shrink-0" />
        ) : (
          <div className="w-14 h-14 bg-neutral-200 rounded flex items-center justify-center text-neutral-400 shrink-0"><ImageIcon size={18} /></div>
        )}
        <div className="flex-1">
          <input type="text" value={value} readOnly placeholder="No file initialized (Upload or paste path)..." className="w-full h-8 px-2 bg-neutral-100 border text-[11px] rounded text-neutral-500 select-all mb-2" />
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border text-[10px] font-bold uppercase tracking-wider text-black rounded cursor-pointer shadow-sm hover:bg-neutral-50 transition-colors">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            <span>{uploading ? "Uploading..." : "Upload Resource"}</span>
            <input type="file" accept="image/*" disabled={uploading} onChange={handleAssetUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}