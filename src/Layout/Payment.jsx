import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowRight, ArrowLeft, CreditCard, Check, Shield, AlertTriangle, Loader2, Building, Lock, Clock, Award } from 'lucide-react';
import { baseurl } from '../Base/Base';

const CheckoutPayment = ({ 
  formData, 
  handleInputChange, 
  bookingDetails, 
  nextStep, 
  prevStep, 
  validateStep, 
  onPaymentSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('pay-at-property');
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const paymentFormRef = useRef(null);
  const scriptRef = useRef(null);
  const widgetInitialized = useRef(false);

  useEffect(() => {
    if (bookingDetails.bookingId) {
      sessionStorage.setItem('currentBookingId', bookingDetails.bookingId);
      sessionStorage.setItem('currentPropertyId', bookingDetails.propertyId || '');
    }
  }, [bookingDetails.bookingId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('paymentSuccess');
    
    if (paymentSuccess === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
      if (onPaymentSuccess) {
        onPaymentSuccess(bookingDetails);
      } else {
        nextStep();
      }
    }
  }, []);

  useEffect(() => {
    if (showPaymentWidget && checkoutId && !widgetInitialized.current) {
      widgetInitialized.current = true;
      loadPaymentWidget();
    }
    return () => {
      if (!showPaymentWidget) {
        cleanupWidget();
        widgetInitialized.current = false;
      }
    };
  }, [showPaymentWidget, checkoutId]);

  useEffect(() => {
    if (widgetLoaded && checkoutId) {
      const warningTimer = setTimeout(() => {
        setError('⚠️ Payment session expires in 5 minutes! Please complete payment soon.');
      }, 25 * 60 * 1000);

      const refreshTimer = setTimeout(() => {
        setError('Payment session expired. Refreshing automatically...');
        setWidgetLoaded(false);
        widgetInitialized.current = false;
        cleanupWidget();
        setTimeout(() => {
          handleOnlinePayment();
        }, 2000);
      }, 28 * 60 * 1000);

      return () => {
        clearTimeout(warningTimer);
        clearTimeout(refreshTimer);
      };
    }
  }, [widgetLoaded, checkoutId]);

  const cleanupWidget = () => {
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    if (window.wpwlOptions) delete window.wpwlOptions;
    setWidgetLoaded(false);
  };

  const loadPaymentWidget = () => {
    cleanupWidget();
    
    if (paymentFormRef.current) {
      paymentFormRef.current.innerHTML = '';
    }
  
    const form = document.createElement('form');
    form.action = `${window.location.origin}/payment-return`;
    form.className = 'paymentWidgets';
    form.setAttribute('data-brands', 'VISA MASTER AMEX');
    
    if (paymentFormRef.current) {
      paymentFormRef.current.appendChild(form);
    }
  
    window.wpwlOptions = {
      style: "card",
      locale: "en",
      brandDetection: true,
      brandDetectionType: "binlist",
      brandDetectionPriority: ["VISA", "MASTER", "AMEX"],
      
      onReady: function() {
        setWidgetLoaded(true);
        setError(null);
      },
      
      onError: function(error) {
        setError(`Payment form error: ${error.message || 'Please try again'}`);
        setWidgetLoaded(false);
      }
    };
  
    const script = document.createElement('script');
    const afsWidgetUrl = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    
    script.src = afsWidgetUrl;
    script.async = true;
    
    script.onload = () => {};
  
    script.onerror = () => {
      setError('Failed to load payment system. Please refresh and try again.');
      setWidgetLoaded(false);
      widgetInitialized.current = false;
    };
  
    document.body.appendChild(script);
    scriptRef.current = script;
  };

  const handleOnlinePayment = async () => {
    if (!bookingDetails.bookingId) {
      setError('Booking ID not generated. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setError(null);
    widgetInitialized.current = false;

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await axios.post(
        `${baseurl}user/initialize-afs-payment`,
        { bookingId: bookingDetails.bookingId },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
      );

      if (response.data.success && response.data.checkoutId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCheckoutId(response.data.checkoutId);
        setShowPaymentWidget(true);
        sessionStorage.setItem('currentBookingId', bookingDetails.bookingId);
        sessionStorage.setItem('checkoutCreatedAt', Date.now().toString());
      } else {
        throw new Error(response.data.message || 'Payment initialization failed');
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.expired) {
        setError('Your booking session has expired. Please create a new booking.');
        setTimeout(() => {
          window.location.href = `/properties`;
        }, 3000);
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your internet connection and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedPayment === 'online-payment') {
      await handleOnlinePayment();
      return;
    }

    if (!bookingDetails.bookingId) {
      setError('Booking ID not generated. Please refresh and try again.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await axios.post(
        `${baseurl}user/confirm-booking`,
        { 
          bookingId: bookingDetails.bookingId,
          paymentMethod: selectedPayment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        if (onPaymentSuccess) {
          onPaymentSuccess(response.data.booking);
        } else {
          nextStep();
        }
      } else {
        throw new Error('Booking confirmation failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const retryWidget = () => {
    setError(null);
    setWidgetLoaded(false);
    widgetInitialized.current = false;
    cleanupWidget();
    setTimeout(() => {
      handleOnlinePayment();
    }, 500);
  };

  if (showPaymentWidget) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-12 relative">
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-blue-200"></div>
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0]"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white shadow-lg">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1846ca]">Details</span>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white shadow-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1846ca]">Payment</span>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-white border-2 border-blue-200 text-blue-400">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Complete</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">Complete Payment</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your card details to secure your booking</p>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 text-sm mb-3">{error}</p>
                {!error.includes('expired') && !error.includes('Booking session') && (
                  <button
                    onClick={retryWidget}
                    disabled={loading}
                    className="px-5 py-2.5 bg-[#1846ca] text-white rounded-xl text-sm font-semibold hover:bg-[#1234a0] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Refreshing...' : 'Retry Payment Form'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border-2 border-blue-100 rounded-2xl p-6" style={{ boxShadow: '0 15px 30px rgba(24,70,202,0.08)' }}>
          <div className="mb-6 pb-6 border-b border-blue-100">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Amount to pay</p>
            <p className="text-4xl font-black text-[#1846ca]">
              AED {bookingDetails.total.toLocaleString()}
            </p>
          </div>
          
          <div ref={paymentFormRef} className="payment-widget-container min-h-[400px]" />

          {!widgetLoaded && !error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] flex items-center justify-center animate-pulse">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-700 font-bold mb-2">Loading secure payment form...</p>
              <p className="text-gray-500 text-sm">This may take a few moments</p>
            </div>
          )}

          {widgetLoaded && !error && (
            <>
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#1846ca] mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Secure Payment</p>
                    <p className="text-sm text-gray-600">Enter your card details above. After payment, you'll be redirected automatically.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium">
                    Complete payment within 30 minutes. This session will expire automatically.
                  </p>
                </div>
              </div>
            </>
          )}
          
          <div className="mt-6 pt-6 border-t border-blue-100">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-[#1846ca]" />
              <span>256-bit SSL encrypted • PCI DSS compliant</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              cleanupWidget();
              widgetInitialized.current = false;
              setShowPaymentWidget(false);
              setCheckoutId(null);
              setError(null);
            }}
            className="flex items-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-12 relative">
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-blue-200"></div>
          <div className="absolute top-5 left-8 w-2/3 h-0.5 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0]"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white shadow-lg">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1846ca]">Details</span>
          </div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white shadow-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1846ca]">Payment</span>
          </div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-white border-2 border-blue-200 text-blue-400">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Complete</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-black text-gray-900 mb-2">Complete Your Booking</h2>
      <p className="text-sm text-gray-500 mb-6">Choose your preferred payment method</p>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Booking Summary</p>
            <p className="text-xs text-gray-500">ID: {bookingDetails.bookingId ? bookingDetails.bookingId.substring(0, 8).toUpperCase() : 'Generating...'}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Property:</span>
            <span className="font-semibold text-gray-900">{bookingDetails.roomType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-900">{bookingDetails.units} {bookingDetails.units === 1 ? 'Night' : 'Nights'}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span className="text-gray-900">Total:</span>
              <span className="text-[#1846ca]">AED {bookingDetails.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-blue-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#1846ca]" />
          Payment Method
        </h3>
        
        <div className="space-y-3">
          <div 
            onClick={() => setSelectedPayment('online-payment')}
            className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
              selectedPayment === 'online-payment' 
                ? 'border-[#1846ca] bg-blue-50' 
                : 'border-blue-100 hover:border-[#1846ca] hover:bg-blue-50/30'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
              selectedPayment === 'online-payment'
                ? 'border-[#1846ca] bg-[#1846ca]'
                : 'border-gray-300'
            }`}>
              {selectedPayment === 'online-payment' && <Check className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#1846ca]" />
                <div>
                  <div className="font-bold text-gray-900">Pay Online</div>
                  <div className="text-xs text-gray-500">Credit/Debit Card (VISA, MasterCard, AMEX)</div>
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedPayment('pay-at-property')}
            className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
              selectedPayment === 'pay-at-property' 
                ? 'border-[#1846ca] bg-blue-50' 
                : 'border-blue-100 hover:border-[#1846ca] hover:bg-blue-50/30'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
              selectedPayment === 'pay-at-property'
                ? 'border-[#1846ca] bg-[#1846ca]'
                : 'border-gray-300'
            }`}>
              {selectedPayment === 'pay-at-property' && <Check className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-[#1846ca]" />
                <div>
                  <div className="font-bold text-gray-900">Pay at Property</div>
                  <div className="text-xs text-gray-500">Payment during check-in</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#1846ca] mt-0.5" />
          <div>
            <h4 className="font-bold text-gray-900 mb-1">
              {selectedPayment === 'online-payment' ? 'Secure Payment' : 'Booking Guarantee'}
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {selectedPayment === 'online-payment' ? (
                <>
                  <li>• 256-bit SSL encryption</li>
                  <li>• PCI DSS compliant</li>
                  <li>• Instant confirmation</li>
                </>
              ) : (
                <>
                  <li>• Instant confirmation</li>
                  <li>• Pay at check-in</li>
                  <li>• Valid ID required</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleConfirmBooking}
          disabled={!bookingDetails.bookingId || loading}
          className="w-full py-5 px-6 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] hover:from-[#1234a0] hover:to-[#1846ca] text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          style={{ boxShadow: '0 10px 25px rgba(24,70,202,0.3)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : !bookingDetails.bookingId ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Booking...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              {selectedPayment === 'online-payment' ? 'Proceed to Secure Payment' : 'Confirm Booking'}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-white hover:bg-blue-50 text-[#1846ca] rounded-xl font-semibold transition-all border-2 border-blue-200 hover:border-[#1846ca] disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </button>
      </div>

      <div className="text-center text-xs text-gray-400">
        Need help? Contact{' '}
        <a href="mailto:info@alrknalraqy.com" className="text-[#1846ca] hover:text-[#1234a0] font-medium">
          info@alrknalraqy.com
        </a>
      </div>
    </div>
  );
};

export default CheckoutPayment;