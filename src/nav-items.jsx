import { HomeIcon } from "lucide-react";
import CheckboxGridPage from "./pages/CheckboxGridPage.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <CheckboxGridPage />,
  },
];
