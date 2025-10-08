"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import Button from "@/components/Common/Button";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";
import { useUser } from "@/hooks/useUser";
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";

const Header = () => {
  const { user, loading } = useUser();
  
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-9999 bg-white/80 backdrop-blur-xs transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex-shrink-0 px-3 sm:px-4 w-auto">
              <Link
                href="/"
                className={`header-logo block ${
                  sticky ? "py-3 sm:py-5 lg:py-2" : "py-5 sm:py-8"
                } `}
              >
                <Image
                  src="/images/logo/logo-2.svg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="w-[140px] sm:w-[140px] lg:w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo.svg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden w-[140px] sm:w-[140px] lg:w-full dark:block"
                />
              </Link>
            </div>

            {/* Navigation Menu - Center */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <nav
                id="navbarCollapse"
                className="navbar lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100"
              >
                <ul className="block lg:flex lg:space-x-8">
                  {menuData.map((menuItem, index) => (
                    <li key={index} className="group relative">
                      {menuItem.path ? (
                        <Link
                          href={menuItem.path}
                          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            usePathName === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <>
                          <p
                            onClick={() => handleSubmenu(index)}
                            className="text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 dark:text-white/70 dark:group-hover:text-white"
                          >
                            {menuItem.title}
                            <span className="pl-3">
                              <svg width="25" height="24" viewBox="0 0 25 24">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </p>
                          <div
                            className={`submenu dark:bg-dark relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                              openIndex === index ? "block" : "hidden"
                            }`}
                          >
                            {menuItem.submenu.map((submenuItem, index) => (
                              <Link
                                href={submenuItem.path}
                                key={index}
                                className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                              >
                                {submenuItem.title}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                  
                  {/* Mobile Auth Links */}
                  {!loading && (
                    <li className="lg:hidden">
                      {user ? (
                        <>
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-2 py-2 text-base text-purple-600 dark:text-purple-400 hover:text-primary"
                              onClick={() => setNavbarOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Link>
                          )}
                          <Link
                            href="/profile"
                            className="flex py-2 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            onClick={() => setNavbarOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            href="/settings"
                            className="flex py-2 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            onClick={() => setNavbarOpen(false)}
                          >
                            Settings
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/signin"
                            className="flex py-2 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            onClick={() => setNavbarOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/signup"
                            className="flex py-2 text-base text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80"
                            onClick={() => setNavbarOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </li>
                  )}
                </ul>
              </nav>
            </div>

            {/* Auth & Theme - Right */}
            <div className="flex items-center gap-1 px-2 sm:gap-2 sm:px-4 lg:gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="ring-primary block rounded-lg p-1.5 sm:p-2 focus:ring-2 lg:hidden"
              >
                <span
                  className={`relative my-1 block h-0.5 w-[24px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "top-[6px] rotate-45" : " "
                  }`}
                />
                <span
                  className={`relative my-1 block h-0.5 w-[24px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "opacity-0" : " "
                  }`}
                />
                <span
                  className={`relative my-1 block h-0.5 w-[24px] bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "top-[-6px] -rotate-45" : " "
                  }`}
                />
              </button>
              
              {!loading && (
                <>
                  {user ? (
                    <>
                      {/* Dashboard Button for Admins */}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="hidden md:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/30 dark:hover:bg-primary/30 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      
                      {/* Profile Dropdown */}
                      <ProfileDropdown user={user} />
                    </>
                  ) : (
                    <>
                      {/* Auth buttons for guests - Desktop only */}
                      <Link
                        href="/signin"
                        className="hidden lg:flex items-center gap-2 px-4 py-2 text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary transition-colors"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                      <div className="hidden lg:block">
                        <Button
                          href="/signup"
                          variant="primary"
                          size="sm"
                          className="items-center gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          Sign Up
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
              
              <ThemeToggler />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Component */}
      <MobileMenu
        menuData={menuData}
        isOpen={navbarOpen}
        onClose={() => setNavbarOpen(false)}
        user={user}
        isAdmin={isAdmin}
        loading={loading}
        openIndex={openIndex}
        onSubmenuToggle={handleSubmenu}
      />
    </>
  );
};

export default Header;
