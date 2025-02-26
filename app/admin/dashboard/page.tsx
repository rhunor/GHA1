"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, User } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/properties");
        const data = await response.json();
        setPropertyCount(data.properties.length);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome back, {session?.user.name || "Admin"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                  Total Properties
                </p>
                {loading ? (
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {propertyCount}
                  </h2>
                )}
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Home className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/admin/properties"
                className="text-primary text-sm font-medium hover:underline"
              >
                View all properties
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                  Admin User
                </p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  1
                </h2>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <User className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/properties/new">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Add New Property
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Create a new property listing
                </p>
              </div>
            </Link>
            <Link href="/properties">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  View Public Site
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  See your website as visitors see it
                </p>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}