"use client";
import React, { useState } from 'react';
import { Terminal, Plus } from 'lucide-react';

export function ThemeWorkspaceSection({ settings, onUpdate, triggerToast }) {
  const [paletteLabel, setPaletteLabel] = useState('');

  const parseCodeBlockLines = (text) => {
    if (!text || !text.trim()) return null;
    const lines = text.split('\n');
    const colorMap = {};
    const samplePreviews = [];

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (!cleanLine.startsWith('--color-')) return;
      const parts = cleanLine.split(':');
      if (parts.length < 2) return;

      const variableName = parts[0].trim();
      const hexValue = parts[1].replace(';', '').trim();
      colorMap[variableName] = hexValue;

      if (variableName.endsWith('-500') && samplePreviews.length < 6) {
        samplePreviews.push(hexValue);
      }
    });

    if (Object.keys(colorMap).length === 0) return null;
    return { tokens: colorMap, previews: samplePreviews };
  };

  const handleCommitToVaultArray = () => {
    if (!paletteLabel.trim()) {
      triggerToast("Please provide a distinct name for this custom palette template.", "error");
      return;
    }

    const parsedData = parseCodeBlockLines(settings.rawPaletteText);
    if (!parsedData) {
      triggerToast("No valid CSS custom layout lines found (--color-*).", "error");
      return;
    }

    const newPaletteObject = {
      id: `palette_${Date.now()}`,
      name: paletteLabel.trim().toUpperCase(),
      tokens: parsedData.tokens,
      previewBar: parsedData.previews.length > 0 ? parsedData.previews : ['#000000', '#777777'],
      createdAt: new Date().toISOString()
    };

    // Safely append to the existing database matrix list array
    const existingCollection = Array.isArray(settings.dynamicColorTokens) ? settings.dynamicColorTokens : [];
    const updatedCollection = [...existingCollection, newPaletteObject];

    onUpdate('dynamicColorTokens', updatedCollection);
    setPaletteLabel('');
    onUpdate('rawPaletteText', ''); // Clear out text input upon secure collection push
    triggerToast(`"${newPaletteObject.name}" successfully appended to your Theme Vault! Click "Update Configurations" to save permanently.`, "success");
  };

  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-6">
      <div>
        <h4 className={sectionTitleStyle}>1. Build Custom Styling System</h4>
        <div className="border border-black p-5 rounded-md bg-black/[0.01] space-y-4">
          
          <div>
            <label className={labelStyle}>Palette Unique Display Title</label>
            <input 
              type="text" 
              className={inputStyle} 
              placeholder="e.g., WINTER HARBOR LUXURY, MINIMALIST EARTH" 
              value={paletteLabel}
              onChange={(e) => setPaletteLabel(e.target.value)}
            />
          </div>

          <div>
            <label className={labelStyle}><Terminal size={12} /> Tailwind Color Block Code Sheet</label>
            <textarea 
              rows={6}
              className="w-full rounded-md border border-[#e5e5e5] bg-white p-3 font-mono text-[11px] text-black transition-all outline-none no-scrollbar"
              placeholder={"Paste palette block values here...\n--color-deep-twilight-500: #080cf7;"}
              value={settings.rawPaletteText}
              onChange={(e) => onUpdate('rawPaletteText', e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleCommitToVaultArray}
            className="w-full h-9 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 hover:bg-[#222222] transition-colors"
          >
            <Plus size={14} />
            Commit Palette to Vault List
          </button>
        </div>
      </div>

      <div>
        <h4 className={sectionTitleStyle}>2. Granular Semantic Component Adjustments</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#fafafa] p-4 rounded-md border border-[#eeeeee]">
          <div>
            <label className={labelStyle}>Button Background Hex</label>
            <div className="flex gap-2 items-center">
              <input type="color" className="w-8 h-8 rounded-md cursor-pointer shrink-0 border" value={settings.buttonBgColor} onChange={e => onUpdate('buttonBgColor', e.target.value)} />
              <input type="text" className={inputStyle} value={settings.buttonBgColor} onChange={e => onUpdate('buttonBgColor', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelStyle}>Button Text Typography Hex</label>
            <div className="flex gap-2 items-center">
              <input type="color" className="w-8 h-8 rounded-md cursor-pointer shrink-0 border" value={settings.buttonTextColor} onChange={e => onUpdate('buttonTextColor', e.target.value)} />
              <input type="text" className={inputStyle} value={settings.buttonTextColor} onChange={e => onUpdate('buttonTextColor', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelStyle}>Headings Element Font Hex</label>
            <div className="flex gap-2 items-center">
              <input type="color" className="w-8 h-8 rounded-md cursor-pointer shrink-0 border" value={settings.headingTextColor} onChange={e => onUpdate('headingTextColor', e.target.value)} />
              <input type="text" className={inputStyle} value={settings.headingTextColor} onChange={e => onUpdate('headingTextColor', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelStyle}>Body Content Typography Hex</label>
            <div className="flex gap-2 items-center">
              <input type="color" className="w-8 h-8 rounded-md cursor-pointer shrink-0 border" value={settings.bodyTextColor} onChange={e => onUpdate('bodyTextColor', e.target.value)} />
              <input type="text" className={inputStyle} value={settings.bodyTextColor} onChange={e => onUpdate('bodyTextColor', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className={sectionTitleStyle}>3. Base Layout Canvas Underlays</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelStyle}>Primary Color Hex</label>
            <div className="flex gap-2 items-center">
              <input type="color" className="w-8 h-8 rounded-md cursor-pointer shrink-0 border" value={settings.primaryColor} onChange={e => onUpdate('primaryColor', e.target.value)} />
              <input type="text" className={inputStyle} value={settings.primaryColor} onChange={e => onUpdate('primaryColor', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelStyle}>Accent Color Hex</label>
            <div className="flex gap-2 items-center">
              <input type="color" className="w-8 h-8 rounded-md cursor-pointer shrink-0 border" value={settings.accentColor} onChange={e => onUpdate('accentColor', e.target.value)} />
              <input type="text" className={inputStyle} value={settings.accentColor} onChange={e => onUpdate('accentColor', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelStyle}>Canvas Background Hex</label>
            <div className="flex gap-2 items-center">
              <input type="color" className="w-8 h-8 rounded-md cursor-pointer shrink-0 border" value={settings.backgroundColor} onChange={e => onUpdate('backgroundColor', e.target.value)} />
              <input type="text" className={inputStyle} value={settings.backgroundColor} onChange={e => onUpdate('backgroundColor', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}