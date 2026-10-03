import Experience from "@/components/Experience";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Exploded from "@/components/sections/Exploded";
import Ingredients from "@/components/sections/Ingredients";
import Craft from "@/components/sections/Craft";
import Sauces from "@/components/sections/Sauces";
import Dining from "@/components/sections/Dining";
import Menu from "@/components/sections/Menu";
import Reserve from "@/components/sections/Reserve";
import Footer from "@/components/sections/Footer";

/**
 * Server component. The page is composed here; only the pieces that need
 * scroll, pointer or WebGL state are client components.
 */
export default function Page() {
  return (
    <Experience>
      <a href="#story" className="skip">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Story />
        <Exploded />
        <Ingredients />
        <Craft />
        <Sauces />
        <Dining />
        <Menu />
        <Reserve />
      </main>
      <Footer />
    </Experience>
  );
}
