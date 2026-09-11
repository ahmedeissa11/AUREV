import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import { PageSkeleton } from "./components/ui/Skeleton";

/* route-level code splitting — each page ships its own chunk */
const Home = lazy(() => import("./pages/Home"));
const Collection = lazy(() => import("./pages/Collection"));
const VehicleDetail = lazy(() => import("./pages/VehicleDetail"));
const Brands = lazy(() => import("./pages/Brands"));
const Sell = lazy(() => import("./pages/Sell"));
const About = lazy(() => import("./pages/About"));
const Concierge = lazy(() => import("./pages/Concierge"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Compare = lazy(() => import("./pages/Compare"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  const location = useLocation();
  const [runId, setRunId] = useState(0);
  const prevPath = useRef(location.pathname);

  /* hairline route-progress sweep on every navigation */
  useEffect(() => {
    setRunId((n) => n + 1);
  }, [location.pathname]);

  /* scroll to top on navigation */
  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [location]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div key={runId} className="route-progress" aria-hidden="true" />
      <RootLayout>
        <main id="main" key={location.pathname} className="page-enter">
          <Suspense fallback={<PageSkeleton />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/vehicle/:id" element={<VehicleDetail />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/about" element={<About />} />
              <Route path="/concierge" element={<Concierge />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </RootLayout>
    </>
  );
}
