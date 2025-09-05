import React, { useState } from 'react';

const FloatingLabelInput = ({ id, label, type = 'text', value, onChange, name, className = '', disabled = false }) => {
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (input) => {
    // Remove all non-digit characters except the first 010-
    const numbers = input.replace(/[^\d]/g, '');
    
    // Always start with 010
    if (!numbers.startsWith('010')) {
      return '010-';
    }
    
    // Format as 010-XXXX-XXXX
    if (numbers.length <= 3) {
      return '010-';
    } else if (numbers.length <= 7) {
      return `010-${numbers.slice(3)}`;
    } else {
      return `010-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    
    if (type === 'tel') {
      // Format phone number
      inputValue = formatPhoneNumber(inputValue);
      setIsValidPhone(inputValue === '010-' || validatePhone(inputValue));
      
      // Update the event target value
      e.target.value = inputValue;
    } else if (type === 'email') {
      setIsValidEmail(inputValue === '' || validateEmail(inputValue));
    }
    
    onChange(e);
  };

  const getBorderColor = () => {
    if (type === 'email' && value && !isValidEmail) {
      return 'border-red-500 focus:border-red-500';
    }
    if (type === 'tel' && value && value !== '010-' && !isValidPhone) {
      return 'border-red-500 focus:border-red-500';
    }
    return 'border-gray-300 focus:border-blue-600';
  };

  const getLabelColor = () => {
    if (type === 'email' && value && !isValidEmail) {
      return 'text-red-500 peer-focus:text-red-500';
    }
    if (type === 'tel' && value && value !== '010-' && !isValidPhone) {
      return 'text-red-500 peer-focus:text-red-500';
    }
    return 'text-gray-500 peer-focus:text-blue-600';
  };

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer ${getBorderColor()} ${className}`}
        placeholder={type === 'tel' ? '010-0000-0000' : ' '}
        value={type === 'tel' && !value ? '010-' : value}
        onChange={handleInputChange}
        disabled={disabled}
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
        spellCheck="false"
        aria-autocomplete="none"
        required={type === 'email' && value !== ''}
      />
      <label
        htmlFor={id}
        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${getLabelColor()}`}
      >
        {label}
      </label>
      {type === 'email' && value && !isValidEmail && (
        <p className="mt-1 text-sm text-red-500">올바른 이메일 형식을 입력해주세요</p>
      )}
      {type === 'tel' && value && value !== '010-' && !isValidPhone && (
        <p className="mt-1 text-sm text-red-500">010-0000-0000 형식으로 입력해주세요</p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
