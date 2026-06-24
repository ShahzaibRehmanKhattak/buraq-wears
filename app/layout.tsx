import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from '@/hooks/useCart'; 
import { FavoritesProvider } from "@/hooks/FavoritesContext";
import { getGlobalSettings } from "@/utils/getSettings"; // Fetches your database settings row

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Programmatic Metadata Generator — binds your database settings directly to the browser head
export async function generateMetadata() {
  const settings = await getGlobalSettings();
  
  return {
    title: settings?.store_name || "IBNA Atelier Suite",
    description: settings?.tagline || "Minimalist Ready-To-Wear & Tailored Essentials",
    icons: {
      icon: settings?.favicon_url || "/favicon.ico", // Displays your uploaded favicon instantly
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site configuration on server execution pass
  const settings = await getGlobalSettings();

  // Map chosen font parameter values to clean CSS stacks
  const fontStack = 
    settings?.font_family === "serif" ? "Playfair Display, Garamond, serif" :
    settings?.font_family === "mono" ? "var(--font-geist-mono), SF Mono, monospace" :
    "var(--font-geist-sans), Plus Jakarta Sans, sans-serif";

  // Map corner profiles to exact utility values
  const radiusValue = 
    settings?.corner_radius === "square-cut" ? "0px" : 
    settings?.corner_radius === "round-cut" ? "8px" : 
    "4px"; // soft-cut default baseline

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        className="min-h-full flex flex-col"
        style={{
          // Global variables injected seamlessly for all downstream files
          "--primary": settings?.primary_color || "#000000",
          "--accent": settings?.accent_color || "#777777",
          "--bg-color": settings?.background_color || "#ffffff",
          "--font-stack": fontStack,
          "--radius": radiusValue,
          
          // Force base system layout variables to apply across document body context
          backgroundColor: "var(--bg-color)",
          fontFamily: "var(--font-stack)",
          color: "var(--primary)"
        }}
      >
        <FavoritesProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}