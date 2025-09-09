import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import FloatingLabelInput from '../components/FloatingLabelInput';

const Index = () => {
  const [applicant, setApplicant] = useState({ name: "", affiliation: "", phone: "", email: "" });
  const [companyA, setCompanyA] = useState({ region: "", quantity: "" });
  const [companyB, setCompanyB] = useState({ type: "", region: "", quantity: "" });
  const [totalAmount, setTotalAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleTotalAmountChange = (e) => {
    setTotalAmount(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const templateParams = {
      name: applicant.name,
      affiliation: applicant.affiliation,
      phone: applicant.phone,
      email: applicant.email,
      regionA: companyA.region,
      quantityA: companyA.quantity,
      typeB: companyB.type,
      regionB: companyB.region,
      quantityB: companyB.quantity,
      total: totalAmount,
    };

    const serviceID = 'service_gf7tr94';
    const templateID = 'template_5wlvuso';
    const publicKey = 'si6sUamB5hB5f3V6d';

    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      alert('신청이 완료되었습니다.');
      // Clear form
      setApplicant({ name: "", affiliation: "", phone: "", email: "" });
      setCompanyA({ region: "", quantity: "" });
      setCompanyB({ type: "", region: "", quantity: "" });
      setTotalAmount("");
    } catch (error) {
      console.error('Failed to send email:', error);
      alert(`이메일 발송에 실패했습니다: ${error.text}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">퍼스트 DB 신청</h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form>
            <h2 className="text-xl font-semibold mb-4">신청자 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <FloatingLabelInput id="name" name="name" label="이름" value={applicant.name} onChange={handleInputChange(setApplicant)} />
              <FloatingLabelInput id="affiliation" name="affiliation" label="소속" value={applicant.affiliation} onChange={handleInputChange(setApplicant)} />
              <FloatingLabelInput id="phone" name="phone" label="연락처" value={applicant.phone} onChange={handleInputChange(setApplicant)} />
              <FloatingLabelInput id="email" name="email" label="이메일" type="email" value={applicant.email} onChange={handleInputChange(setApplicant)} />
            </div>

            <hr className="my-6" />

            <h2 className="text-xl font-semibold mb-4">A업체</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <FloatingLabelInput id="regionA" name="region" label="지역" value={companyA.region} onChange={handleInputChange(setCompanyA)} />
              <FloatingLabelInput id="quantityA" name="quantity" label="수량" value={companyA.quantity} onChange={handleInputChange(setCompanyA)} />
            </div>

            <hr className="my-6" />

            <h2 className="text-xl font-semibold mb-4">B업체</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <FloatingLabelInput id="typeB" name="type" label="유형" value={companyB.type} onChange={handleInputChange(setCompanyB)} />
              <FloatingLabelInput id="regionB" name="region" label="지역" value={companyB.region} onChange={handleInputChange(setCompanyB)} />
              <FloatingLabelInput id="quantityB" name="quantity" label="수량" value={companyB.quantity} onChange={handleInputChange(setCompanyB)} />
            </div>

            <hr className="my-6" />

            <div className="mb-6">
                <FloatingLabelInput id="totalAmount" name="totalAmount" label="총 금액" value={totalAmount} onChange={handleTotalAmountChange} />
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isSubmitting ? "신청 접수 중..." : "신청하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
