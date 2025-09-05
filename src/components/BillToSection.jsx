import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import FloatingLabelSelect from './FloatingLabelSelect';

const BillToSection = ({ billTo, handleInputChange }) => {
  const organizations = ['GOAT', '감동', '다올', '다원', '달', '라온', '유럽', '직할', '캐슬', '해성', '혜윰'];

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">신청자 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          id="billToName"
          label="이름"
          value={billTo.name}
          onChange={handleInputChange}
          name="name"
        />
        <FloatingLabelSelect
          id="billToOrganization"
          label="소속"
          value={billTo.phone}
          onChange={handleInputChange}
          name="phone"
          options={organizations}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FloatingLabelInput
          id="billToPhone"
          label="전화번호"
          type="tel"
          value={billTo.address}
          onChange={handleInputChange}
          name="address"
        />
        <FloatingLabelInput
          id="billToEmail"
          label="이메일"
          type="email"
          value={billTo.email || ''}
          onChange={handleInputChange}
          name="email"
        />
      </div>
    </div>
  );
};

export default BillToSection;