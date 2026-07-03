'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  Minus, 
  Plus, 
  Star, 
  Truck, 
  Sparkles, 
  Info, 
  MessageSquare, 
  FileText,
  User,
  Send,
  PlusCircle,
  X
} from 'lucide-react';


// ================= REVIEW CARD COMPONENT =================
export const ReviewCard = ({ review }) => {
  const { name = "Verified Collector", rating = 5, date = "Just now", comment = "" } = review;
  
  return (
    <div className="bg-[#F6F7FB]/40 border border-neutral-200/50 p-3.5 rounded-xl space-y-1.5 transition-all hover:bg-white hover:shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
            <User size={11} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider block">
              {name}
            </span>
            <span className="text-[8px] text-neutral-400 font-medium">
              {date}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={9} 
              className={i < rating ? "fill-current" : "text-neutral-200"} 
            />
          ))}
        </div>
      </div>
      <p className="text-[11px] text-neutral-500 leading-relaxed pl-0.5">
        {comment}
      </p>
    </div>
  );
};

// ================= REVIEW FORM COMPONENT =================
export const ReviewForm = ({ onSubmitReview, onCloseForm }) => {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;

    onSubmitReview({
      name: reviewerName,
      rating: rating,
      date: "Just now",
      comment: comment
    });

    setReviewerName("");
    setComment("");
    setRating(5);
    if (onCloseForm) onCloseForm();
  };

  return (
    <div className="bg-white border border-neutral-200/60 rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.01)] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">
            Share Your Experience
          </h4>
          <p className="text-[9px] text-neutral-400 leading-normal">
            Provide feedback regarding fabric weight, fitment, and design details.
          </p>
        </div>
        {onCloseForm && (
          <button 
            type="button" 
            onClick={onCloseForm} 
            className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="space-y-0.5">
          <label className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 block">
            Overall Rating
          </label>
          <div className="flex items-center gap-0.5 text-neutral-200">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-colors cursor-pointer outline-none"
              >
                <Star 
                  size={13} 
                  className={`transition-colors ${
                    starValue <= (hoverRating || rating)
                      ? "text-amber-400 fill-current"
                      : "text-neutral-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-0.5">
          <label className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 block">
            Your Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Anas K."
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full h-7 px-2.5 bg-[#F6F7FB]/50 border border-neutral-200 rounded-lg text-[10px] font-semibold text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#3B51E3] focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-0.5">
          <label className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 block">
            Review Content
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe overall fit, comfort, and build execution..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2.5 bg-[#F6F7FB]/50 border border-neutral-200 rounded-lg text-[10px] font-semibold text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#3B51E3] focus:bg-white transition-all resize-none leading-relaxed"
          />
        </div>

        <button
          type="submit"
          className="w-full h-7 bg-[#3B51E3] text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#1b284f] transition-all duration-200 shadow-sm flex items-center justify-center gap-1 cursor-pointer"
        >
          <Send size={9} />
          <span>Submit Review</span>
        </button>
      </form>
    </div>
  );
};

// ================= MAIN PRODUCT DETAIL SECTION COMPONENT =================
const ProductDetails = ({ productData, item }) => {
  // Pulls directly from either potential prop configuration setup
  const product = productData || item || {};

  // Layout States
  const [previewImg, setPreviewImg] = useState(0);
  const [activeColor, setActiveColor] = useState("charcoal");
  const [activeSize, setActiveSize] = useState("m");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Initial Reviews Mock Array State
  const [reviewsList, setReviewsList] = useState([
    { name: "Anas K.", rating: 5, date: "2 days ago", comment: "The composition and minimalist build structure are incredible. Exactly what I needed for this collection setup." },
    { name: "Zayn R.", rating: 5, date: "1 week ago", comment: "Exceptional premium weight and clean finish. Fits exactly true to size." }
  ]);

  const colors = [
    { id: "charcoal", hex: "#1F2937", label: "Charcoal" },
    { id: "offwhite", hex: "#F3F4F6", label: "Off-White" },
    { id: "navy", hex: "#1E3A8A", label: "Classic Navy" }
  ];

  const sizes = [
    { id: "s", name: "Small" },
    { id: "m", name: "Medium" },
    { id: "l", name: "Large" },
    { id: "xl", name: "X-Large" }
  ];

  const tabs = [
    { id: "description", title: "Description", icon: FileText },
    { id: "details", title: "Additional Info", icon: Info },
    { id: "reviews", title: `Reviews (${reviewsList.length})`, icon: MessageSquare }
  ];

  const handleAddReview = (newReview) => {
    setReviewsList([newReview, ...reviewsList]);
  };

  // DIRECT SCHEMA MAPPING FROM YOUR SQL FILE
  const productTitle = product.title || "Premium Essential Piece";
  const productPrice = product.price || 0;
  const compareAtPrice = product.compare_at_price;
  const productDescription = product.description || product.short_description || "A tailored signature masterpiece built with meticulous execution, clean panel lines, and high-density manufacturing frameworks.";
  const availabilityText = product.availability || "In Stock";

  // READS THE text[] ARRAY NATIVE PROPERTY DIRECTLY FROM DATABASE CODES
  const imageArray = Array.isArray(product.images) ? product.images : [];
  const currentMainImage = imageArray[previewImg] || "/api/placeholder/500/500";

  return (
    <section className="w-full bg-white text-neutral-900 antialiased font-poppins min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="w-full border-b border-neutral-100 bg-[#F6F7FB]/40">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-0 pt-5 pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
          <div className="space-y-0.5">
            <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-[#3B51E3]">
              {product.brand || "Premium Selections"}
            </span>
            <h1 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight">
              Product Details
            </h1>
          </div>
        </div>
      </div>

      {/* BODY CONTENT CONTAINER */}
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 xl:px-0 py-5 pb-10">
        <div className="flex flex-col lg:flex-row gap-5 xl:gap-8 items-start">
          
          {/* IMAGE SECTION BOX (FIXED WITH ACCURATE SCHEMA PATH) */}
          <div className="w-full lg:max-w-[420px] space-y-1.5 shrink-0">
            <div className="w-full aspect-square rounded-xl bg-[#F6F7FB] border border-neutral-100 flex items-center justify-center overflow-hidden relative group">
              <img
                src={currentMainImage}
                alt={productTitle}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
              {product.badge_text && (
                <span className="absolute top-2 left-2 bg-[#3B51E3] text-white text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md shadow-sm">
                  {product.badge_text}
                </span>
              )}
            </div>

            {/* Micro Thumbnail Selection Row */}
            {imageArray.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {imageArray.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreviewImg(idx)}
                    className={`w-11 h-11 rounded-lg overflow-hidden bg-[#F6F7FB] border-2 transition-all relative ${
                      idx === previewImg ? "border-[#3B51E3] shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MAIN CONFIGURATION INTERFACE COLUMNS */}
          <div className="flex-1 w-full space-y-3.5">
            <div className="space-y-0.5 border-b border-neutral-100 pb-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-900">
                  {productTitle}
                </h2>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-bold uppercase tracking-wider border border-emerald-100/60">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  {availabilityText}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-current" />
                  ))}
                </div>
                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">
                  5.0 ({reviewsList.length} Reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-neutral-900 tracking-tight">
                ${productPrice}
              </span>
              {compareAtPrice && (
                <span className="text-[11px] font-medium text-neutral-400 line-through">
                  ${compareAtPrice}
                </span>
              )}
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xl">
              {productDescription}
            </p>

            <div className="bg-[#F6F7FB]/60 rounded-xl border border-neutral-200/20 p-2.5 space-y-1 max-w-xl">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-600 uppercase tracking-wide">
                <Truck size={11} className="text-[#3B51E3]" />
                <span>Complimentary Express Shipping Protection</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-600 uppercase tracking-wide">
                <Sparkles size={11} className="text-[#3B51E3]" />
                <span>Premium Quality Execution & Production Layout</span>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-3 space-y-3.5 max-w-xl">
              {/* Color Selection */}
              <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 block">
                  Select Color Base
                </span>
                <div className="flex items-center gap-1.5">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setActiveColor(color.id)}
                      className={`relative w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${
                        activeColor === color.id ? "scale-105 ring-2 ring-neutral-900/10 border-neutral-900" : "border-neutral-200"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {activeColor === color.id && (
                        <Check size={8} className={color.id === "offwhite" ? "text-neutral-900" : "text-white"} strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing Deck Layout */}
              <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 block">
                  Select Size Layout
                </span>
                <div className="flex flex-wrap gap-1">
                  {sizes.map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => setActiveSize(sz.id)}
                      className={`h-7 px-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border outline-none select-none ${
                        activeSize === sz.id
                          ? "bg-[#3B51E3] border-[#3B51E3] text-white shadow-sm"
                          : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      {sz.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Controls Bar Stack */}
              <div className="pt-0.5 flex flex-wrap items-center gap-2 w-full">
                <div className="flex items-center bg-[#F6F7FB] border border-neutral-200/40 rounded-lg h-8 overflow-hidden">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-7 h-full flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  >
                    <Minus size={10} strokeWidth={2.5} />
                  </button>
                  <span className="w-7 text-center text-[10px] font-bold text-neutral-900 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-full flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  >
                    <Plus size={10} strokeWidth={2.5} />
                  </button>
                </div>

                <button className="flex-1 h-8 bg-[#1b284f] text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#3B51E3] transition-all duration-200 shadow-sm flex items-center justify-center gap-1 active:scale-[0.98] cursor-pointer min-w-[140px]">
                  <ShoppingBag size={10} className="stroke-[2.5]" />
                  <span>Purchase Configuration</span>
                </button>

                <button className="w-8 h-8 border border-neutral-200 bg-white hover:border-red-200 hover:text-red-500 text-neutral-400 rounded-lg flex items-center justify-center transition-all cursor-pointer">
                  <Heart size={11} className="stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METADATA ACCENT TAB WRAPPER INTERFACE */}
      <div className="w-full bg-[#F6F7FB]/50 border-t border-neutral-100 py-8">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-6 xl:px-0">
          
          <div className="flex border-b border-neutral-200 gap-4 sm:gap-5 overflow-x-auto pb-px">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 pb-2 text-[10px] font-bold uppercase tracking-widest transition-all relative outline-none select-none cursor-pointer whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? "text-[#3B51E3] border-[#3B51E3]"
                      : "text-neutral-400 border-transparent hover:text-neutral-700"
                  }`}
                >
                  <TabIcon size={10} className="stroke-[2.5]" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE TAB ROUTER CANVAS workspace */}
          <div className="mt-5 max-w-4xl">
            {activeTab === "description" && (
              <div className="space-y-2 text-[11px] text-neutral-500 leading-relaxed animate-in fade-in duration-150">
                <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider">Product Specifications</h3>
                <p>{product.description || "No full description compiled for this asset archive structural index."}</p>
                {product.specifications && <p className="mt-2 bg-white p-3 rounded-xl border border-neutral-100">{product.specifications}</p>}
              </div>
            )}

            {activeTab === "details" && (
              <div className="bg-white rounded-xl border border-neutral-200/50 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)] animate-in fade-in duration-150">
                {[
                  { label: "SKU Unit Ident", value: product.sku || "N/A" },
                  { label: "Material Composition", value: product.material || "Premium Tailored Blend" },
                  { label: "Product Weight Scale", value: product.weight || "Standard Weight Pack" },
                  { label: "Warranty Logistics", value: product.warranty || "Standard Brand Protection Coverage" }
                ].map((dataRow, idx) => (
                  <div key={idx} className="flex border-b border-neutral-100 last:border-none text-[10px]">
                    <span className="w-1/3 px-3 py-2 font-bold uppercase tracking-wider bg-[#F6F7FB]/40 text-neutral-400 border-r border-neutral-100">
                      {dataRow.label}
                    </span>
                    <span className="w-2/3 px-3 py-2 font-medium text-neutral-700">
                      {dataRow.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start animate-in fade-in duration-150">
                
                {/* REVIEWS LIST ACCORDION NODE MAP */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center justify-between gap-4 pb-1">
                    <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                      Verified Customer Feedback
                    </h3>
                    
                    {/* ACCESSIBLE WRITING TOGGLE BUTTON */}
                    {!isFormOpen && (
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="text-[9px] font-bold text-[#3B51E3] uppercase tracking-wider flex items-center gap-1 hover:text-[#1b284f] transition-colors cursor-pointer outline-none animate-pulse"
                      >
                        <PlusCircle size={11} />
                        <span>Write A Review</span>
                      </button>
                    )}
                  </div>
                  
                  {reviewsList.length === 0 ? (
                    <p className="text-[10px] font-semibold text-neutral-400 py-4 text-center bg-white rounded-xl border border-dashed">
                      No customer reviews logged yet. Be the first to share your experience.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {reviewsList.map((rev, idx) => (
                        <ReviewCard key={idx} review={rev} />
                      ))}
                    </div>
                  )}
                </div>

                {/* DYNAMIC FORM DRAWER IN TABS DISPLAY SECTION */}
                <div className="md:col-span-5">
                  {isFormOpen ? (
                    <ReviewForm 
                      onSubmitReview={handleAddReview} 
                      onCloseForm={() => setIsFormOpen(false)} 
                    />
                  ) : (
                    <div className="bg-[#F6F7FB]/30 border border-dashed border-neutral-200 rounded-xl p-4 text-center space-y-2">
                      <p className="text-[10px] font-medium text-neutral-400 leading-normal">
                        Have you evaluated this item's assembly framework or fabric composition?
                      </p>
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="h-7 px-3 bg-white border border-neutral-200 text-neutral-700 text-[9px] font-bold uppercase tracking-wider rounded-lg hover:border-neutral-400 transition-colors cursor-pointer"
                      >
                        Share Your Review Logs
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductDetails;