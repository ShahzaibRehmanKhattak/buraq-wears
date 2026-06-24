"use client";
import { useState, useEffect } from 'react';

// Global cache object singleton to persist data entries across mounting states
const clientModuleCache = {};

export function useStoreModule(slug) {
  const [state, setState] = useState({
    data: clientModuleCache[slug] || null,
    loading: !clientModuleCache[slug],
    error: null,
  });

  useEffect(() => {
    if (!slug) return;

    // If data is already stored in the global client-side cache memory, terminate active request loops
    if (clientModuleCache[slug]) {
      setState({ data: clientModuleCache[slug], loading: false, error: null });
      return;
    }

    let isMounted = true;
    
    async function fetchModulePayload() {
      try {
        if (isMounted) setState(prev => ({ ...prev, loading: true }));
        
        const response = await fetch(`/api/store?slug=${encodeURIComponent(slug)}`);
        const json = await response.json();

        if (!json.success) {
          throw new Error(json.error || 'Failed to resolve module data parameters.');
        }

        // Commit to global cache memory safely
        clientModuleCache[slug] = json.data;

        if (isMounted) {
          setState({ data: json.data, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setState({ data: null, loading: false, error: err.message });
        }
      }
    }

    fetchModulePayload();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Expose categorized subsets directly out of the state payload for quick structural destructuring
  return {
    loading: state.loading,
    error: state.error,
    raw: state.data,
    
    // Split Configurations
    hero: state.data ? {
      name: state.data.hero_name,
      description: state.data.hero_description,
      image: state.data.hero_image,
      btnText: state.data.hero_btn_text,
      btnUrl: state.data.hero_btn_url,
      carousel: state.data.home_carousel_slides,
      matrix: state.data.standard_heroes_matrix
    } : null,

    sizing: state.data ? {
      imperial: state.data.sizing_matrix_imperial,
      metric: state.data.sizing_matrix_metric,
      fitProfile: state.data.sizing_fit_profile_text
    } : null,

    returns: state.data ? {
      directives: state.data.returns_directives,
      faqs: state.data.returns_faqs
    } : null,

    contact: state.data ? {
      location: state.data.contact_hub_location,
      email: state.data.contact_receiver_email,
      phone: state.data.contact_support_phone,
      hours: state.data.contact_operational_hours
    } : null,

    faqsList: state.data ? state.data.master_faqs_list : []
  };
}