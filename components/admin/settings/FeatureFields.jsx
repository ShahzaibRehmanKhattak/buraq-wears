import React from 'react';

export function FeatureFields({ data, onUpdate }) {
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>Storefront Module Engine Flags</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 border p-4 rounded text-[12px] font-bold uppercase tracking-wider cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.blog_enabled || false} onChange={e => onUpdate('features', 'blog_enabled', e.target.checked)} />
          Activate Store Blog Matrix
        </label>
        <label className="flex items-center gap-3 border p-4 rounded text-[12px] font-bold uppercase tracking-wider cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.reviews_enabled || false} onChange={e => onUpdate('features', 'reviews_enabled', e.target.checked)} />
          Enable Product Stars Reviews
        </label>
        <label className="flex items-center gap-3 border p-4 rounded text-[12px] font-bold uppercase tracking-wider cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.newsletter_enabled || false} onChange={e => onUpdate('features', 'newsletter_enabled', e.target.checked)} />
          Enable Subscription Newsletter
        </label>
        <label className="flex items-center gap-3 border p-4 rounded text-[12px] font-bold uppercase tracking-wider cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.coupons_enabled || false} onChange={e => onUpdate('features', 'coupons_enabled', e.target.checked)} />
          Activate Checkout Coupon Code Engine
        </label>
        <label className="flex items-center gap-3 border p-4 rounded text-[12px] font-bold uppercase tracking-wider cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.wishlist_enabled || false} onChange={e => onUpdate('features', 'wishlist_enabled', e.target.checked)} />
          Enable User Wishlists
        </label>
      </div>
    </div>
  );
}