import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from 'lucide-react';
import AddressInput from '@/components/AddressInput';

const affiliations = ["GOAT", "감동", "다올", "다원", "달", "라온", "미르", "유럽", "직할", "캐슬", "해성", "혜윰"];
const products = [
  { name: "웰컴키트", price: 33000 },
  { name: "보험가이드북", price: 9200 },
  { name: "바인더+볼펜", price: 19000 },
  { name: "고객노트", price: 3500 },
  { name: "기프트박스", price: 1500 },
  { name: "사원증", price: 14000 },
  { name: "쇼핑백", price: 1000 }
];

const CheckboxGridPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    affiliation: '', 
    phone: '010-', 
    email: '',
    address: '',
    postalCode: '',
    detailAddress: ''
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayErrors, setDisplayErrors] = useState({});
  const [nameEnglishWarning, setNameEnglishWarning] = useState('');
  const [emailKoreanWarning, setEmailKoreanWarning] = useState('');

  // 체크박스 선택 상태
  const [selections, setSelections] = useState({});

  useEffect(() => {
    const newTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
    setTotal(newTotal);
  }, [selectedItems]);

  useEffect(() => {
    const englishRegex = /[a-zA-Z]/;
    setNameEnglishWarning(englishRegex.test(formData.name) ? '이름에는 영문을 사용할 수 없습니다.' : '');
  }, [formData.name]);

  useEffect(() => {
    const koreanRegex = /[ㄱ-ㅎ|가-힣]/;
    setEmailKoreanWarning(koreanRegex.test(formData.email) ? '이메일 주소에는 한글을 사용할 수 없습니다.' : '');
  }, [formData.email]);

  // 높이 변화 감지 및 부모 창에 전달 (iframe 사용시)
  useEffect(() => {
    const sendHeight = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.scrollHeight,
        document.body.offsetHeight
      );
      
      // 부모 창이 있는 경우 (iframe 내부에서 실행되는 경우)
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'resize',
          height: height + 50 // 여유 공간 추가
        }, '*');
      }
    };

    // 초기 높이 전송
    sendHeight();

    // ResizeObserver로 높이 변화 감지
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(sendHeight, 100); // 약간의 지연을 주어 렌더링 완료 후 측정
    });

    // MutationObserver로 DOM 변화 감지
    const mutationObserver = new MutationObserver(() => {
      setTimeout(sendHeight, 100);
    });

    // 관찰 시작
    resizeObserver.observe(document.body);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // 윈도우 리사이즈 이벤트도 감지
    window.addEventListener('resize', sendHeight);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', sendHeight);
    };
  }, []);

  // 선택된 항목이나 폼 상태가 변경될 때마다 높이 재계산
  useEffect(() => {
    const sendHeight = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.scrollHeight,
        document.body.offsetHeight
      );
      
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'resize',
          height: height + 50
        }, '*');
      }
    };

    setTimeout(sendHeight, 200); // DOM 업데이트 후 높이 재계산
  }, [selectedItems, displayErrors, nameEnglishWarning, emailKoreanWarning]);

  const handleCheckboxChange = (productName, checked) => {
    const productInfo = products.find(p => p.name === productName);
    
    if (checked) {
      // 항목 추가
      const newItem = {
        id: Date.now() + Math.random(),
        name: productName,
        type: productName,
        quantity: 1,
        price: productInfo.price,
        total: productInfo.price
      };
      setSelectedItems(prev => [...prev, newItem]);
      setSelections(prev => ({ ...prev, [productName]: true }));
    } else {
      // 항목 제거
      setSelectedItems(prev => prev.filter(item => item.type !== productName));
      setSelections(prev => {
        const newSelections = { ...prev };
        delete newSelections[productName];
        return newSelections;
      });
    }
  };

  const handleQuantityChangeInList = (id, newQuantity) => {
    const quantity = Math.max(0, parseInt(newQuantity, 10) || 0);
    setSelectedItems(prevItems => 
        prevItems.map(item => 
            item.id === id ? { ...item, quantity, total: quantity * item.price } : item
        ).filter(item => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id) => {
    const itemToRemove = selectedItems.find(item => item.id === id);
    if (itemToRemove) {
      setSelections(prev => {
        const newSelections = { ...prev };
        delete newSelections[itemToRemove.type];
        return newSelections;
      });
    }
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleApplicantInfoChange = (e) => {
    setDisplayErrors({});
    const { name, value } = e.target;

    if (name === 'phone') {
        const digits = value.replace(/[^\d]/g, '').substring(3);
        let formattedPhone = '010-';
        if (digits.length > 0) formattedPhone += digits.substring(0, 4);
        if (digits.length > 4) formattedPhone += '-' + digits.substring(4, 8);
        setFormData(prev => ({ ...prev, phone: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e) => {
    setDisplayErrors({});
    setFormData(prev => ({ ...prev, address: e.target.value }));
  };

  const handlePostalCodeChange = (e) => {
    setFormData(prev => ({ ...prev, postalCode: e.target.value }));
  };

  const handleDetailAddressChange = (e) => {
    setDisplayErrors({});
    setFormData(prev => ({ ...prev, detailAddress: e.target.value }));
  };

  const handleAffiliationChange = (value) => {
    setDisplayErrors({});
    setFormData(prev => ({ ...prev, affiliation: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name) newErrors.name = "이름을 확인해주세요";
    if (nameEnglishWarning) newErrors.name = nameEnglishWarning;
    if (!formData.affiliation) newErrors.affiliation = "소속을 확인해주세요";
    if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) newErrors.phone = "전화번호를 확인해주세요";
    if (!formData.email) newErrors.email = "이메일을 입력해주세요";
    if (emailKoreanWarning) newErrors.email = emailKoreanWarning;
    if (!formData.address) newErrors.address = "주소를 입력해주세요";
    if (!formData.detailAddress && formData.address) newErrors.detailAddress = "상세주소를 입력해주세요";
    if (selectedItems.length === 0) newErrors.items = "하나 이상의 상품을 신청내역에 추가해주세요.";

    if (Object.keys(newErrors).length > 0) {
        setDisplayErrors(newErrors);
        return;
    }
    
    setDisplayErrors({});
    setIsSubmitting(true);

    const serviceID = 'service_gf7tr94';
    const templateID = 'template_5wlvuso';
    const publicKey = 'si6sUamB5hB5f3V6d';
    const itemsSummary = selectedItems.map(item => `${item.name} - 수량: ${item.quantity}, 금액: ${item.total.toLocaleString()}원`).join('<br>');
    const fullAddress = `[우: ${formData.postalCode}] ${formData.address} ${formData.detailAddress}`;
    const templateParams = { ...formData, items_summary: itemsSummary, total: total.toLocaleString(), full_address: fullAddress };
    
    emailjs.init(publicKey);
    emailjs.send(serviceID, templateID, templateParams)
      .then(() => {
        navigate('/order-confirmation');
      }, (err) => {
        setDisplayErrors({ submit: `이메일 발송에 실패했습니다: ${err.text}` });
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Card className="border border-gray-300">
          <CardHeader>
            <CardTitle className="text-4xl text-center">퍼스트 MD 신청</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {/* 상품 선택 섹션 */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">상품 선택</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map(product => (
                    <Card key={product.name} className="p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={product.name}
                          checked={selections[product.name] || false}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(product.name, checked)
                          }
                        />
                        <Label htmlFor={product.name} className="flex-1 cursor-pointer">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.price.toLocaleString()}원</div>
                        </Label>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 선택된 항목들 */}
              {selectedItems.length > 0 && (
                <div className="p-4 border rounded-md space-y-2">
                    <h3 className="font-semibold">신청 내역</h3>
                    {selectedItems.map((item, index) => (
                        <div key={item.id} className="p-3 bg-gray-50 rounded-md space-y-2">
                            {/* 첫 번째 줄: 제품명 */}
                            <div className="font-medium text-sm">
                                {index + 1}. {item.name}
                            </div>
                            {/* 두 번째 줄: 수량 조절, 가격, 삭제 버튼 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-r-none" onClick={() => handleQuantityChangeInList(item.id, item.quantity - 1)}>-</Button>
                                    <Input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => handleQuantityChangeInList(item.id, e.target.value)}
                                        className="w-16 h-8 text-center rounded-none border-l-0 border-r-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                        min="0"
                                    />
                                    <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-l-none" onClick={() => handleQuantityChangeInList(item.id, item.quantity + 1)}>+</Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-blue-600">{item.total.toLocaleString()}원</span>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              )}

              {/* 총 금액 표시 */}
              {selectedItems.length > 0 && (
                <div className="text-xl font-bold text-right bg-blue-50 p-4 rounded-md border-2 border-blue-200">
                  총 금액: {total.toLocaleString()}원
                </div>
              )}

              {/* 신청자 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" name="name" type="text" value={formData.name} onChange={handleApplicantInfoChange} placeholder="한글로 입력하세요" />
                  {nameEnglishWarning && <p className="text-sm text-yellow-600 mt-1">{nameEnglishWarning}</p>}
                  {displayErrors.name && <p className="text-sm text-red-500">{displayErrors.name}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="affiliation">소속</Label>
                  <Select onValueChange={handleAffiliationChange}><SelectTrigger><SelectValue placeholder="소속을 선택하세요" /></SelectTrigger><SelectContent>{affiliations.map(aff => <SelectItem key={aff} value={aff}>{aff}</SelectItem>)}</SelectContent></Select>
                  {displayErrors.affiliation && <p className="text-sm text-red-500">{displayErrors.affiliation}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleApplicantInfoChange} placeholder="010-0000-0000" />
                  {displayErrors.phone && <p className="text-sm text-red-500">{displayErrors.phone}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleApplicantInfoChange} placeholder="이메일을 입력하세요" />
                  {emailKoreanWarning && <p className="text-sm text-yellow-600 mt-1">{emailKoreanWarning}</p>}
                  {displayErrors.email && <p className="text-sm text-red-500 mt-1">{displayErrors.email}</p>}
                </div>
              </div>

              {/* 주소 입력 */}
              <div className="space-y-4">
                <Label>배송지 입력</Label>
                <AddressInput
                  addressValue={formData.address}
                  postalCodeValue={formData.postalCode}
                  detailAddressValue={formData.detailAddress}
                  onAddressChange={handleAddressChange}
                  onPostalCodeChange={handlePostalCodeChange}
                  onDetailAddressChange={handleDetailAddressChange}
                  name="deliveryAddress"
                />
                {displayErrors.address && <p className="text-sm text-red-500">{displayErrors.address}</p>}
                {displayErrors.detailAddress && <p className="text-sm text-red-500">{displayErrors.detailAddress}</p>}
              </div>

              {displayErrors.items && <p className="text-sm text-red-500 text-center">{displayErrors.items}</p>}

              <Button type="button" onClick={handleSubmit} className="w-full text-white btn-gradient-flow transition-transform duration-300 hover:scale-105" disabled={isSubmitting || selectedItems.length === 0 || !!emailKoreanWarning || !!nameEnglishWarning}>
                {isSubmitting ? '신청하는 중...' : '신청하기'}
              </Button>
              {displayErrors.submit && <p className="text-sm text-red-500 text-center">{displayErrors.submit}</p>}
            </form>
            <div className="mt-8 flex justify-center">
                <img 
                    src="/logo_black.png?v=1" 
                    alt="Logo" 
                    className="h-7 max-w-full" 
                    loading="eager"
                    onError={(e) => {
                        console.error('Logo loading failed');
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMTAwIDMwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwIiB5PSIxNSIgZmlsbD0iYmxhY2siIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5Mb2dvPC90ZXh0Pjwvc3ZnPg==';
                    }}
                />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckboxGridPage;
