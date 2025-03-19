"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ActivityFeed from "./ActivityFeed";

const DashboardSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPath, setCurrentPath] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    setCurrentPath(window.location.pathname);

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
            className="flex items-center space-x-2 focus:ring-2 focus:ring-white rounded-md p-2"
            aria-label="Go to Home"
            aria-current={currentPath === "/" ? "page" : undefined}
          >
            <img src="/assets/folder-solid.svg" alt="" className="h-6 w-6" />
            <span className="text-white text-sm">Home</span>
          </Link>
        </li>

        <li role="listitem">
          <Link
            href="/favorites"
            className="flex items-center space-x-2 focus:ring-2 focus:ring-white rounded-md p-2"
            aria-label="Go to Favorites"
            aria-current={currentPath === "/favorites" ? "page" : undefined}
          >
            <img src="/assets/star-solid.svg" alt="" className="h-6 w-6" />
            <span className="text-white text-sm">Favorites</span>
          </Link>
        </li>

        <li role="listitem">
          <Link
            href="/watch-later"
            className="flex items-center space-x-2 focus:ring-2 focus:ring-white rounded-md p-2"
            aria-label="Go to Watch Later"
            aria-current={currentPath === "/watch-later" ? "page" : undefined}
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
      className="bg-teal h-full min-h-screen flex flex-col transition-all duration-300 w-16 hover:w-64 overflow-y-auto shadow-md"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      role="navigation"
      aria-label="Sidebar Navigation"
      aria-expanded={isExpanded}
    >
      {/* Sidebar Links */}
      <ul className="flex flex-col space-y-6 pl-1 pr-0 pt-5" role="list">
        <li role="listitem">
          <Link
            href="/"
            className="flex items-center justify-center focus:ring-2 focus:ring-blue-300 rounded-md py-2 px-1"
            aria-label="Go to Home"
            aria-current={currentPath === "/" ? "page" : undefined}
          >
            <img src="/assets/folder-solid.svg" alt="" className="h-6 w-6" />
            {isExpanded && <span className="ml-3 text-white">Home</span>}
          </Link>
        </li>

        <li role="listitem">
          <Link
            href="/favorites"
            className="flex items-center justify-center focus:ring-2 focus:ring-blue-300 rounded-md py-2 px-1"
            aria-label="Go to Favorites"
            aria-current={currentPath === "/favorites" ? "page" : undefined}
          >
            <img src="/assets/star-solid.svg" alt="" className="h-6 w-6" />
            {isExpanded && <span className="ml-3 text-white">Favorites</span>}
          </Link>
        </li>

        <li role="listitem">
          <Link
            href="/watch-later"
            className="flex items-center justify-center focus:ring-2 focus:ring-blue-300 rounded-md py-2 px-1"
            aria-label="Go to Watch Later"
            aria-current={currentPath === "/watch-later" ? "page" : undefined}
          >
            <img src="/assets/clock-solid.svg" alt="" className="h-6 w-6" />
            {isExpanded && <span className="ml-3 text-white">Watch Later</span>}
          </Link>
        </li>
      </ul>

      {/* Activity Feed (Only in expanded mode) */}
      {isExpanded && (
        <div className="flex-grow px-4 overflow-y-auto">
          <ActivityFeed refreshTrigger={refreshTrigger} />
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;