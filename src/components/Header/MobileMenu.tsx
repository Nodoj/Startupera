"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

interface MenuItem {
  id: number;
  title: string;
  path?: string;
  newTab?: boolean;
  submenu?: MenuItem[];
}

interface MobileMenuProps {
  menuData: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isAdmin: boolean;
  loading: boolean;
  openIndex: number;
  onSubmenuToggle: (index: number) => void;
}

const MobileMenu = ({
  menuData,
  isOpen,
  onClose,
  user,
  isAdmin,
  loading,
  openIndex,
  onSubmenuToggle,
}: MobileMenuProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-gray-dark shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Menu
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-dark dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Content - Scrollable */}
        <div className="overflow-y-auto h-[calc(100%-73px)] p-4">
          <nav>
            <ul className="space-y-1">
              {/* Navigation Links */}
              {menuData.map((menuItem, index) => (
                <li key={index}>
                  {menuItem.path ? (
                    <Link
                      href={menuItem.path}
                      className={`block py-3 px-4 text-base rounded-lg transition-colors ${
                        pathname === menuItem.path
                          ? "text-primary bg-primary/10 dark:text-white dark:bg-primary/20 font-medium"
                          : "text-dark hover:text-primary hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-gray-800"
                      }`}
                      onClick={onClose}
                    >
                      {menuItem.title}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => onSubmenuToggle(index)}
                        className="flex w-full items-center justify-between py-3 px-4 text-base text-dark hover:text-primary hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <span>{menuItem.title}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            openIndex === index ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openIndex === index && menuItem.submenu && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {menuItem.submenu.map((submenuItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                href={submenuItem.path || "#"}
                                className="block py-2 px-4 text-sm text-dark hover:text-primary hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={onClose}
                              >
                                {submenuItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              ))}

              {/* Divider */}
              <li className="my-4 border-t border-gray-200 dark:border-gray-700" />

              {/* Auth Section */}
              {!loading && (
                <>
                  {user ? (
                    <>
                      {/* Admin Dashboard */}
                      {isAdmin && (
                        <li>
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 py-3 px-4 text-base text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors font-medium"
                            onClick={onClose}
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                          </Link>
                        </li>
                      )}

                      {/* User Info */}
                      <li className="py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {user.email?.[0]?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark dark:text-white truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.role || "User"}
                            </p>
                          </div>
                        </div>
                      </li>

                      {/* Profile Links */}
                      <li>
                        <Link
                          href="/profile"
                          className="block py-3 px-4 text-base text-dark hover:text-primary hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={onClose}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className="block py-3 px-4 text-base text-dark hover:text-primary hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={onClose}
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full text-left py-3 px-4 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          onClick={() => {
                            // Add sign out logic here
                            onClose();
                          }}
                        >
                          Sign Out
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Guest Auth Links */}
                      <li>
                        <Link
                          href="/signin"
                          className="block py-3 px-4 text-base text-dark hover:text-primary hover:bg-gray-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors text-center"
                          onClick={onClose}
                        >
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/signup"
                          className="block py-3 px-4 text-base text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors text-center font-medium"
                          onClick={onClose}
                        >
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
