import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DataProvider } from "./context/DataContext.jsx";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./ui/Toast.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProvider>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </DataProvider>
  </StrictMode>
);
