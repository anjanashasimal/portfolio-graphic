import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// Hidden-before-reveal styles apply only under .motion, so the page is fully visible
// without JS or for visitors who turn motion off.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("motion");
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
