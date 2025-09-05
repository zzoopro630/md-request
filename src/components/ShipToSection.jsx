import React, { useState } from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import FloatingLabelSelect from './FloatingLabelSelect';
import AddressInput from './AddressInput';

const ShipToSection = ({ shipTo, handleInputChange, billTo }) => {
  const [copyBillToShip, setCopyBillToShip] = useState(false);
  const organizations = ['GOAT', '감동', '다올', '다원', '달', '라온', '유럽', '직할', '캐슬', '해성', '혜윰'];

  const handleCopyBillToShip = (e) => {
    setCopyBillToShip(e.target.checked);
    if (e.target.checked) {
      handleInputChange({ target: { name: 'name', value: billTo.name } });
      handleInputChange({ target: { name: 'address', value: billTo.address } });
      handleInputChange({ target: { name: 'phone', value: billTo.phone } });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">배송지</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="copyBillToShip"
            checked={copyBillToShip}
            onChange={handleCopyBillToShip}
            className="mr-2"
          />
          <label htmlFor="copyBillToShip">신청자와 동일</label>
        </div>
      </div>
      <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FloatingLabelInput
              id="shipToName"
              label="이름"
              value={shipTo.name}
              onChange={handleInputChange}
              name="name"
            />
            <FloatingLabelSelect
              id="shipToOrganization"
              label="소속"
              value={shipTo.phone}
              onChange={handleInputChange}
              name="phone"
              options={organizations}
            />
            <FloatingLabelInput
              id="shipToPhone"
              label="전화번호"
              type="tel"
              value={shipTo.address}
              onChange={handleInputChange}
              name="address"
            />
          </div>
          <div className="mt-4">
            <AddressInput
              addressValue={shipTo.fullAddress || ''}
              postalCodeValue={shipTo.postalCode || ''}
              detailAddressValue={shipTo.detailAddress || ''}
              onAddressChange={handleInputChange}
              onPostalCodeChange={handleInputChange}
              onDetailAddressChange={handleInputChange}
              name="fullAddress"
            />
          </div>
        </div>
    </div>
  );
};

export default ShipToSection;
