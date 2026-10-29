import React, { useState, useEffect } from "react";
import { Award, ArrowUpRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { StarDisplay, StarInput } from "@/components/site/StarRating";

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section aria-labelledby="reviews-title">
      <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Guest reviews</p>
          <h2 id="reviews-title" className="display mt-3 text-4xl md:text-5xl">What guests say</h2>
          {avgRating !== null && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="font-marcellus text-3xl">{avgRating}</span>
              <StarDisplay rating={avgRating} />
              <span className="text-sm text-muted">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className={showReviewForm ? "btn-ghost" : "btn-clay"}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
          <Link href={`/reviews?propertyId=${propertyId}`} className="btn-ghost">
            Review Page <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="status"
            className="mt-6 rounded-2xl border border-[#1F8F55]/25 bg-[#1F8F55]/10 p-4 text-[#17663D] dark:text-[#7FD3A5]"
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
            role="alert"
            className="mt-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-red-700 dark:text-red-300"
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
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="card mt-8 space-y-5 p-6 md:p-8">
              <h3 className="display text-2xl">Share Your Experience</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="pr-name" className="field-label">Your Name</label>
                  <input id="pr-name" type="text" name="name" value={formData.name} onChange={handleInputChange} required className="field" />
                </div>
                <div>
                  <label htmlFor="pr-email" className="field-label">Email</label>
                  <input id="pr-email" type="email" name="email" value={formData.email} onChange={handleInputChange} required className="field" />
                </div>
              </div>

              <div>
                <label htmlFor="pr-ref" className="field-label">Booking Reference (optional)</label>
                <input
                  id="pr-ref"
                  type="text"
                  name="bookingReference"
                  value={formData.bookingReference}
                  onChange={handleInputChange}
                  placeholder="e.g. GHA_123456789"
                  className="field"
                />
                <p className="mt-1.5 text-xs text-muted">
                  If you&apos;ve stayed with us, add your booking reference for a verified review that will be published immediately.
                </p>
              </div>

              <div>
                <span className="field-label">Rating</span>
                <StarInput
                  name="property-rating"
                  value={formData.rating}
                  onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
                />
              </div>

              <div>
                <label htmlFor="pr-comment" className="field-label">Your Review</label>
                <textarea
                  id="pr-comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="field"
                  placeholder="Tell us about your experience..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-clay">Submit Review</button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-3xl bg-fg/5" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <Quote className="h-8 w-8 text-clay/50" />
            <p className="mt-4 max-w-sm text-muted">
              No reviews yet. Be the first to share your experience!
            </p>
            <button onClick={() => setShowReviewForm(true)} className="btn-clay mt-6">
              Write a Review
            </button>
          </div>
        ) : (
          <>
            <ul className="grid gap-4 md:grid-cols-2">
              {visibleReviews.map((review, i) => (
                <motion.li
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
                  className="card flex flex-col p-6 md:p-7"
                >
                  <StarDisplay rating={review.rating} />
                  <p className="mt-4 flex-1 leading-relaxed text-fg/90">&ldquo;{review.comment}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay/10 font-marcellus text-lg text-clay">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{review.name}</p>
                      <p className="text-xs text-muted">{formatDate(review.createdAt)}</p>
                    </div>
                    {review.isVerifiedStay && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#1F8F55]/10 px-2.5 py-1 text-xs text-[#17663D] dark:text-[#7FD3A5]">
                        <Award className="h-3 w-3" />
                        Verified Stay
                      </span>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>

            {reviews.length > 3 && (
              <div className="mt-8 text-center">
                <button onClick={() => setShowAllReviews(!showAllReviews)} className="btn-ghost">
                  {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PropertyReviews;