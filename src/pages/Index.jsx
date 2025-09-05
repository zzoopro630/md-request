import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency'; // Corrected import path
import FloatingLabelInput from '../components/FloatingLabelInput';
import BillToSection from '../components/BillToSection';
import ShipToSection from '../components/ShipToSection';
import ProductSelection from '../components/ProductSelection';
import ItemDetails from "../components/ItemDetails";
import { FiEdit, FiFileText, FiTrash2 } from "react-icons/fi"; // Added FiTrash2 icon
import { RefreshCw } from "lucide-react";
import { set, sub } from "date-fns";

const generateRandomInvoiceNumber = () => {
  const length = Math.floor(Math.random() * 6) + 3;
  const alphabetCount = Math.min(Math.floor(Math.random() * 4), length);
  let result = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  for (let i = 0; i < alphabetCount; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  for (let i = alphabetCount; i < length; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return result;
};

const noteOptions = [
  "Thank you for choosing us today! We hope your shopping experience was pleasant and seamless. Your satisfaction matters to us, and we look forward to serving you again soon. Keep this receipt for any returns or exchanges.",
  "Your purchase supports our community! We believe in giving back and working towards a better future. Thank you for being a part of our journey. We appreciate your trust and hope to see you again soon.",
  "We value your feedback! Help us improve by sharing your thoughts on the text message survey link. Your opinions help us serve you better and improve your shopping experience. Thank you for shopping with us!",
  "Did you know you can save more with our loyalty program? Ask about it on your next visit and earn points on every purchase. It’s our way of saying thank you for being a loyal customer. See you next time!",
  "Need assistance with your purchase? We’re here to help! Reach out to our customer support, or visit our website for more information. We’re committed to providing you with the best service possible.",
  "Keep this receipt for returns or exchanges.",
  "Every purchase makes a difference! We are dedicated to eco-friendly practices and sustainability. Thank you for supporting a greener planet with us. Together, we can build a better tomorrow.",
  "Have a great day!",
  "“Thank you for shopping with us today. Did you know you can return or exchange your items within 30 days with this receipt? We want to ensure that you’re happy with your purchase, so don’t hesitate to come back if you need assistance.",
  "Eco-friendly business. This receipt is recyclable.",
  "We hope you enjoyed your shopping experience! Remember, for every friend you refer, you can earn exclusive rewards. Visit www.example.com/refer for more details. We look forward to welcoming you back soon!",
  "Thank you for choosing us! We appreciate your business and look forward to serving you again. Keep this receipt for any future inquiries or returns.",
  "Your purchase supports local businesses and helps us continue our mission. Thank you for being a valued customer. We hope to see you again soon!",
  "We hope you had a great shopping experience today. If you have any feedback, please share it with us on our website. We are always here to assist you.",
  "Thank you for your visit! Remember, we offer exclusive discounts to returning customers. Check your email for special offers on your next purchase.",
  "Your satisfaction is our top priority. If you need any help or have questions about your purchase, don’t hesitate to contact us. Have a great day!",
  "We love our customers! Thank you for supporting our business. Follow us on social media for updates on promotions and new products. See you next time!",
  "Every purchase counts! We are committed to making a positive impact, and your support helps us achieve our goals. Thank you for shopping with us today!",
  "We hope you found everything you needed. If not, please let us know so we can improve your experience. Your feedback helps us serve you better. Thank you!",
  "Thank you for visiting! Did you know you can save more with our rewards program? Ask about it during your next visit and start earning points today!",
  "We appreciate your trust in us. If you ever need assistance with your order, please visit our website or call customer service. We’re here to help!",
];

const Index = () => {
  const navigate = useNavigate();
  const [billTo, setBillTo] = useState({ name: "", address: "", phone: "" });
  const [shipTo, setShipTo] = useState({ name: "", address: "", phone: "" });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [invoice, setInvoice] = useState({
    date: "",
    paymentDate: "",
    number: "",
  });
  const [items, setItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [notes, setNotes] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const refreshNotes = () => {
    const randomIndex = Math.floor(Math.random() * noteOptions.length);
    setNotes(noteOptions[randomIndex]);
  };

  useEffect(() => {
    // Load form data from localStorage on component mount
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setBillTo(parsedData.billTo || { name: "", address: "", phone: "" });
      setShipTo(parsedData.shipTo || { name: "", address: "", phone: "" });
      setInvoice(
        parsedData.invoice || { date: "", paymentDate: "", number: "" }
      );
      setItems(parsedData.items || []);
      setNotes(parsedData.notes || "");
    } else {
      // If no saved data, set invoice number
      setInvoice((prev) => ({
        ...prev,
        number: generateRandomInvoiceNumber(),
      }));
    }
  }, []);

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    const formData = {
      billTo,
      shipTo,
      invoice,
      items,
      grandTotal,
      notes,
    };
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [
    billTo,
    shipTo,
    invoice,
    items,
    notes,
    grandTotal,
  ]);

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "quantity" || field === "amount") {
      newItems[index].total = newItems[index].quantity * newItems[index].amount;
    }
    setItems(newItems);
    updateTotals();
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", description: "", quantity: 0, amount: 0, total: 0 },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateGrandTotal = () => {
    const total = selectedProducts.reduce((sum, item) => sum + item.total, 0);
    setGrandTotal(total);
    return total;
  };

  const updateTotals = () => {
    calculateGrandTotal();
  };

  useEffect(() => {
    updateTotals();
  }, [selectedProducts]);

  const handleTemplateClick = () => {
    const formData = {
      billTo,
      shipTo,
      invoice,
      items,
      grandTotal,
      notes,
    };
    navigate("/template", {
      state: { formData, selectedTemplate: 7 },
    });
  };

  const handleOrder = async () => {
    setIsOrdering(true);

    const invoiceData = {
      billTo,
      shipTo,
      invoice,
      items,
      grandTotal,
      notes,
    };

    console.log('Sending invoice data:', invoiceData);

    try {
      const response = await fetch('http://localhost:3001/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        navigate("/order-confirmation");
      } else {
        // Handle error case
        console.error('Failed to send invoice. Status:', response.status);
        alert('주문 처리에 실패했습니다. 다시 시도해주세요.');
        setIsOrdering(false);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsOrdering(false);
    }
  };

  const fillDummyData = () => {
    setBillTo({
      name: "John Doe",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
    });
    setShipTo({
      name: "Jane Smith",
      address: "456 Elm St, Othertown, USA",
      phone: "(555) 987-6543",
    });
    setInvoice({
      date: new Date().toISOString().split("T")[0],
      paymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      number: generateRandomInvoiceNumber(),
    });
    setItems([
      {
        name: "Product A",
        description: "High-quality item",
        quantity: 2,
        amount: 50,
        total: 100,
      },
      {
        name: "Service B",
        description: "Professional service",
        quantity: 1,
        amount: 200,
        total: 200,
      },
      {
        name: "Product C",
        description: "Another great product",
        quantity: 3,
        amount: 30,
        total: 90,
      },
      {
        name: "Service D",
        description: "Another professional service",
        quantity: 2,
        amount: 150,
        total: 300,
      },
      {
        name: "Product E",
        description: "Yet another product",
        quantity: 1,
        amount: 75,
        total: 75,
      },
      {
        name: "Service F",
        description: "Yet another service",
        quantity: 4,
        amount: 100,
        total: 400,
      },
    ]);
    setNotes("Thank you for your business!");
  };

  const clearForm = () => {
    setBillTo({ name: "", address: "", phone: "" });
    setShipTo({ name: "", address: "", phone: "" });
    setInvoice({
      date: "",
      paymentDate: "",
      number: generateRandomInvoiceNumber(),
    });
    setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
    setNotes("");
    localStorage.removeItem("formData");
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-8 text-center">청구서 생성기</h1>
      <div className="fixed top-4 left-4 flex gap-2">
        <button
          onClick={clearForm}
          className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
          aria-label="Clear Form"
        >
          <FiTrash2 size={24} />
        </button>
        <button
          onClick={fillDummyData}
          className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
          aria-label="Fill with Dummy Data"
        >
          <FiEdit size={24} />
        </button>
      </div>
      <button
        onClick={handleTemplateClick}
        className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600"
        aria-label="Generate Invoice"
      >
        <FiFileText size={24} />
      </button>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form>
            <BillToSection
              billTo={billTo}
              handleInputChange={handleInputChange(setBillTo)}
            />
            <ShipToSection
              shipTo={shipTo}
              handleInputChange={handleInputChange(setShipTo)}
              billTo={billTo}
            />

            <ProductSelection
              selectedProducts={selectedProducts}
              onSelectedProductsChange={setSelectedProducts}
            />


            <div className="mb-6">
              <div className="flex justify-between font-bold">
                <span>총합계:</span>
                <span>{formatCurrency(grandTotal, "KRW")}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium">비고</h3>
                <button
                  type="button"
                  onClick={refreshNotes}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200"
                  title="Refresh Notes"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
              ></textarea>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleOrder}
                disabled={isOrdering}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isOrdering ? "주문 접수 중..." : "주문하기"}
              </button>
            </div>

            {/* Clear Form button removed */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
