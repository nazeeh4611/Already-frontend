import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2, X, MapPin, Calendar, Award, ChevronLeft, ChevronRight, MessageCircle, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../Base/Base';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const configs = {
    success: { bg: 'from-emerald-500 to-emerald-600', icon: <Check className="w-5 h-5" /> },
    error: { bg: 'from-red-500 to-red-600', icon: <AlertCircle className="w-5 h-5" /> },
    info: { bg: 'from-[#1846ca] to-[#2a5ae0]', icon: <AlertCircle className="w-5 h-5" /> },
  };
  const c = configs[type] || configs.info;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-gradient-to-r ${c.bg} text-white backdrop-blur-sm border border-white/20`}>
        {c.icon}
        <span className="text-sm font-semibold">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-blue-100">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Review</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const EditReviewModal = ({ review, onClose, onSubmit, showToast }) => {
  const [rating, setRating] = useState(review.rating);
  const [reviewText, setReviewText] = useState(review.review);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [categories, setCategories] = useState({
    cleanliness: review.categories?.cleanliness || 0,
    accuracy: review.categories?.accuracy || 0,
    checkIn: review.categories?.checkIn || 0,
    communication: review.categories?.communication || 0,
    location: review.categories?.location || 0,
    value: review.categories?.value || 0
  });
  const [hoveredCategory, setHoveredCategory] = useState({});

  const categoryLabels = {
    cleanliness: 'Cleanliness',
    accuracy: 'Accuracy',
    checkIn: 'Check-in',
    communication: 'Communication',
    location: 'Location',
    value: 'Value'
  };

  const handleSubmit = () => {
    if (rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }
    
    const finalCategories = { ...categories };
    Object.keys(finalCategories).forEach(key => {
      if (finalCategories[key] === 0) {
        finalCategories[key] = rating;
      }
    });
    
    onSubmit(review._id, rating, reviewText, finalCategories);
  };

  const renderStars = (count, onHover, onLeave, onClick, hoveredValue) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => onClick(star)}
        onMouseEnter={() => onHover(star)}
        onMouseLeave={() => onLeave()}
        className="transition-transform hover:scale-110 focus:outline-none"
        type="button"
      >
        <Star
          className={`w-8 h-8 ${
            star <= (hoveredValue || count)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Your Review</h3>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h4 className="text-lg font-bold text-gray-900 mb-1">{review.property?.title}</h4>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-[#1846ca]" />
            <span className="text-sm">{review.property?.location}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {renderStars(
              rating,
              setHoveredRating,
              () => setHoveredRating(0),
              setRating,
              hoveredRating
            )}
            {rating > 0 && (
              <span className="ml-3 text-lg font-bold text-[#1846ca]">
                {rating} / 5
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">
            Category Ratings (Optional)
          </label>
          <div className="space-y-4 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
            {Object.keys(categories).map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 w-32">
                  {categoryLabels[category]}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCategories({ ...categories, [category]: star })}
                      onMouseEnter={() => setHoveredCategory({ ...hoveredCategory, [category]: star })}
                      onMouseLeave={() => setHoveredCategory({ ...hoveredCategory, [category]: 0 })}
                      className="transition-transform hover:scale-110 focus:outline-none"
                      type="button"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoveredCategory[category] || categories[category])
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {categories[category] > 0 && (
                  <span className="text-sm font-bold text-[#1846ca] w-16 text-right">
                    {categories[category]} / 5
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">
            Your Review (Optional)
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-5 py-4 border-2 border-blue-100 rounded-2xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
            rows="4"
            maxLength={1000}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {reviewText.length} / 1000 characters
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-2xl hover:from-[#1234a0] hover:to-[#1846ca] transition-all duration-300 font-bold shadow-lg"
          >
            Update Review
          </button>
          <button
            onClick={onClose}
            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${baseurl}user/user-reviews`, {
        params: { page, limit: 10 },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleUpdateReview = async (reviewId, rating, review, categories) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.put(
        `${baseurl}user/review/${reviewId}`,
        { rating, review, categories },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        showToast('Review updated successfully!', 'success');
        setEditingReview(null);
        fetchReviews();
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to update review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.delete(
        `${baseurl}user/review/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        showToast('Review deleted successfully!', 'success');
        setConfirmDelete(null);
        fetchReviews();
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to delete review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 ${
          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="relative group">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this review? This action cannot be undone."
          onConfirm={() => handleDeleteReview(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSubmit={handleUpdateReview}
          showToast={showToast}
        />
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.08)' }}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">My Reviews</h2>
              <p className="text-sm text-gray-500">You have written {pagination.totalReviews || 0} reviews</p>
            </div>
          </div>

          {loading && reviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-20 h-20 mx-auto border-4 border-blue-100 border-t-[#1846ca] rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-gray-500 font-medium">Loading your reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                <Star className="w-12 h-12 text-[#1846ca]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500 mb-6">You haven't written any reviews yet.</p>
              <button 
                onClick={() => window.location.href = '/property'}
                className="px-8 py-4 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-xl hover:from-[#1234a0] hover:to-[#1846ca] transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {review.property?.title || 'Property'}
                          </h3>
                          <span className="px-3 py-1 bg-[#1846ca]/10 text-[#1846ca] text-xs font-bold rounded-full">
                            {review.property?.propertyType || 'Property'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-[#1846ca]" />
                            <span>{review.property?.location || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-[#1846ca]" />
                            <span>Reviewed {formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingReview(review)}
                          className="p-3 bg-white rounded-xl text-[#1846ca] hover:bg-[#1846ca] hover:text-white transition-all duration-200 shadow-sm"
                          title="Edit review"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(review._id)}
                          className="p-3 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">{renderStars(review.rating)}</div>
                        <span className="text-lg font-black text-[#1846ca]">
                          {review.rating}.0
                        </span>
                        <span className="text-sm text-gray-500">/ 5.0</span>
                      </div>
                    </div>

                    {review.review && (
                      <div className="mb-4 p-4 bg-white rounded-xl border border-blue-100">
                        <p className="text-gray-700 leading-relaxed">"{review.review}"</p>
                      </div>
                    )}

                    {review.categories && Object.values(review.categories).some(v => v > 0) && (
                      <div className="bg-white rounded-xl p-4 mt-4 border border-blue-100">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">
                          Category Ratings
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(review.categories).map(([key, value]) => {
                            if (value === 0) return null;
                            const labels = {
                              cleanliness: 'Cleanliness',
                              accuracy: 'Accuracy',
                              checkIn: 'Check-in',
                              communication: 'Communication',
                              location: 'Location',
                              value: 'Value'
                            };
                            return (
                              <div key={key} className="flex items-center justify-between bg-blue-50/50 px-3 py-2 rounded-xl">
                                <span className="text-xs text-gray-600">{labels[key]}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-bold text-[#1846ca]">{value}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {review.booking && (
                      <div className="mt-4 pt-4 border-t border-blue-200 flex items-center gap-2 text-xs text-gray-500">
                        <Award className="w-4 h-4 text-[#1846ca]" />
                        <span>Stayed: {formatDate(review.booking.checkIn)} - {formatDate(review.booking.checkOut)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-100 text-[#1846ca] rounded-xl hover:border-[#1846ca] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 ${
                              page === pageNum
                                ? 'bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white shadow-lg'
                                : 'bg-white border-2 border-blue-100 text-gray-700 hover:border-[#1846ca] hover:text-[#1846ca]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === page - 2 ||
                        pageNum === page + 2
                      ) {
                        return (
                          <span key={pageNum} className="w-10 text-center text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-100 text-[#1846ca] rounded-xl hover:border-[#1846ca] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyReviews;