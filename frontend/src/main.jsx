import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import api from "./api/config";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// createRoot(document.getElementById("root")).render(<App />);
