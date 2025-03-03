"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
// import Image from "next/image";

interface Property {
  _id: string;
  title: string;
  thumbnail: string;
  location: string;
  price: string;
  isBookable?: boolean;
}

export default function AvailabilityManagementPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/properties");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.status}`);
        }
        
        const data = await response.json();
        setProperties(data.properties);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Property Availability
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Select a property to manage its availability calendar
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse"
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Properties Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add property listings before managing availability.
            </p>
            <Link href="/admin/properties/new">
              <button className="bg-primary text-white px-4 py-2 rounded-md inline-flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Add Your First Property
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 relative">
                  <img
                    src={property.thumbnail}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg truncate">
                      {property.title}
                    </h3>
                    <p className="text-white/80 text-sm truncate">
                      {property.location}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Status: {" "}
                        <span className={property.isBookable === false ? "text-red-500" : "text-green-500"}>
                          {property.isBookable === false ? "Unavailable" : "Available for booking"}
                        </span>
                      </p>
                    </div>
                    <Link href={`/admin/properties/edit/${property._id}?tab=availability`}>
                      <button className="bg-primary text-white px-3 py-1.5 rounded text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Manage
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}