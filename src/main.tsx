import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/fonts";
import "./index.css";

import App from "./App";
import { LibraryProvider } from "./state/LibraryContext";

/* Global image safety-net: if an asset is missing, fade the <img> and let the
   parent surface a designed "matte" instead of a broken icon. */
window.addEventListener(
  "error",
  (e) => {
    const t = e.target as HTMLElement;
    if (t instanceof HTMLImageElement && !t.dataset.fb) {
      t.dataset.fb = "1";
      t.style.visibility = "hidden";
      t.parentElement?.classList.add("img-missing");
    }
  },
  true
);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
