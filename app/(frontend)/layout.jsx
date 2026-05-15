import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {BottomNav} from "@/components/BottomNav";

export default function FrontendLayout({ children }) {
  return (
    <>
        <Navbar />
        {children}
        <BottomNav />
        <Footer />
      
    </>
  );
}