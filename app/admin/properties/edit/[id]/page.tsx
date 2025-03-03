"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X, Plus, Calendar, MessageSquare, Check } from "lucide-react";
import Link from "next/link";
import AvailabilityManager from "@/components/admin/AvailabilityManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropertyData {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  location: string;
  airbnbLink?: string;
  images: string[];
  features: string[];
  specifications: {
    bedrooms: number;
    bathrooms: number;
    size: string;
    type: string;
  };
}

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedStay: boolean;
  createdAt: string;
}

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  reference: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  paymentStatus: string;
  createdAt: Date;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

    

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([""]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState<PropertyData>({
    _id: "",
    title: "",
    description: "",
    thumbnail: "",
    price: "",
    location: "",
    airbnbLink: "",
    images: [],
    features: [],
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      size: "",
      type: "apartment",
    },
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch property");
        }
        
        const data = await response.json();
        setFormData(data.property);
        setFeatures(data.property.features.length > 0 ? data.property.features : [""]);
        setImages(data.property.images.length > 0 ? data.property.images : [""]);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Failed to load property details. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    // Fetch bookings
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?propertyId=${propertyId}&status=completed`);
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    // Fetch reviews
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?propertyId=${propertyId}`);
        
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (propertyId) {
      fetchProperty();
      fetchBookings();
      fetchReviews();
    }
  }, [propertyId]);

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
            [child]: child === "bedrooms" || child === "bathrooms" 
              ? Number(value)
              : value,
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
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "PUT",
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
        throw new Error(errorData.message || "Failed to update property");
      }

      // Redirect to properties list on success
      router.push("/admin/properties");
      router.refresh();
    } catch (error) {
      console.error("Error updating property:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update property. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle review status update
  const handleReviewStatusUpdate = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review status');
      }

      // Update local state
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, status: newStatus } : review
      ));
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Failed to update review status');
    }
  };

  // Handle review deletion
  const handleReviewDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Remove from local state
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Manage Property: {formData.title}
        </h1>

        <Tabs defaultValue="details" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="details" className="flex items-center">
              <span className="mr-1">Details</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Availability</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Reviews {reviews.length > 0 && `(${reviews.length})`}</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center">
              <span>Bookings {bookings.length > 0 && `(${bookings.length})`}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
                    value={formData.airbnbLink || ""}
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
                      Updating...
                    </div>
                  ) : (
                    "Update Property"
                  )}
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilityManager propertyId={propertyId} />
          </TabsContent>

          <TabsContent value="reviews">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Manage Reviews
              </h2>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No reviews yet for this property.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Reviewer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Rating
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Comment
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {reviews.map((review) => (
                        <tr key={review._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {review.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {review.email}
                              </div>
                              {review.isVerifiedStay && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Verified Stay
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900 dark:text-white mr-1">
                                {review.rating}
                              </span>
                              <span className="text-yellow-400">★</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                              {review.comment}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              review.status === 'approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : review.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {review.status !== 'approved' && (
                                <button
                                  onClick={() => handleReviewStatusUpdate(review._id, 'approved')}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  title="Approve"
                                >
                                  <Check className="h-5 w-5" />
                                </button>
                              )}
                              {review.status !== 'rejected' && (
                                <button
                                  onClick={() => handleReviewStatusUpdate(review._id, 'rejected')}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Reject"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleReviewDelete(review._id)}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                title="Delete"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Booking History
              </h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No bookings yet for this property.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Guest
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Reference
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Check-out
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Guests
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Booked On
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {booking.email}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {booking.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {booking.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {booking.guests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.paymentStatus === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : booking.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}