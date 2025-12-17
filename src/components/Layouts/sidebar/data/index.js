import { HiHome } from "react-icons/hi";
import { FiCalendar, FiUser } from "react-icons/fi";
import { MdStorage, MdDashboard } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Home",
        url: "/home1",
        icon: HiHome,
        items: [],
      },
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: MdDashboard,
        items: [],
      },
      {
        title: "Active Donors",
        url: "/calendar",
        icon: FiCalendar,
        items: [],
      },
      {
        title: "Donor History",
        url: "/profile",
        icon: FiUser,
        items: [],
      },
      {
        title: "Semen Storage",
        icon: MdStorage,
        items: [
          {
            title: "Form Elements",
            url: "/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Add New Donor",
        url: "/tables",
        icon: FaPlus,
        items: [],
      },
    ],
  },
];
