import React, { useState } from 'react';
import CheckoutDetails from './CheckoutDetails';
import CheckoutPayment from './CheckoutPayment';
import CheckoutComplete from './CheckoutComplete';

const CheckoutContainer = ({ bookingDetails }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      return formData.name && formData.email && formData.phone;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePaymentSuccess = () => {
    setCurrentStep(3);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-blue-100" style={{ boxShadow: '0 25px 60px rgba(24,70,202,0.12)' }}>
      {currentStep === 1 && (
        <CheckoutDetails
          formData={formData}
          handleInputChange={handleInputChange}
          nextStep={nextStep}
          validateStep={validateStep}
        />
      )}

      {currentStep === 2 && (
        <CheckoutPayment
          formData={formData}
          handleInputChange={handleInputChange}
          bookingDetails={bookingDetails}
          nextStep={nextStep}
          prevStep={prevStep}
          validateStep={validateStep}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {currentStep === 3 && (
        <CheckoutComplete
          formData={formData}
          bookingDetails={bookingDetails}
        />
      )}
    </div>
  );
};

export default CheckoutContainer;