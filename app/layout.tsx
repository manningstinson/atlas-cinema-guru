import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Header from "./components/Header";
import DashboardSidebar from "./components/Dashboard";
import "./global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className="overflow-x-hidden"
      suppressHydrationWarning
    >
      <head>
        <title>Cinema Guru</title>
        <meta
          name="description"
          content="Discover movies, save them to your watchlist, and mark your favorites with Cinema Guru."
        />
      </head>

      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          {/* Skip Link for Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-midnightBlue px-3 py-2 rounded-md"
          >
            Skip to main content
          </a>

          <Header />

          {/* Layout Wrapper: Mobile Stack, Sidebar in Desktop */}
          <div className="flex flex-col md:flex-row flex-grow bg-midnightBlue min-h-screen">
            {/* Dashboard (Below header in mobile, sidebar in desktop) */}
            <div className="w-full md:w-auto md:min-h-screen">
              <DashboardSidebar />
            </div>

            {/* Main Content */}
            <main
              id="main-content"
              className="flex-grow min-h-screen overflow-y-auto px-4 md:px-6"
              role="main"
              aria-labelledby="page-title"
            >
              <h1 id="page-title" className="sr-only">
                Cinema Guru
              </h1>
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
