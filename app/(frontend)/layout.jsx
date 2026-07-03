import { getTheme } from "@/components/themes";

export default function FrontendLayout({ children }) {

  const Theme = getTheme("premium"); // Dynamically switch between "default" and "luxury" themes based on user preference or context

  console.log("Theme:", Theme);

  return (
    <>
      <Theme.Navbar />
      {children}
      <Theme.Footer />
    </>
  );
}