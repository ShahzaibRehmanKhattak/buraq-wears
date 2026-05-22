import { headers } from "next/headers";
import CategoryDashboardClient from "@/components/admin/CategoryDashboardClient";

export const metadata = {
  title: "Category Control Desk | Admin Console",
};

export default async function CategoriesPage() {
  let initialCategories = [];
  
  try {
    // 1. Automatically grab the request headers
    const headersList = await headers();
    const host = headersList.get("host"); 
    
    // 2. Automatically determine if it's running on secure https or local http
    const protocol = host.includes("localhost") ? "http" : "https";
    const absoluteBaseUrl = `${protocol}://${host}`;
    
    console.log(`[Server Fetch] Auto-detected Base URL: ${absoluteBaseUrl}`);

    // 3. Perform the server-side fetch using the fully auto-computed URL
    const res = await fetch(`${absoluteBaseUrl}/api/categories`, { cache: "no-store" });
    const payload = await res.json();
    
    if (payload.success) {
      initialCategories = payload.data;
    } else {
      console.error("API returned an error state:", payload.error);
    }
  } catch (err) {
    console.error("Critical component data mapping fetch breakdown:", err.message);
  }

  return (
    <CategoryDashboardClient initialCategories={initialCategories} />
  );
}