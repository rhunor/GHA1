import React, { useState, useEffect } from "react";
import { Star, StarHalf, MessageSquare, Award, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedStay: boolean;
}

interface PropertyReviewsProps {
  propertyId: string;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    bookingReference: "",
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?propertyId=${propertyId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
      } catch (error) {
        console.error("Error:", error);
        setError("Unable to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  // Set visible reviews based on showAllReviews state
  useEffect(() => {
    if (reviews.length === 0) return;
    
    if (showAllReviews) {
      setVisibleReviews(reviews);
    } else {
      // Show only the first 3 reviews
      setVisibleReviews(reviews.slice(0, 3));
    }
  }, [reviews, showAllReviews]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const data = await response.json();

      setFormData({
        name: "",
        email: "",
        rating: 5,
        comment: "",
        bookingReference: "",
      });

      setSuccessMessage(data.message);
      setShowReviewForm(false);

      if (data.review.status === "approved") {
        setReviews((prevReviews) => [data.review, ...prevReviews]);

        if (avgRating !== null) {
          const totalRating = avgRating * reviews.length + data.review.rating;
          setAvgRating(parseFloat((totalRating / (reviews.length + 1)).toFixed(1)));
        } else {
          setAvgRating(data.review.rating);
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="h-5 w-5 md:h-6 md:w-6 mr-2 text-primary flex-shrink-0" />
            Guest Reviews
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-3 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
            
            <Link 
              href={`/reviews?propertyId=${propertyId}`}
              className="px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              Review Page
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {avgRating !== null && (
          <div className="flex flex-wrap items-center mb-6">
            <div className="flex items-center mr-3 mb-2 md:mb-0">{renderStars(avgRating)}</div>
            <span className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mr-2">{avgRating}</span>
            <span className="text-gray-500 dark:text-gray-400">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-100 text-green-700 rounded-md"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-100 text-red-700 rounded-md"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showReviewForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Share Your Experience
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Booking Reference (optional)
                </label>
                <input
                  type="text"
                  name="bookingReference"
                  value={formData.bookingReference}
                  onChange={handleInputChange}
                  placeholder="Enter your booking reference for verified review"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  If you&apos;ve stayed with us, add your booking reference for a verified review that will be published immediately.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-white"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                  <div className="flex">{renderStars(formData.rating)}</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Review
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-white"
                  placeholder="Tell us about your experience..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90"
                >
                  Submit Review
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No reviews yet. Be the first to share your experience!
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Write a Review
            </button>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {visibleReviews.map((review) => (
                <li key={review._id} className="py-4 md:py-6">
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="flex items-start mb-2 md:mb-0 md:mr-6 md:w-48">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap">
                          <h4 className="font-medium text-gray-900 dark:text-white mr-2">{review.name}</h4>
                          {review.isVerifiedStay && (
                            <span className="mt-1 md:mt-0 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                              <Award className="h-3 w-3 mr-1" />
                              Verified Stay
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex mr-2">{renderStars(review.rating)}</div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 mt-2 md:mt-0">
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {reviews.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyReviews;