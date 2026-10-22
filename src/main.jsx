import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import "./index.css";
createRoot(document.getElementById("root")).render(
  window.location.pathname.startsWith("/admin/") ? <AdminApp /> : <App />,
);
