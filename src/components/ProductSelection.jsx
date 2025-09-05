import React, { useState, useEffect } from 'react';
import FloatingLabelSelect from './FloatingLabelSelect';
import FloatingLabelInput from './FloatingLabelInput';
import { formatCurrency } from '../utils/formatCurrency';
import { Trash2, Plus } from 'lucide-react';

const ProductSelection = ({ selectedProducts = [], onSelectedProductsChange }) => {
  const [currentProduct, setCurrentProduct] = useState('웰컴키트');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  // 제품 목록과 단가 정의
  const products = [
    { name: '웰컴키트', price: 33000 },
    { name: '보험가이드북', price: 9200 },
    { name: '바인더+펜', price: 19000 },
    { name: '고객노트', price: 3500 },
    { name: '기프트박스', price: 1500 },
    { name: '사원증', price: 14000 }
  ];

  const productOptions = products.map(product => product.name);

  const addProduct = () => {
    if (!currentProduct) {
      setErrorMessage('제품을 선택해주세요.');
      return;
    }

    if (currentQuantity <= 0) {
      setErrorMessage('수량은 1개 이상이어야 합니다.');
      return;
    }

    // 중복 체크
    const isDuplicate = selectedProducts.some(item => item.name === currentProduct);
    if (isDuplicate) {
      setErrorMessage('이미 선택한 상품입니다.');
      return;
    }

    const selectedProductInfo = products.find(p => p.name === currentProduct);
    const newProduct = {
      id: Date.now(), // 간단한 ID 생성
      name: currentProduct,
      price: selectedProductInfo.price,
      quantity: currentQuantity,
      total: selectedProductInfo.price * currentQuantity
    };

    const updatedProducts = [...selectedProducts, newProduct];
    onSelectedProductsChange(updatedProducts);

    // 폼 리셋
    setCurrentProduct('');
    setCurrentQuantity(1);
    setErrorMessage('');
  };

  const removeProduct = (id) => {
    const updatedProducts = selectedProducts.filter(item => item.id !== id);
    onSelectedProductsChange(updatedProducts);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    
    const updatedProducts = selectedProducts.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          total: item.price * newQuantity
        };
      }
      return item;
    });
    onSelectedProductsChange(updatedProducts);
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">제품 선택</h2>
      
      {/* 제품 추가 폼 */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FloatingLabelSelect
            id="productSelect"
            label="제품 선택"
            value={currentProduct}
            onChange={(e) => {
              setCurrentProduct(e.target.value);
              setErrorMessage('');
            }}
            name="currentProduct"
            options={productOptions}
          />
          
          <FloatingLabelInput
            id="quantity"
            label="수량"
            type="number"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
            name="quantity"
            disabled={!currentProduct}
          />

          <button
            type="button"
            onClick={addProduct}
            disabled={!currentProduct}
            className="flex items-center justify-center bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed h-12 mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            추가
          </button>
        </div>

        {/* 오류 메시지 */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>

      {/* 선택된 제품 목록 */}
      {selectedProducts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">선택된 제품</h3>
          {selectedProducts.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <span className="font-medium text-gray-600">제품:</span>
                  <p className="text-gray-900">{item.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">단가:</span>
                  <p className="text-gray-900">{formatCurrency(item.price, 'KRW')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">수량:</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-20 p-1 border rounded text-center"
                    min="1"
                  />
                </div>
                <div>
                  <span className="font-medium text-gray-600">합계:</span>
                  <p className="text-blue-600 font-bold">{formatCurrency(item.total, 'KRW')}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeProduct(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="제품 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 총 합계 */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">총 합계:</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalAmount(), 'KRW')}</span>
            </div>
          </div>
        </div>
      )}

      {/* 제품이 없을 때 안내 */}
      {selectedProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>제품을 선택하여 추가해주세요</p>
        </div>
      )}
    </div>
  );
};

export default ProductSelection;