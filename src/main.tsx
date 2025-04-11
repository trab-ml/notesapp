import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthIndex from "./auth/AuthIndex";
import "./assets/css/index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <App />
      <AuthIndex />
  </React.StrictMode>
);
