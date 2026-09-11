import { useSeo } from "../lib/seo";
import Hero from "../components/sections/Hero";
import CampaignReel from "../components/sections/CampaignReel";
import IntroStatement from "../components/sections/IntroStatement";
import FeaturedCollection from "../components/sections/FeaturedCollection";
import PerformanceSection from "../components/sections/PerformanceSection";
import FeaturedVehicle from "../components/sections/FeaturedVehicle";
import BrandsStrip from "../components/sections/BrandsStrip";
import WhyAurev from "../components/sections/WhyAurev";
import ConciergeBand from "../components/sections/ConciergeBand";

/*
 * One art-directed sequence: hero → ticker → the pinned reel (poster,
 * reveal, technical sheet) → editorial column → showcase → reference frame
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
      <CampaignReel />
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
