// utils/getSettings.js
import { createClient } from '@supabase/supabase-js'; // or however you import your client

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function getGlobalSettings() {
  try {
    const { data, error } = await supabase
      .from('system_settings') // <-- Change 'site_settings' to 'system_settings'
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.error("Database settings fallback engaged:", error?.message || "No data returned");
      return fallbackSettings;
    }

    return data;
  } catch (err) {
    console.error("Critical error fetching system settings:", err);
    return fallbackSettings;
  }
}

const fallbackSettings = {
  store_name: "Buraq Wears",
  tagline: "Premium Apparel Concept"
};