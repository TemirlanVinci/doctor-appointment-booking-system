import { createBrowserRouter } from "react-router";
import { Home } from "@/app/components/home";
import { DoctorProfile } from "@/app/components/doctor-profile";
import { AdminDashboard } from "@/app/components/admin-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/doctor/:id",
    Component: DoctorProfile,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
