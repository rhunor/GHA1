//app/admin/properties/new/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Plus } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([""]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    price: "",
    location: "",
    airbnbLink: "",
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      size: "",
      type: "apartment",
    },
  });

  // For new property page
const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "specifications") {
        setFormData((prev) => ({
          ...prev,
          specifications: {
            ...prev.specifications,
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const updatedFeatures = [...features];
      updatedFeatures.splice(index, 1);
      setFeatures(updatedFeatures);
    }
  };

  const addImage = () => {
    setImages([...images, ""]);
  };

  const removeImage = (index: number) => {
    if (images.length > 1) {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Filter out empty strings from features and images
    const filteredFeatures = features.filter((feature) => feature.trim() !== "");
    const filteredImages = images.filter((image) => image.trim() !== "");

    if (filteredImages.length === 0) {
      setError("Please add at least one image URL");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          features: filteredFeatures,
          images: filteredImages,
          thumbnail: filteredImages[0], // Use the first image as thumbnail if not set
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create property");
      }

      // Redirect to properties list on success
      router.push("/admin/properties");
      router.refresh();
    } catch (error) {
      console.error("Error creating property:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create property. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/properties"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Add New Property
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (e.g. ₦200,000/night) *
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="₦200,000/night"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Lekki Phase 1, Lagos"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Airbnb Link
  </label>
  <input
    type="url"
    name="airbnbLink"
    value={formData.airbnbLink}
    onChange={handleInputChange}
    placeholder="https://www.airbnb.com/rooms/123456789"
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
  />
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Type *
              </label>
              <select
                name="specifications.type"
                value={formData.specifications.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="duplex">Duplex</option>
                <option value="terrace">Terrace</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Bedrooms *
              </label>
              <input
                type="number"
                name="specifications.bedrooms"
                value={formData.specifications.bedrooms}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Bathrooms *
              </label>
              <input
                type="number"
                name="specifications.bathrooms"
                value={formData.specifications.bathrooms}
                onChange={handleInputChange}
                required
                min="0.5"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Size *
              </label>
              <input
                type="text"
                name="specifications.size"
                value={formData.specifications.size}
                onChange={handleInputChange}
                required
                placeholder="250 sq.m"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Images *
              </label>
              <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Another Image
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Enter full URLs to images. The first image will be used as the thumbnail.
            </p>
            {images.map((image, index) => (
              <div key={index} className="flex mb-2 gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={index === 0 ? "Thumbnail image URL" : `Image ${index + 1} URL`}
                  className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={images.length === 1}
                  className={`p-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 ${
                    images.length === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Features
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </button>
            </div>
            {features.map((feature, index) => (
              <div key={index} className="flex mb-2 gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  disabled={features.length === 1}
                  className={`p-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 ${
                    features.length === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Link href="/admin/properties">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                "Create Property"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}