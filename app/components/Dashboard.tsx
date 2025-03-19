"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // Added for more reliable path detection
import ActivityFeed from "./ActivityFeed";

const DashboardSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const pathname = usePathname(); // Using Next.js hook instead of manual tracking
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const refreshActivities = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return isMobile ? (
    /** MOBILE DASHBOARD */
    <nav
      className="bg-teal flex flex-col items-center py-4 px-6 w-full shadow-md"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      {/* Navigation Icons with Labels (Side-by-Side) */}
      <ul className="flex justify-around w-full py-2" role="list">
        <li role="listitem">
          <Link
            href="/"
            className={`flex items-center space-x-2 focus:ring-2 focus:ring-blue-300 rounded-md p-2 hover:bg-teal-600 transition-colors ${
              pathname === "/" ? "bg-teal-700/50" : ""
            }`}
            aria-label="Go to Home"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <img src="/assets/folder-solid.svg" alt="" className="h-6 w-6" />
            <span className="text-white text-sm">Home</span>
          </Link>
        </li>

        <li role="listitem">
          <Link
            href="/favorites"
            className={`flex items-center space-x-2 focus:ring-2 focus:ring-blue-300 rounded-md p-2 hover:bg-teal-600 transition-colors ${
              pathname === "/favorites" ? "bg-teal-700/50" : ""
            }`}
            aria-label="Go to Favorites"
            aria-current={pathname === "/favorites" ? "page" : undefined}
          >
            <img src="/assets/star-solid.svg" alt="" className="h-6 w-6" />
            <span className="text-white text-sm">Favorites</span>
          </Link>
        </li>

        <li role="listitem">
          <Link
            href="/watch-later"
            className={`flex items-center space-x-2 focus:ring-2 focus:ring-blue-300 rounded-md p-2 hover:bg-teal-600 transition-colors ${
              pathname === "/watch-later" ? "bg-teal-700/50" : ""
            }`}
            aria-label="Go to Watch Later"
            aria-current={pathname === "/watch-later" ? "page" : undefined}
          >
            <img src="/assets/clock-solid.svg" alt="" className="h-6 w-6" />
            <span className="text-white text-sm">Watch Later</span>
          </Link>
        </li>
      </ul>
    </nav>
  ) : (
    /** DESKTOP SIDEBAR */
    <aside
      ref={sidebarRef}
      className="bg-teal h-full min-h-screen flex flex-col transition-all duration-300 ease-in-out w-20 hover:w-64 overflow-y-auto shadow-md"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      role="navigation"
      aria-label="Sidebar Navigation"
      aria-expanded={isExpanded}
    >
      {/* Sidebar Links */}
      <ul className="flex flex-col space-y-6 px-5 pt-5" role="list">
        <li role="listitem">
          <Link
            href="/"
            className={`flex items-center focus:ring-2 focus:ring-blue-300 rounded-md p-2 hover:bg-teal-600 transition-colors ${
              pathname === "/" ? "bg-teal-700/50" : ""
            }`}
            aria-label="Go to Home"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <img src="/assets/folder-solid.svg" alt="" className="h-6 w-6" />
            {isExpanded && <span className="ml-3 text-white">Home</span>}
          </Link>
        </li>

        <li role="listitem">
          <Link
            href="/favorites"
            className={`flex items-center focus:ring-2 focus:ring-blue-300 rounded-md p-2 hover:bg-teal-600 transition-colors ${
              pathname === "/favorites" ? "bg-teal-700/50" : ""
            }`}
            aria-label="Go to Favorites"
            aria-current={pathname === "/favorites" ? "page" : undefined}
          >
            <img src="/assets/star-solid.svg" alt="" className="h-6 w-6" />
            {isExpanded && <span className="ml-3 text-white">Favorites</span>}
          </Link>
        </li>

        <li role="listitem">
          <Link
            href="/watch-later"
            className={`flex items-center focus:ring-2 focus:ring-blue-300 rounded-md p-2 hover:bg-teal-600 transition-colors ${
              pathname === "/watch-later" ? "bg-teal-700/50" : ""
            }`}
            aria-label="Go to Watch Later"
            aria-current={pathname === "/watch-later" ? "page" : undefined}
          >
            <img src="/assets/clock-solid.svg" alt="" className="h-6 w-6" />
            {isExpanded && <span className="ml-3 text-white">Watch Later</span>}
          </Link>
        </li>
      </ul>

      {/* Add a subtle indicator when sidebar is collapsed */}
      {!isExpanded && (
        <div className="px-5 pt-3 opacity-50">
          <span className="text-white text-xs">→</span>
        </div>
      )}

      {/* Activity Feed (Only in expanded mode) */}
      {isExpanded && (
        <div className="flex-grow px-4 overflow-y-auto mt-4">
          <h2 className="text-white text-sm font-medium mb-2">Recent Activity</h2>
          <ActivityFeed refreshTrigger={refreshTrigger} />
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;