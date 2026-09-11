import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-void">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
