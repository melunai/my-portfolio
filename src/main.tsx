import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { initPlausible } from "./lib/analytics";
import ThemeProvider from "./theme/ThemeProvider";
function Root() {
  useEffect(() => {
    // защита от повторной инициализации в StrictMode (dev)
    if ((window as any).__plausibleInited) return;
    (window as any).__plausibleInited = true;
    initPlausible("yourdomain.com");
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
