import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { JSDOM } from 'jsdom';
import { jsPDF } from 'jspdf';
import fs from 'fs';

const app = express();
const port = 3001;

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173']
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.post('/api/send-invoice', (req, res) => {
  const invoiceData = req.body;
  console.log('Received invoice data:', invoiceData);

  // Create HTML content for the PDF
  const htmlContent = `
    <html>
      <body>
        <h1>Invoice</h1>
        <p><strong>Invoice Number:</strong> ${invoiceData.invoice.number}</p>
        <p><strong>Invoice Date:</strong> ${invoiceData.invoice.date}</p>
        <hr/>
        <h2>Bill To:</h2>
        <p><strong>Name:</strong> ${invoiceData.billTo.name}</p>
        <p><strong>Address:</strong> ${invoiceData.billTo.address}</p>
        <p><strong>Phone:</strong> ${invoiceData.billTo.phone}</p>
        <hr/>
        <h2>Items:</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.amount}</td>
                <td>${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr/>
        <h2>Grand Total: ${invoiceData.grandTotal}</h2>
        <hr/>
        <p><strong>Notes:</strong></p>
        <p>${invoiceData.notes}</p>
      </body>
    </html>
  `;

  const dom = new JSDOM(htmlContent);
  const doc = new jsPDF();

  doc.html(dom.window.document.body, {
    callback: function (doc) {
      const pdfPath = 'invoice.pdf';
      doc.save(pdfPath);
      console.log('PDF generated successfully at', pdfPath);
      res.status(200).send({ message: 'Invoice received and PDF generated' });
    },
    x: 10,
    y: 10
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
