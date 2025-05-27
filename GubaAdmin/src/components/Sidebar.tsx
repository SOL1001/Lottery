import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import CollectionsIcon from "@mui/icons-material/Collections";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FocusTrap from "focus-trap-react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BarChartIcon from "@mui/icons-material/BarChart";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<{
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}> = ({ isOpen, toggleSidebar, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { path: "/dashboard", label: "Draw Management", icon: <EmojiEventsIcon /> },
    // { path: "/draws", label: "Draw Management", icon: <EmojiEventsIcon /> },
    { path: "/list", label: "Add Ticket Sales", icon: <ReceiptIcon /> },
    { path: "/winners", label: "Winners", icon: <MonetizationOnIcon /> },
    { path: "/players", label: "Players", icon: <PeopleIcon /> },
    // { path: "/reports", label: "Reports", icon: <BarChartIcon /> },
    // { path: "/support", label: "Support", icon: <SupportAgentIcon /> },
  ];

  const handleCollapseToggle = () => {
    if (window.innerWidth >= 768) {
      setCollapsed(!collapsed);
    }
  };

  const handleNavLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
      if (touchStartX - touchEndX > 50) {
        toggleSidebar();
      }
    };

    const sidebar = document.querySelector("aside");
    if (sidebar) {
      sidebar.addEventListener("touchstart", handleTouchStart);
      sidebar.addEventListener("touchmove", handleTouchMove);
      sidebar.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("touchstart", handleTouchStart);
        sidebar.removeEventListener("touchmove", handleTouchMove);
        sidebar.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isOpen, toggleSidebar]);

  return (
    <>
      {/* Mobile toggle button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed z-20 bottom-4 left-4 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      )}

      <FocusTrap active={isOpen && window.innerWidth < 768}>
        <aside
          role="complementary"
          aria-expanded={isOpen}
          className={`fixed z-30 inset-y-0 left-0 ${
            collapsed ? "w-20" : "w-full md:w-64"
          } bg-gradient-to-b from-purple-800 to-indigo-900 text-white transition-all duration-300 ease-in-out transform ${
            isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          } md:relative md:translate-x-0 h-screen`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              {!collapsed && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xl">L</span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold">LOTTO PRO</h1>
                    <p className="text-xs opacity-80">Admin Console</p>
                  </div>
                </div>
              )}
              {collapsed && (
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold text-xl">L</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {isOpen && window.innerWidth < 768 && (
                  <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-md hover:bg-white/10 focus:outline-none transition-colors md:hidden"
                    aria-label="Close sidebar"
                  >
                    <MenuIcon />
                  </button>
                )}
                <button
                  onClick={handleCollapseToggle}
                  className="p-1 rounded-md hover:bg-white/10 focus:outline-none transition-colors hidden md:block"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav role="navigation" className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-2 px-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={handleNavLinkClick}
                      onMouseEnter={() => setActiveHover(item.path)}
                      onMouseLeave={() => setActiveHover(null)}
                      className={({ isActive }) =>
                        `flex items-center p-3 ${
                          collapsed ? "justify-center" : ""
                        } rounded-lg text-sm font-medium transition-all relative overflow-hidden group ${
                          isActive
                            ? "bg-white/20 text-white shadow-md"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`
                      }
                      title={collapsed ? item.label : ""}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <span
                        className={`transition-transform ${
                          collapsed ? "" : "mr-3"
                        } ${
                          (activeHover === item.path || collapsed) &&
                          "transform group-hover:scale-110"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="flex-1">{item.label}</span>
                      )}
                      {!collapsed && (
                        <span className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRightIcon fontSize="small" />
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/20 mt-auto">
              <button
                onClick={onLogout}
                onMouseEnter={() => setActiveHover("logout")}
                onMouseLeave={() => setActiveHover(null)}
                className={`w-full flex items-center ${
                  collapsed ? "justify-center" : "justify-between"
                } p-3 rounded-lg text-white/90 hover:bg-white/10 transition-colors group`}
                title={collapsed ? "Log Out" : ""}
                aria-label="Log out"
              >
                {!collapsed && <span>Log Out</span>}
                <LogoutIcon
                  className={`${
                    collapsed ? "" : "text-lg"
                  } transition-transform ${
                    activeHover === "logout" &&
                    "transform group-hover:scale-110"
                  }`}
                />
              </button>
              {!collapsed && window.innerWidth >= 768 && (
                <p className="text-xs text-white/60 mt-2 text-center">
                  © {new Date().getFullYear()} Lottery Pro Admin
                </p>
              )}
            </div>
          </div>
        </aside>
      </FocusTrap>
    </>
  );
};

export default Sidebar;
