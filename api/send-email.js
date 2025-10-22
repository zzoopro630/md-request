import nodemailer from 'nodemailer';

// Environment variables from Vercel
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_APP_PASSWORD = process.env.SENDER_APP_PASSWORD;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
const RECIPIENT_EMAILS = RECIPIENT_EMAIL ? RECIPIENT_EMAIL.split(',').map(email => email.trim()) : [];

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if environment variables are set
  if (!SENDER_EMAIL || !SENDER_APP_PASSWORD || !RECIPIENT_EMAIL) {
    console.error('Missing environment variables:', {
      SENDER_EMAIL: !!SENDER_EMAIL,
      SENDER_APP_PASSWORD: !!SENDER_APP_PASSWORD,
      RECIPIENT_EMAIL: !!RECIPIENT_EMAIL
    });
    return res.status(500).json({
      success: false,
      error: 'Server configuration error',
      details: 'Email environment variables are not configured. Please check Vercel environment variables settings.'
    });
  }

  const { name, affiliation, phone, email, items_summary, total, full_address } = req.body;
  const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // 1. Email to Admin
  const adminMailOptions = {
    from: `"MD 신청폼" <${SENDER_EMAIL}>`,
    to: RECIPIENT_EMAILS.join(','),
    subject: `[MD신청] ${name} / ${affiliation} / ${formattedDate}`,
    html: `
      <h2>새로운 MD 신청이 접수되었습니다.</h2>
      <p><strong>신청자:</strong> ${name}</p>
      <p><strong>소속:</strong> ${affiliation}</p>
      <p><strong>연락처:</strong> ${phone}</p>
      <p><strong>이메일:</strong> ${email}</p>
      <p><strong>배송지:</strong> ${full_address}</p>
      <hr>
      <h3>신청 내역</h3>
      <div>${items_summary}</div>
      <hr>
      <p><strong>총 합계:</strong> ${total}원</p>
      <hr>
      <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-top: 15px;">
        <p style="margin: 0; font-size: 14px; color: #333; font-weight: bold;">담당자가 확인 후 배송 처리 예정입니다.</p>
      </div>
    `,
  };

  // 2. Confirmation Email to Applicant
  const applicantMailOptions = {
    from: `"THE FIN." <${SENDER_EMAIL}>`,
    to: email, // Send to the applicant's email address
    subject: `[${formattedDate}] MD 신청이 정상적으로 접수되었습니다.`,
    html: `
      <h2>MD 신청이 정상적으로 접수되었습니다.</h2>
      <p>안녕하세요, ${name}님. 신청해주셔서 감사합니다.</p>
      <p>아래는 신청하신 내역입니다. 확인 후 담당자가 개별 연락드리겠습니다.</p>
      <hr>
      <h3>신청 내역</h3>
      <div>${items_summary}</div>
      <hr>
      <p><strong>총 합계:</strong> ${total}원</p>
      <p><strong>배송지:</strong> ${full_address}</p>
      <hr>
      <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-top: 15px;">
        <p style="margin: 0; font-size: 14px; color: #333; font-weight: bold;">담당자가 확인 후 배송 처리 예정입니다.</p>
      </div>
      <br>
      <p><em>*본 메일은 발신 전용입니다.</em></p>
    `,
  };

  // Try sending emails
  try {
    const sendAdminMail = transporter.sendMail(adminMailOptions);
    const sendApplicantMail = transporter.sendMail(applicantMailOptions);

    await Promise.all([sendAdminMail, sendApplicantMail]);

    console.log('✅ All emails sent successfully');
    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully'
    });
  } catch (error) {
    console.error('⚠️ Email sending failed:', error.code, error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message
    });
  }
}
