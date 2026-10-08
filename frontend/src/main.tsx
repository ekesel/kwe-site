import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ContentProvider } from "@/content/ContentProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContentProvider>
      <RouterProvider router={router} />
    </ContentProvider>
  </React.StrictMode>,
);
