import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateLayout from "./src/layouts/private-layout";
import PublicLayout from "./src/layouts/public-layout";
import LandingPage from "./src/pages/landing-page";
import Homepage from "./src/pages/homepage";
import RecommendedPage from "./src/pages/recommended-page";
import KomePage from "./src/pages/kome-page";
import ContactPage from "./src/pages/contact-page";
import TravelPage from "./src/pages/travel-page";
import AdminDashboard from "./src/pages/admin-dashboard";
import DriverLayout from "./src/layouts/driver-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/app",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "recommend",
        element: <RecommendedPage />,
      },
      {
        path: "travel",
        element: <TravelPage />,
      },
      {
        path: "komepage",
        element: <KomePage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },

  {
    path: "/private",
    element: <PrivateLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { index: true, element: <Navigate to="dashboard" replace /> },
    ],
  },

  {
    path: "/driver",
    element: <DriverLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { index: true, element: <Navigate to="" replace /> },
    ],
  },
]);
