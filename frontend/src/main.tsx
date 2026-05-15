import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./lib/i18n"; // must import before App to initialise i18next
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
