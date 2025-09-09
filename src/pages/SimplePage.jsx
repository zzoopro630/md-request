import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from 'lucide-react';

const affiliations = ["GOAT", "감동", "다올", "다원", "달", "라온", "유럽", "직할", "캐슬", "해성", "혜윰"];
const regions = ["수도권", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const companyBTypes = [
  { name: "보장분석", price: 75000 },
  { name: "여성100%", price: 85000 },
  { name: "실버", price: 50000 },
];

const SimplePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', affiliation: '', phone: '010-', email: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [currentItem, setCurrentItem] = useState({ dbType: 'A', region: '', quantity: 1, typeB: '' });
  const [currentItemPrice, setCurrentItemPrice] = useState(75000);

  useEffect(() => {
    const newTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
    setTotal(newTotal);
  }, [selectedItems]);

  useEffect(() => {
    let price = 0;
    if (currentItem.dbType === 'A') {
        price = (currentItem.quantity || 0) * 75000;
    } else {
        const selectedType = companyBTypes.find(t => t.name === currentItem.typeB);
        if (selectedType) {
            price = (currentItem.quantity || 0) * selectedType.price;
        }
    }
    setCurrentItemPrice(price);
  }, [currentItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
        const digits = value.replace(/[^\d]/g, '').substring(3);
        let formattedPhone = '010-';
        if (digits.length > 0) {
            formattedPhone += digits.substring(0, 4);
        }
        if (digits.length > 4) {
            formattedPhone += '-' + digits.substring(4, 8);
        }
        setFormData(prev => ({ ...prev, phone: formattedPhone }));
    } else if (name === 'name') {
      const nameRegex = /^[ㄱ-ㅎ|가-힣|]*$/;
      if (nameRegex.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCurrentItemChange = (field, value) => {
    const newValues = { ...currentItem, [field]: value };
    if (field === 'dbType') {
        newValues.region = '';
        newValues.typeB = '';
        newValues.quantity = 1;
    }
    setCurrentItem(newValues);
  };

  const handleAddItem = () => {
    let newItem = {};
    let currentErrors = {};
    if (currentItem.dbType === 'A') {
        if (!currentItem.region) currentErrors.region = "지역을 선택해주세요";
        if (!currentItem.quantity || currentItem.quantity <= 0) currentErrors.quantity = "수량을 1 이상 입력해주세요";
        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }
        newItem = { id: Date.now(), name: `A업체 - ${currentItem.region}`, quantity: currentItem.quantity, price: 75000, total: currentItem.quantity * 75000 };
    } else {
        if (!currentItem.typeB) currentErrors.typeB = "유형을 선택해주세요";
        if (!currentItem.region) currentErrors.region = "지역을 선택해주세요";
        if (!currentItem.quantity || currentItem.quantity <= 0) currentErrors.quantity = "수량을 1 이상 입력해주세요";
        const selectedTypeB = companyBTypes.find(t => t.name === currentItem.typeB);
        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }
        newItem = { id: Date.now(), name: `B업체 - ${currentItem.typeB} (${currentItem.region})`, quantity: currentItem.quantity, price: selectedTypeB.price, total: currentItem.quantity * selectedTypeB.price };
    }
    setSelectedItems(prev => [...prev, newItem]);
    setErrors({});
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const validate = () => {
      const newErrors = {};
      if (!formData.name) newErrors.name = "이름을 확인해주세요";
      if (!formData.affiliation) newErrors.affiliation = "소속을 확인해주세요";
      if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) newErrors.phone = "전화번호를 확인해주세요";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "이메일을 입력해주세요";
      if (selectedItems.length === 0) newErrors.items = "하나 이상의 DB를 주문에 추가해주세요.";
      return newErrors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }
    setErrors({});
    setIsSubmitting(true);

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const itemsSummary = selectedItems.map(item => 
        `${item.name} - 수량: ${item.quantity}, 금액: ${item.total.toLocaleString()}원`
    ).join('\n');

    const templateParams = { ...formData, items_summary: itemsSummary, total: total.toLocaleString(), to_email: formData.email, admin_email: 'songnakjoo@gmail.com' };

    emailjs.send(serviceID, templateID, { ...templateParams, to_email: 'songnakjoo@gmail.com' }, publicKey)
      .then((response) => {
        console.log('SUCCESS! - Admin', response.status, response.text);
        navigate('/order-confirmation');
      }, (err) => {
        console.log('FAILED... - Admin', err);
        setErrors({ submit: '관리자 이메일 발송에 실패했습니다.' });
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="border border-gray-300">
          <CardHeader>
            <CardTitle className="text-4xl text-center">퍼스트 DB 신청</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="한글로 입력하세요" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="affiliation">소속</Label>
                  <Select name="affiliation" onValueChange={(value) => handleSelectChange('affiliation', value)}><SelectTrigger><SelectValue placeholder="소속을 선택하세요" /></SelectTrigger><SelectContent>{affiliations.map(aff => <SelectItem key={aff} value={aff}>{aff}</SelectItem>)}</SelectContent></Select>
                  {errors.affiliation && <p className="text-sm text-red-500">{errors.affiliation}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="010-0000-0000" />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="이메일을 입력하세요" />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="p-4 border rounded-md space-y-4">
                <h3 className="font-semibold">DB 선택 및 추가</h3>
                <RadioGroup value={currentItem.dbType} onValueChange={(v) => handleCurrentItemChange('dbType', v)} className="flex space-x-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="A" id="db-a" /><Label htmlFor="db-a">A업체</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="B" id="db-b" /><Label htmlFor="db-b">B업체</Label></div>
                </RadioGroup>

                {currentItem.dbType === 'A' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>지역</Label>
                            <Select onValueChange={(v) => handleCurrentItemChange('region', v)}><SelectTrigger><SelectValue placeholder="지역 선택" /></SelectTrigger><SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                            {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>수량</Label>
                            <Input type="number" value={currentItem.quantity} onChange={(e) => handleCurrentItemChange('quantity', parseInt(e.target.value, 10))} min="1" />
                            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label>유형</Label>
                            <Select onValueChange={(v) => handleCurrentItemChange('typeB', v)}><SelectTrigger><SelectValue placeholder="유형 선택" /></SelectTrigger><SelectContent>{companyBTypes.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}</SelectContent></Select>
                            {errors.typeB && <p className="text-sm text-red-500">{errors.typeB}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>지역</Label>
                            <Select onValueChange={(v) => handleCurrentItemChange('region', v)}><SelectTrigger><SelectValue placeholder="지역 선택" /></SelectTrigger><SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                            {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>수량</Label>
                            <Input type="number" value={currentItem.quantity} onChange={(e) => handleCurrentItemChange('quantity', parseInt(e.target.value, 10))} min="1" />
                            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                        </div>
                    </div>
                )}
                <div className="text-md font-semibold text-right pr-2">신청금액: {currentItemPrice.toLocaleString()}원</div>
                <Button type="button" onClick={handleAddItem} className="w-full">주문 추가</Button>
              </div>

              {selectedItems.length > 0 && (
                <div className="p-4 border rounded-md space-y-2">
                    <h3 className="font-semibold">주문 내역</h3>
                    {selectedItems.map((item, index) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <span>{index + 1}. {item.name} (수량: {item.quantity})</span>
                            <div className="flex items-center gap-4">
                                <span>{item.total.toLocaleString()}원</span>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
              )}
              {errors.items && <p className="text-sm text-red-500 text-center">{errors.items}</p>}
              
              <div className="text-xl font-bold text-right">
                총 금액: {total.toLocaleString()}원
              </div>

              <Button type="submit" className="w-full text-white btn-gradient-flow transition-transform duration-300 hover:scale-105" disabled={isSubmitting || selectedItems.length === 0}>
                {isSubmitting ? '신청하는 중...' : '신청하기'}
              </Button>
              {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimplePage;