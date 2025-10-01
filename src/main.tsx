import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { initPlausible } from "./lib/analytics";

function Root() {
  useEffect(() => {
    initPlausible("yourdomain.com");
  }, []);

  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
