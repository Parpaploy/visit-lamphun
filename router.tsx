import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateLayout from "./src/layouts/private-layout";
import PublicLayout from "./src/layouts/public-layout";
import Homepage from "./src/pages/homepage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "reset-password",
        element: <></>,
      },
    ],
  },

  {
    path: "/private",
    element: <PrivateLayout />,
    children: [
      { path: "dashboard", element: <></> },
      { index: true, element: <Navigate to="dashboard" replace /> },
    ],
  },
]);
