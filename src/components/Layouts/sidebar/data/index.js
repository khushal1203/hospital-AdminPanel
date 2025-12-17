import { HiHome } from "react-icons/hi";
import { FiCalendar, FiUser } from "react-icons/fi";
import { MdStorage, MdDashboard, MdPeople, MdLocalHospital } from "react-icons/md";
import { FaPlus, FaUserMd, FaFlask, FaUsers } from "react-icons/fa";

// Navigation data for Admin role
const ADMIN_NAV = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: MdDashboard,
        items: [],
      },
      {
        title: "Active Donors",
        url: "/donors/active",
        icon: MdPeople,
        items: [],
      },
      {
        title: "Donors History",
        url: "/donors/history",
        icon: FiUser,
        items: [],
      },
      {
        title: "Semen Storage",
        url: "/storage",
        icon: MdStorage,
        items: [],
      },
      {
        title: "Add New Donor",
        url: "/donors/add",
        icon: FaPlus,
        items: [],
      },
      {
        title: "User Management",
        url: "/users",
        icon: FaUsers,
        items: [],
      },
    ],
  },
];

// Navigation data for Doctor role
const DOCTOR_NAV = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: MdDashboard,
        items: [],
      },
      {
        title: "Active Donors",
        url: "/donors/active",
        icon: MdPeople,
        items: [],
      },
      {
        title: "Donors History",
        url: "/donors/history",
        icon: FiUser,
        items: [],
      },
      {
        title: "Medical Reports",
        url: "/reports",
        icon: FaUserMd,
        items: [],
      },
    ],
  },
];

// Navigation data for Laboratory role
const LABORATORY_NAV = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: MdDashboard,
        items: [],
      },
      {
        title: "Semen Storage",
        url: "/storage",
        icon: MdStorage,
        items: [],
      },
      {
        title: "Lab Tests",
        url: "/lab-tests",
        icon: FaFlask,
        items: [],
      },
      {
        title: "Donors History",
        url: "/donors/history",
        icon: FiUser,
        items: [],
      },
    ],
  },
];

// Receptionist doesn't use sidebar navigation (uses card-based dashboard)
const RECEPTIONIST_NAV = [];

/**
 * Get navigation data based on user role
 * @param {string} role - User role
 * @returns {Array} Navigation data for the role
 */
export const getNavDataByRole = (role) => {
  switch (role) {
    case "admin":
      return ADMIN_NAV;
    case "doctor":
      return DOCTOR_NAV;
    case "laboratory":
      return LABORATORY_NAV;
    case "receptionist":
      return RECEPTIONIST_NAV;
    default:
      return ADMIN_NAV;
  }
};

// Export default for backward compatibility
export const NAV_DATA = ADMIN_NAV;

