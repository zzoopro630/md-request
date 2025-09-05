export const formatCurrency = (amount, currencyCode = 'KRW', minimumFractionDigits = 0) => {
  const locale = currencyCode === 'KRW' ? 'ko-KR' : 'en-US';
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currencyCode, 
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits 
  }).format(amount);
};

export const getCurrencySymbol = (currencyCode) => {
  return formatCurrency(0, currencyCode).replace(/[\d.,\s]/g, '');
};
