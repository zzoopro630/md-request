import React from 'react';
import { format } from 'date-fns';
import BaseTemplate from './BaseTemplate';
import { formatCurrency } from '../../utils/formatCurrency';

const Template7 = ({ data }) => {
  const { billTo = {}, shipTo = {}, invoice = {}, yourCompany = {}, items = [], taxPercentage = 0, taxAmount = 0, subTotal = 0, grandTotal = 0, notes = '' } = data || {};

  return (
    <BaseTemplate data={data}>
      <div className="bg-white p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">청구서</h1>
            <p>
              <span className="font-semibold">청구서 번호:</span>{" "}
              {invoice.number || "N/A"}
            </p>
            <p>
              <span className="font-semibold">청구일:</span>{" "}
              {invoice.date
                ? format(new Date(invoice.date), "MMM dd, yyyy")
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold">지급기한:</span>{" "}
              {invoice.paymentDate
                ? format(new Date(invoice.paymentDate), "MMM dd, yyyy")
                : "N/A"}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">
              {yourCompany.name || "Your Company Name"}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 bg-gray-100 p-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">발행처</h3>
            <p>{yourCompany.name || "Your Company Name"}</p>
            <p>{yourCompany.address || "Your Company Address"}</p>
            <p>{yourCompany.phone || "Your Company Phone"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">청구처</h3>
            <p>{billTo.name || "Client Name"}</p>
            <p>{billTo.address || "Client Address"}</p>
            <p>{billTo.phone || "Client Phone"}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead style={{ backgroundColor: "#4B4B4B", color: "white" }}>
            <tr>
              <th className="p-2 text-left">품목 번호/품목 설명</th>
              <th className="p-2 text-right">수량</th>
              <th className="p-2 text-right">단가</th>
              <th className="p-2 text-right">총액</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-2">{item.name || "Item Name"}</td>
                <td className="p-2 text-right">{item.quantity || 0}</td>
                <td className="p-2 text-right">
                  {formatCurrency(item.amount || 0, "KRW")}
                </td>
                <td className="p-2 text-right">
                  {formatCurrency((item.quantity || 0) * (item.amount || 0), "KRW")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-1/3">
            <p className="flex justify-between">
              <span>소계:</span> <span>{formatCurrency(subTotal, "KRW")}</span>
            </p>
            {taxPercentage > 0 && (
              <p className="flex justify-between">
                <span>세액 ({taxPercentage}%):</span>{" "}
                <span>{formatCurrency(taxAmount, "KRW")}</span>
              </p>
            )}
            <p className="flex justify-between font-bold text-lg mt-2">
              <span>총액:</span> <span>{formatCurrency(grandTotal, "KRW")}</span>
            </p>
          </div>
        </div>

        {notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">조건:</h3>
            <p>{notes}</p>
          </div>
        )}
      </div>
    </BaseTemplate>
  );
};

export default Template7;
