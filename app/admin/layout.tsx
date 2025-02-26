"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Building, Home, LogOut, Menu, PlusCircle } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Redirect if not authenticated and not on login page
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [status, router, isLoginPage]);

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <Building className="animate-pulse h-16 w-16 text-primary dark:text-white" />
        </div>
      </div>
    );
  }

  // Only render dashboard layout for authenticated users
  if (status === "authenticated" && session?.user.isAdmin) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed z-50 top-4 left-4 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
        </button>

        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-40 lg:z-0 w-64 bg-white dark:bg-gray-800 shadow-lg lg:shadow-none`}
        >
          <div className="p-6 h-full flex flex-col">
            <Link href="/">
              <div className="h-16 w-auto shrink-0 mb-8">
                <Image
                  width={200}
                  height={50}
                  src="/logo.png"
                  alt="Gifted Homes and Apartments"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            <div className="space-y-1 mb-6">
              <Link href="/admin/dashboard">
                <div
                  className={`flex items-center p-3 rounded-md ${
                    pathname === "/admin/dashboard"
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Building className="h-5 w-5 mr-3" />
                  <span>Dashboard</span>
                </div>
              </Link>

              <Link href="/admin/properties">
                <div
                  className={`flex items-center p-3 rounded-md ${
                    pathname.includes("/admin/properties") && !pathname.includes("/admin/properties/new")
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Home className="h-5 w-5 mr-3" />
                  <span>Properties</span>
                </div>
              </Link>

              <Link href="/admin/properties/new">
                <div
                  className={`flex items-center p-3 rounded-md ${
                    pathname === "/admin/properties/new"
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <PlusCircle className="h-5 w-5 mr-3" />
                  <span>Add Property</span>
                </div>
              </Link>
            </div>

            <div className="mt-auto">
              <Link href="/api/auth/signout">
                <div className="flex items-center p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    );
  }

  return null;
}