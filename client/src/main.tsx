import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { API_BASE_URL } from "./lib/config";

// Debug log to check if API_BASE_URL is loaded correctly
console.log("Current API_BASE_URL:", API_BASE_URL);

createRoot(document.getElementById("root")!).render(<App />);
