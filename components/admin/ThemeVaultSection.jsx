"use client";
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export function ThemeVaultSection({ settings, onUpdate, triggerToast, onForceSave }) {
  const currentPalettes = Array.isArray(settings.dynamicColorTokens) ? settings.dynamicColorTokens : [];

  const handleActivatePalette = async (palette) => {
    const tokens = palette.tokens || {};
    
    // Auto-extract semantic color coordinates from the selected design asset
    const mappedPrimary = tokens['--color-deep-twilight-500'] || Object.values(tokens)[0] || '#000000';
    const mappedAccent = tokens['--color-french-blue-500'] || '#777777';
    const mappedHeading = tokens['--color-deep-twilight-950'] || '#000000';
    const mappedBody = tokens['--color-deep-twilight-900'] || '#222222';

    // 1. Map the chosen palette values directly to the live workspace inputs
    onUpdate('chosenPaletteName', palette.name);
    onUpdate('primaryColor', mappedPrimary);
    onUpdate('accentColor', mappedAccent);
    onUpdate('buttonBgColor', mappedPrimary);
    onUpdate('headingTextColor', mappedHeading);
    onUpdate('bodyTextColor', mappedBody);

    triggerToast(`"${palette.name}" chosen! Click standard "Update Configurations" at the bottom to switch live store theme layout.`, "success");
  };

  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-5">
      <h4 className={sectionTitleStyle}>Theme Vault & Collections Matrix</h4>
      <p className="text-[12px] text-gray-500 font-medium -mt-2 mb-4">
        Select a custom styling template below to swap system color parameters.
      </p>

      {currentPalettes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPalettes.map((palette) => {
            const isCurrentlySelected = settings.chosenPaletteName === palette.name;
            return (
              <div
                key={palette.id}
                onClick={() => handleActivatePalette(palette)}
                className={`w-full p-4 rounded-md text-left border cursor-pointer transition-all uppercase font-bold tracking-tight relative ${
                  isCurrentlySelected 
                    ? 'border-black bg-black/[0.02] shadow-sm' 
                    : 'border-[#eeeeee] bg-white hover:border-black/[0.3]'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[11px] text-black tracking-wide block">{palette.name}</span>
                    <span className="text-[9px] font-mono font-medium text-gray-400 normal-case mt-0.5 block">
                      Parsed {Object.keys(palette.tokens || {}).length} layout custom tokens
                    </span>
                  </div>
                  {isCurrentlySelected ? (
                    <CheckCircle2 size={15} className="text-black shrink-0" />
                  ) : (
                    <Circle size={15} className="text-gray-300 shrink-0" />
                  )}
                </div>

                {/* Color preview row mapping */}
                <div className="flex w-full h-3.5 rounded overflow-hidden border border-[#eeeeee] bg-gray-50">
                  {palette.previewBar && palette.previewBar.map((color, colorIdx) => (
                    <div key={colorIdx} className="flex-1 h-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-md p-8 text-center text-gray-400 text-[12px]">
          No layout styling profiles found. Head to the "Storefront Theme Layout" tab to append your first configuration sheet template.
        </div>
      )}
    </div>
  );
}