import { FiLogOut } from "react-icons/fi";
import { auth, signOut } from "@/auth";
import Image from "next/image";

const Header = async () => {
  const session = await auth();

  return (
    <header className="bg-mintyTeal h-20 md:h-16 w-full flex items-center justify-between px-4 md:px-5 text-midnightBlue shadow-md">
      {/* Left Section: Logo & Title */}
      <div className="flex items-center space-x-2">
        <Image
          src="/assets/film.svg"
          alt="Cinema Guru Logo"
          width={36}
          height={36}
          priority
        />
        <h1 className="text-lg md:text-2xl font-bold">Cinema Guru</h1>
      </div>

      {/* Right Section: Email (Desktop Only) & Logout Button */}
      <div className="flex items-center space-x-4">
        {session?.user ? (
          <>
            {/* Hide Email on Mobile, Show on Desktop */}
            <span className="hidden md:inline" aria-live="polite">
              Welcome, {session.user.email}
            </span>

            {/* Logout Button */}
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="flex items-center space-x-2 text-midnightBlue-500 hover:text-midnightBlue-700 transition focus:ring-2 focus:ring-midnightBlue-300 rounded-md px-3 py-2"
                aria-label="Logout"
              >
                <FiLogOut className="h-6 w-6" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </form>
          </>
        ) : (
          <span aria-live="polite">Loading...</span>
        )}
      </div>
    </header>
  );
};

export default Header;
