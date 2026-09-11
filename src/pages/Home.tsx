import { useSeo } from "../lib/seo";
import Hero from "../components/sections/Hero";
import Ticker from "../components/ui/Ticker";
import IntroStatement from "../components/sections/IntroStatement";
import FeaturedCollection from "../components/sections/FeaturedCollection";
import PerformanceSection from "../components/sections/PerformanceSection";
import FeaturedVehicle from "../components/sections/FeaturedVehicle";
import BrandsStrip from "../components/sections/BrandsStrip";
import WhyAurev from "../components/sections/WhyAurev";
import ConciergeBand from "../components/sections/ConciergeBand";

/*
 * One art-directed sequence, not nine components:
 *   full-bleed image → editorial column → showcase → reference frame
 *   → magazine feature → typographic index → ledger of promises → CTA.
 */
export default function Home() {
  useSeo({
    title: "AUREV — Luxury Automotive Marketplace",
    description:
      "A curated marketplace of extraordinary automobiles. Verified supercars, grand tourers, performance vehicles — delivered by concierge.",
    path: "/",
    brandSuffix: false,
  });

  return (
    <>
      <Hero />
      <Ticker />
      <IntroStatement />
      <FeaturedCollection />
      <PerformanceSection />
      <FeaturedVehicle />
      <BrandsStrip />
      <WhyAurev />
      <ConciergeBand />
    </>
  );
}
