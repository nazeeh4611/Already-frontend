import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Calendar, MapPin, Clock, Eye, EyeOff, Edit, Check, X, 
  Download, XCircle, ChevronDown, ChevronUp, Star, AlertCircle, 
  Award, Shield, Mail, Phone, Home, Bookmark, Heart, Settings, LogOut,
  Moon, Sun, Bell, CreditCard, FileText, HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Base/Base';
import logo from "../../assets/logo.png";
import Navbar from '../../Layout/Navbar';
import MyReviews from '../../Layout/MyReviews';

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

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-blue-100">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Cancellation</h3>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onConfirm}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg"
        >
          Yes, Cancel Booking
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-semibold"
        >
          No, Keep It
        </button>
      </div>
    </div>
  </div>
);

const CancelledBanner = () => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-red-800 font-semibold text-sm">This booking has been cancelled</p>
      <p className="text-red-600 text-xs mt-1">No charges will be applied for this booking</p>
    </div>
  </div>
);

const RatingModal = ({ booking, onClose, onSubmit, showToast }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [categories, setCategories] = useState({
    cleanliness: 0,
    accuracy: 0,
    checkIn: 0,
    communication: 0,
    location: 0,
    value: 0
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
      showToast('Please select an overall rating', 'error');
      return;
    }

    const finalCategories = { ...categories };
    Object.keys(finalCategories).forEach(key => {
      if (finalCategories[key] === 0) {
        finalCategories[key] = rating;
      }
    });

    onSubmit(booking._id, rating, review, finalCategories);
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
          <h3 className="text-2xl font-bold text-gray-900">Rate Your Stay</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
          <h4 className="text-lg font-bold text-gray-900 mb-1">{booking.property.title}</h4>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-[#1846ca]" />
            <span className="text-sm">{booking.property.location}</span>
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
            Rate Categories (Optional)
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
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience... What did you like? What could be improved?"
            className="w-full px-5 py-4 border-2 border-blue-100 rounded-2xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
            rows="4"
            maxLength={1000}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {review.length} / 1000 characters
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-2xl hover:from-[#1234a0] hover:to-[#1846ca] transition-all duration-300 font-bold shadow-lg"
          >
            Submit Review
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

const InvoiceGenerator = ({ booking, logoUrl }) => {
  const generateInvoice = () => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Wavescation Invoice - ${booking._id}</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: #f8fafc; }
          .invoice-container { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(24,70,202,0.25); border: 1px solid #e0e7ff; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 3px solid #1846ca; padding-bottom: 20px; }
          .logo { height: 80px; }
          .header-info { text-align: right; }
          .header h1 { color: #1846ca; margin: 0; font-size: 32px; font-weight: 800; }
          .header p { color: #64748b; margin: 5px 0; }
          .invoice-details { display: flex; justify-content: space-between; margin: 30px 0; }
          .section { margin: 20px 0; }
          .section-title { font-weight: 800; font-size: 18px; margin-bottom: 10px; color: #1846ca; border-bottom: 2px solid #e0e7ff; padding-bottom: 5px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e7ff; }
          .info-label { font-weight: 600; color: #64748b; }
          .info-value { color: #0f172a; font-weight: 600; }
          .property-details { background: #f0f4ff; padding: 20px; border-radius: 16px; margin: 20px 0; border: 1px solid #dbeafe; }
          .pricing-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .pricing-table td { padding: 12px; border-bottom: 1px solid #e0e7ff; }
          .pricing-table .label { color: #64748b; }
          .pricing-table .value { text-align: right; font-weight: 600; color: #0f172a; }
          .total-row { font-size: 20px; font-weight: 800; background: #1846ca; color: white; }
          .total-row td { padding: 15px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e7ff; color: #64748b; }
          .status-badge { display: inline-block; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; }
          .status-confirmed { background: #dbeafe; color: #1846ca; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-completed { background: #d1e7ff; color: #0c4a6e; }
          .status-cancelled { background: #fee2e2; color: #b91c1c; }
          .wavescation-gradient { background: linear-gradient(135deg, #1846ca, #2a5ae0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          @media print {
            body { background: white; padding: 20px; }
            .invoice-container { box-shadow: none; border: 1px solid #e0e7ff; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <img src="${logoUrl}" alt="Wavescation" class="logo" />
            <div class="header-info">
              <h1>BOOKING INVOICE</h1>
              <p>Invoice ID: ${booking._id}</p>
              <p>Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div class="invoice-details">
            <div>
              <div class="section-title">Guest Information</div>
              <p><strong>Name:</strong> ${booking.guestName || 'N/A'}</p>
              <p><strong>Email:</strong> ${booking.guestEmail || 'N/A'}</p>
              <p><strong>Phone:</strong> ${booking.guestPhone || 'N/A'}</p>
            </div>
            <div>
              <div class="section-title">Booking Status</div>
              <p><span class="status-badge status-${booking.bookingStatus}">${booking.bookingStatus.toUpperCase()}</span></p>
              <p><strong>Payment:</strong> ${booking.paymentStatus}</p>
              <p><strong>Booked on:</strong> ${new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div class="property-details">
            <div class="section-title">Property Details</div>
            <h2 style="color: #1846ca; margin-bottom: 10px;">${booking.property.title}</h2>
            <p><strong>Location:</strong> ${booking.property.location}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
          </div>

          <div class="section">
            <div class="section-title">Stay Details</div>
            <div class="info-row">
              <span class="info-label">Check-in Date:</span>
              <span class="info-value">${new Date(booking.checkIn).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-out Date:</span>
              <span class="info-value">${new Date(booking.checkOut).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Pricing Period:</span>
              <span class="info-value">${booking.pricingPeriod}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of Units:</span>
              <span class="info-value">${booking.units}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Price Breakdown</div>
            <table class="pricing-table">
              <tr>
                <td class="label">Price per ${booking.pricingPeriod}</td>
                <td class="value">AED ${booking.pricePerUnit.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="label">Subtotal (${booking.units} ${booking.pricingPeriod}${booking.units > 1 ? 's' : ''})</td>
                <td class="value">AED ${booking.subtotal.toFixed(2)}</td>
              </tr>
              ${booking.cleaningFee > 0 ? `
              <tr>
                <td class="label">Cleaning Fee</td>
                <td class="value">AED ${booking.cleaningFee.toFixed(2)}</td>
              </tr>` : ''}
              ${booking.serviceFee > 0 ? `
              <tr>
                <td class="label">Service Fee</td>
                <td class="value">AED ${booking.serviceFee.toFixed(2)}</td>
              </tr>` : ''}
              ${booking.cityTax > 0 ? `
              <tr>
                <td class="label">City Tax</td>
                <td class="value">AED ${booking.cityTax.toFixed(2)}</td>
              </tr>` : ''}
              ${booking.vat > 0 ? `
              <tr>
                <td class="label">VAT</td>
                <td class="value">AED ${booking.vat.toFixed(2)}</td>
              </tr>` : ''}
              <tr class="total-row">
                <td>TOTAL AMOUNT</td>
                <td style="text-align: right;">AED ${booking.totalPrice.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Payment Information</div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${booking.paymentMethod.replace(/-/g, ' ').toUpperCase()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Advance Payment:</span>
              <span class="info-value">${booking.advancePaymentPaid ? 'Paid' : 'Not Paid'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="info-value">${booking.paymentStatus.toUpperCase()}</span>
            </div>
          </div>

          <div class="footer">
            <p><strong class="wavescation-gradient">Wavescation Holiday Homes</strong></p>
            <p>Iris Bay Tower, Business Bay, Dubai</p>
            <p>Phone: +971 52 259 6860 | Email: Info@wavescation.com</p>
            <p style="margin-top: 20px;">Thank you for choosing Wavescation!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wavescation_Invoice_${booking._id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generateInvoice}
      className="px-6 py-3 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-xl hover:from-[#1234a0] hover:to-[#1846ca] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
    >
      <Download className="w-4 h-4" />
      Download Invoice
    </button>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    isGoogleUser: false,
    _id: ''
  });

  const [originalUserDetails, setOriginalUserDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    isGoogleUser: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const getUserAndBookings = async () => {
    try {
      const response = await axios.get(`${baseurl}User/getuser`, { withCredentials: true });
      if (response.data.user) {
        setUserDetails(response.data.user);
        setOriginalUserDetails(response.data.user);

        const bookingsRes = await axios.get(`${baseurl}User/get-booking`, {
          params: { id: response.data.user._id }
        });

        if (bookingsRes.data && bookingsRes.data.bookings) {
          setBookings(bookingsRes.data.bookings);
        }
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to fetch user details', 'error');
    }
  };

  useEffect(() => {
    getUserAndBookings();
    const savedTab = sessionStorage.getItem('profileActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
      sessionStorage.removeItem('profileActiveTab');
    }
  }, []);

  const handlePropertyClick = (propertyId, guests) => {
    sessionStorage.setItem('profileActiveTab', activeTab);
    window.location.href = `/property/${propertyId}?adults=${guests}`;
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${baseurl}User/updateuser`, {
        name: userDetails.name,
        mobile: userDetails.mobile
      }, { withCredentials: true });

      if (response.data.success) {
        showToast(response.data.message || 'Profile updated successfully!', 'success');
        setOriginalUserDetails({ ...userDetails });
        setIsEditingProfile(false);
      } else {
        showToast(response.data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${baseurl}User/changepassword`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, { withCredentials: true });

      if (response.data.success) {
        showToast(response.data.message || 'Password changed successfully!', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
      } else {
        showToast(response.data.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Error changing password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setLoading(true);
    try {
      const response = await axios.put(`${baseurl}user/cancel-booking/${bookingId}`, {}, { withCredentials: true });

      if (response.data.success) {
        showToast('Booking cancelled successfully', 'success');
        getUserAndBookings();
        setExpandedBooking(null);
        setConfirmCancel(null);
      } else {
        showToast(response.data.message || 'Failed to cancel booking', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Error cancelling booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (bookingId, rating, review, categories) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseurl}user/${bookingId}/review`,
        {
          rating,
          review,
          categories
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        showToast('Review submitted successfully!', 'success');
        setShowRatingModal(false);
        setSelectedBookingForRating(null);
        getUserAndBookings();
      } else {
        showToast(response.data.message || 'Failed to submit review', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Error submitting review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setUserDetails({ ...originalUserDetails });
    setIsEditingProfile(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-[#1846ca] border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPropertyImage = (property) => {
    if (property && property.images && property.images.length > 0) {
      return property.images[0].url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=250&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=250&fit=crop';
  };

  const canRateBooking = (booking) => {
    return booking.checkedOut === true && !booking.rated;
  };

  const canCancelBooking = (booking) => {
    return booking.bookingStatus !== 'cancelled' &&
      booking.bookingStatus !== 'completed' &&
      booking.checkedOut !== true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {confirmCancel && (
        <ConfirmModal
          message="Are you sure you want to cancel this booking? This action cannot be undone."
          onConfirm={() => handleCancelBooking(confirmCancel)}
          onCancel={() => setConfirmCancel(null)}
        />
      )}

      {showRatingModal && selectedBookingForRating && (
        <RatingModal
          booking={selectedBookingForRating}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedBookingForRating(null);
          }}
          onSubmit={handleRatingSubmit}
          showToast={showToast}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">My Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Manage your account settings and view your bookings</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden sticky top-24" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.08)' }}>
              <div className="p-8 bg-gradient-to-br from-[#1846ca] to-[#2a5ae0] text-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.3)_0%,_transparent_70%)]"></div>
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl border-2 border-white/30">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-1">{userDetails.name}</h3>
                  <p className="text-blue-100 text-center text-sm truncate">{userDetails.email}</p>
                </div>
              </div>
              <div className="p-6">
                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 font-semibold ${
                      activeTab === 'profile' 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-[#1846ca] border border-blue-200 shadow-md' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-[#1846ca]'
                    }`}
                  >
                    <User className="w-5 h-5" /> 
                    Profile Details
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('bookings')} 
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 font-semibold ${
                      activeTab === 'bookings' 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-[#1846ca] border border-blue-200 shadow-md' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-[#1846ca]'
                    }`}
                  >
                    <Calendar className="w-5 h-5" /> 
                    My Bookings ({bookings.length})
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 font-semibold ${
                      activeTab === 'reviews'
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-[#1846ca] border border-blue-200 shadow-md'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-[#1846ca]'
                    }`}
                  >
                    <Star className="w-5 h-5" /> 
                    My Reviews
                  </button>

                  
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.08)' }}>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        Profile Information
                      </h2>
                      <button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)} 
                        disabled={loading} 
                        className="px-5 py-3 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-xl hover:from-[#1234a0] hover:to-[#1846ca] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 font-semibold shadow-lg"
                      >
                        <Edit className="w-4 h-4" />
                        {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                          <User className="w-4 h-4 inline mr-1" /> Full Name
                        </label>
                        {isEditingProfile ? (
                          <input 
                            type="text" 
                            value={userDetails.name} 
                            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} 
                            className="w-full px-5 py-4 border-2 border-blue-100 rounded-xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-gray-900 font-medium"
                          />
                        ) : (
                          <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-gray-900 font-medium border border-blue-100">
                            {userDetails.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                          <Mail className="w-4 h-4 inline mr-1" /> Email Address
                        </label>
                        <div className="px-5 py-4 bg-gray-100 rounded-xl text-gray-500 font-medium border border-gray-200">
                          {userDetails.email}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" /> Phone Number
                        </label>
                        {isEditingProfile ? (
                          <input 
                            type="tel" 
                            value={userDetails.mobile} 
                            onChange={(e) => setUserDetails({ ...userDetails, mobile: e.target.value })} 
                            className="w-full px-5 py-4 border-2 border-blue-100 rounded-xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-gray-900 font-medium"
                          />
                        ) : (
                          <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-gray-900 font-medium border border-blue-100">
                            {userDetails.mobile || 'Not provided'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                          <Award className="w-4 h-4 inline mr-1" /> Member Since
                        </label>
                        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-gray-900 font-medium border border-blue-100">
                          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex gap-4 mt-8">
                        <button 
                          onClick={handleProfileSave} 
                          disabled={loading} 
                          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 font-bold shadow-lg"
                        >
                          <Check className="w-4 h-4" /> 
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                          onClick={handleCancelEdit} 
                          disabled={loading} 
                          className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 font-semibold"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Change Password Section */}
                {!userDetails.isGoogleUser && (
                  <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.08)' }}>
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                          Security
                        </h2>
                        <button 
                          onClick={() => setIsChangingPassword(!isChangingPassword)} 
                          disabled={loading} 
                          className="px-5 py-3 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-xl hover:from-[#1234a0] hover:to-[#1846ca] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 font-semibold shadow-lg"
                        >
                          <Shield className="w-4 h-4" />
                          {isChangingPassword ? 'Cancel' : 'Change Password'}
                        </button>
                      </div>

                      {isChangingPassword ? (
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Current Password</label>
                              <div className="relative">
                                <input 
                                  type={showPassword ? 'text' : 'password'} 
                                  value={passwordData.currentPassword} 
                                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                                  className="w-full px-5 py-4 border-2 border-blue-100 rounded-xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white"
                                  placeholder="Enter current password"
                                />
                                <button 
                                  onClick={() => setShowPassword(!showPassword)} 
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1846ca] transition-colors"
                                >
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">New Password</label>
                              <div className="relative">
                                <input 
                                  type={showNewPassword ? 'text' : 'password'} 
                                  value={passwordData.newPassword} 
                                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                                  className="w-full px-5 py-4 border-2 border-blue-100 rounded-xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white"
                                  placeholder="Enter new password"
                                />
                                <button 
                                  onClick={() => setShowNewPassword(!showNewPassword)} 
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1846ca] transition-colors"
                                >
                                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Confirm Password</label>
                              <div className="relative">
                                <input 
                                  type={showConfirmPassword ? 'text' : 'password'} 
                                  value={passwordData.confirmPassword} 
                                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                                  className="w-full px-5 py-4 border-2 border-blue-100 rounded-xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white"
                                  placeholder="Confirm new password"
                                />
                                <button 
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1846ca] transition-colors"
                                >
                                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-6">
                            <button 
                              onClick={handlePasswordChange} 
                              disabled={loading} 
                              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 font-bold shadow-lg"
                            >
                              <Check className="w-4 h-4" /> 
                              {loading ? 'Updating...' : 'Update Password'}
                            </button>
                            <button 
                              onClick={() => setIsChangingPassword(false)} 
                              disabled={loading} 
                              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 font-semibold"
                            >
                              <X className="w-4 h-4" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-semibold">Password never expires</p>
                            <p className="text-sm text-gray-500">Last changed • 30 days ago</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {userDetails.isGoogleUser && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-lg">Google Account</p>
                        <p className="text-gray-600">Password management is handled by Google</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.08)' }}>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      My Bookings ({bookings.length})
                    </h2>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-[#1846ca]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
                      <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
                      <button 
                        onClick={() => window.location.href = '/property'}
                        className="px-8 py-4 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-xl hover:from-[#1234a0] hover:to-[#1846ca] transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
                      >
                        Browse Properties
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {bookings.map((booking) => {
                        const isCancelled = booking.bookingStatus === 'cancelled';
                        return (
                          <div key={booking._id} className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                            isCancelled ? 'border-red-200 opacity-75' : 'border-blue-100'
                          }`}>
                            {isCancelled && <CancelledBanner />}
                            
                            <div className="flex flex-col md:flex-row">
                              {/* Property Image */}
                              <div
                                className="md:w-1/3 cursor-pointer relative overflow-hidden group"
                                onClick={() => handlePropertyClick(booking.property._id, booking.guests)}
                              >
                                <img
                                  src={getPropertyImage(booking.property)}
                                  alt={booking.property.title}
                                  className={`w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isCancelled ? 'grayscale' : ''}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {isCancelled && (
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">CANCELLED</span>
                                  </div>
                                )}
                              </div>

                              {/* Booking Details */}
                              <div className="md:w-2/3 p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div
                                    className="cursor-pointer flex-1"
                                    onClick={() => handlePropertyClick(booking.property._id, booking.guests)}
                                  >
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#1846ca] transition-colors">
                                      {booking.property.title}
                                    </h3>
                                    <div className="flex items-center text-gray-600 mb-2">
                                      <MapPin className="w-4 h-4 mr-1 text-[#1846ca]" />
                                      <span className="text-sm">{booking.property.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <User className="w-4 h-4 mr-1 text-[#1846ca]" />
                                      <span className="text-sm">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(booking.bookingStatus)}`}>
                                      {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                                    </span>
                                    <div className={`mt-3 text-2xl font-black ${isCancelled ? 'text-gray-400 line-through' : 'text-[#1846ca]'}`}>
                                      AED {booking.totalPrice}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                    <Calendar className="w-5 h-5 text-[#1846ca]" />
                                    <div>
                                      <p className="text-xs text-gray-500">Check-in</p>
                                      <p className="font-bold text-gray-900">{formatDate(booking.checkIn)}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                    <Calendar className="w-5 h-5 text-[#1846ca]" />
                                    <div>
                                      <p className="text-xs text-gray-500">Check-out</p>
                                      <p className="font-bold text-gray-900">{formatDate(booking.checkOut)}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-100">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-1 text-[#1846ca]" />
                                    Booked {formatDate(booking.createdAt)}
                                  </div>

                                  <button
                                    onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#1846ca] hover:text-[#1234a0] transition-colors bg-blue-50 rounded-xl hover:bg-blue-100"
                                  >
                                    {expandedBooking === booking._id ? (
                                      <>
                                        <ChevronUp className="w-4 h-4" /> Hide Details
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-4 h-4" /> View Details
                                      </>
                                    )}
                                  </button>
                                </div>

                                {/* Expanded Details */}
                                {expandedBooking === booking._id && (
                                  <div className="mt-6 pt-6 border-t-2 border-blue-100 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#1846ca] mb-3">Guest Information</h4>
                                        <div className="space-y-2 text-sm">
                                          <p><span className="font-semibold text-gray-600">Name:</span> {booking.guestName || 'N/A'}</p>
                                          <p><span className="font-semibold text-gray-600">Email:</span> {booking.guestEmail || 'N/A'}</p>
                                          <p><span className="font-semibold text-gray-600">Phone:</span> {booking.guestPhone || 'N/A'}</p>
                                        </div>
                                      </div>

                                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#1846ca] mb-3">Booking Details</h4>
                                        <div className="space-y-2 text-sm">
                                          <p><span className="font-semibold text-gray-600">Period:</span> {booking.pricingPeriod}</p>
                                          <p><span className="font-semibold text-gray-600">Units:</span> {booking.units}</p>
                                          <p><span className="font-semibold text-gray-600">Price/Unit:</span> AED {booking.pricePerUnit}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#1846ca] mb-3">Price Breakdown</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Subtotal</span>
                                          <span className="font-bold text-gray-900">AED {booking.subtotal.toFixed(2)}</span>
                                        </div>
                                        {booking.cleaningFee > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Cleaning Fee</span>
                                            <span className="font-bold text-gray-900">AED {booking.cleaningFee.toFixed(2)}</span>
                                          </div>
                                        )}
                                        {booking.serviceFee > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Service Fee</span>
                                            <span className="font-bold text-gray-900">AED {booking.serviceFee.toFixed(2)}</span>
                                          </div>
                                        )}
                                        {booking.cityTax > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">City Tax</span>
                                            <span className="font-bold text-gray-900">AED {booking.cityTax.toFixed(2)}</span>
                                          </div>
                                        )}
                                        {booking.vat > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">VAT</span>
                                            <span className="font-bold text-gray-900">AED {booking.vat.toFixed(2)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t-2 border-blue-200 font-bold text-base">
                                          <span className="text-gray-900">Total</span>
                                          <span className={isCancelled ? 'line-through text-gray-400' : 'text-[#1846ca]'}>
                                            AED {booking.totalPrice.toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#1846ca] mb-3">Payment Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <p><span className="font-semibold text-gray-600">Method:</span> {booking.paymentMethod.replace(/-/g, ' ').toUpperCase()}</p>
                                        <p>
                                          <span className="font-semibold text-gray-600">Status:</span>{' '}
                                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCancelled
                                            ? 'bg-red-100 text-red-800'
                                            : booking.paymentStatus === 'paid'
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {isCancelled ? 'REFUNDED' : booking.paymentStatus.toUpperCase()}
                                          </span>
                                        </p>
                                        <p><span className="font-semibold text-gray-600">Advance Payment:</span> {booking.advancePaymentPaid ? 'Paid' : 'Not Paid'}</p>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {!isCancelled && (
                                      <div className="flex flex-wrap gap-3 mt-4">
                                        <InvoiceGenerator booking={booking} logoUrl='https://www.wavescation.com/assets/logo-DC0iQ2p5.png' />

                                        {canRateBooking(booking) && (
                                          <button
                                            onClick={() => {
                                              setSelectedBookingForRating(booking);
                                              setShowRatingModal(true);
                                            }}
                                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
                                          >
                                            <Star className="w-4 h-4" />
                                            Rate & Review
                                          </button>
                                        )}

                                        {canCancelBooking(booking) && (
                                          <button
                                            onClick={() => setConfirmCancel(booking._id)}
                                            disabled={loading}
                                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg disabled:opacity-50"
                                          >
                                            <XCircle className="w-4 h-4" />
                                            Cancel Booking
                                          </button>
                                        )}
                                      </div>
                                    )}

                                    {isCancelled && booking.updatedAt && (
                                      <div className="text-xs text-red-600 mt-4 pt-4 border-t border-red-200">
                                        Cancelled on {formatDate(booking.updatedAt)}
                                      </div>
                                    )}

                                    <div className="text-xs text-gray-400 mt-2">
                                      Booking ID: {booking._id}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.08)' }}>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">My Reviews</h2>
                  </div>
                  <MyReviews />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.08)' }}>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Settings</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Notification Preferences */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-5 h-5 text-[#1846ca]" />
                        <h3 className="font-bold text-gray-900">Notification Preferences</h3>
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-5 h-5 rounded border-blue-300 text-[#1846ca] focus:ring-[#1846ca]" defaultChecked />
                          <span className="text-sm text-gray-700">Email notifications for booking updates</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-5 h-5 rounded border-blue-300 text-[#1846ca] focus:ring-[#1846ca]" defaultChecked />
                          <span className="text-sm text-gray-700">SMS notifications for check-in reminders</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-5 h-5 rounded border-blue-300 text-[#1846ca] focus:ring-[#1846ca]" />
                          <span className="text-sm text-gray-700">Promotional emails and offers</span>
                        </label>
                      </div>
                    </div>

                    {/* Language & Currency */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-5 h-5 text-[#1846ca]" />
                        <h3 className="font-bold text-gray-900">Language & Currency</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Language</label>
                          <select className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 bg-white">
                            <option>English</option>
                            <option>Arabic</option>
                            <option>Russian</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Currency</label>
                          <select className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 bg-white">
                            <option>AED (د.إ)</option>
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Help & Support */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <HelpCircle className="w-5 h-5 text-[#1846ca]" />
                        <h3 className="font-bold text-gray-900">Help & Support</h3>
                      </div>
                      <div className="space-y-3">
                        <a href="#" className="block text-sm text-gray-700 hover:text-[#1846ca] transition-colors">FAQs</a>
                        <a href="#" className="block text-sm text-gray-700 hover:text-[#1846ca] transition-colors">Contact Support</a>
                        <a href="#" className="block text-sm text-gray-700 hover:text-[#1846ca] transition-colors">Terms of Service</a>
                        <a href="#" className="block text-sm text-gray-700 hover:text-[#1846ca] transition-colors">Privacy Policy</a>
                      </div>
                    </div>

                    {/* Save Settings Button */}
                    <button className="w-full py-4 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-xl hover:from-[#1234a0] hover:to-[#1846ca] transition-all duration-300 transform hover:scale-[1.02] font-bold shadow-lg">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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

export default ProfilePage;