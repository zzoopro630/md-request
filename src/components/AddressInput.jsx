import React, { useState } from 'react';
import { Search } from 'lucide-react';

const AddressInput = ({ 
  addressValue, 
  postalCodeValue,
  detailAddressValue,
  onAddressChange, 
  onPostalCodeChange,
  onDetailAddressChange,
  name,
  className = '',
  disabled = false 
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressSearch = () => {
    if (disabled || !window.daum) return;
    
    setIsSearching(true);
    
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 기본 주소 (도로명 또는 지번 주소)
        const fullAddress = data.address;
        const postalCode = data.zonecode;
        
        // 상위 컴포넌트에 주소와 우편번호 전달
        if (onAddressChange) {
          onAddressChange({
            target: {
              name: name,
              value: fullAddress
            }
          });
        }
        
        if (onPostalCodeChange) {
          onPostalCodeChange({
            target: {
              name: `${name}PostalCode`,
              value: postalCode
            }
          });
        }
        
        setIsSearching(false);
      },
      onclose: function() {
        setIsSearching(false);
      },
      theme: {
        bgColor: "#FFFFFF",
        searchBgColor: "#0B65C8",
        contentBgColor: "#FFFFFF",
        pageBgColor: "#FFFFFF",
        textColor: "#333333",
        queryTextColor: "#FFFFFF"
      }
    }).open();
  };

  return (
    <div className="space-y-4">
      {/* 우편번호와 주소 검색을 한 줄에 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 우편번호 필드 */}
        <div className="relative">
          <input
            type="text"
            id={`${name}PostalCode`}
            name={`${name}PostalCode`}
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${className}`}
            placeholder=" "
            value={postalCodeValue || ''}
            readOnly
            disabled={disabled}
          />
          <label
            htmlFor={`${name}PostalCode`}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            우편번호
          </label>
        </div>

        {/* 주소 검색 필드 */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            id={name}
            name={name}
            className={`block px-2.5 pb-2.5 pt-4 pr-10 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer cursor-pointer ${className}`}
            placeholder=" "
            value={addressValue || ''}
            readOnly
            onClick={handleAddressSearch}
            disabled={disabled}
          />
          <label
            htmlFor={name}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            기본주소 검색
          </label>
          <button
            type="button"
            onClick={handleAddressSearch}
            disabled={disabled || isSearching}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-blue-600 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 상세주소 입력 필드 - 주소 검색 후에만 표시 */}
      {addressValue && (
        <div className="relative">
          <input
            type="text"
            id={`${name}Detail`}
            name={`${name}Detail`}
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${className}`}
            placeholder=" "
            value={detailAddressValue || ''}
            onChange={(e) => {
              if (onDetailAddressChange) {
                onDetailAddressChange({
                  target: {
                    name: 'detailAddress',
                    value: e.target.value
                  }
                });
              }
            }}
            disabled={disabled}
          />
          <label
            htmlFor={`${name}Detail`}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            상세주소 (동, 호수 등)
          </label>
        </div>
      )}
      
      {!addressValue && (
        <p className="text-xs text-gray-400">주소 검색 버튼을 클릭하여 기본주소를 선택해주세요</p>
      )}
    </div>
  );
};

export default AddressInput;