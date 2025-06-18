const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VITE_EMAIL_USER,
    pass: process.env.VITE_EMAIL_PASS,
  },
});

// Function to send turn notification email
exports.sendTurnNotificationEmail = (
  to,
  patientName,
  tokenNumber,
  clinicName
) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Turn Notification - MediQueue</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #f8f9fa;
          padding: 20px 0;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.15"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
        }
        
        .logo {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -1px;
          position: relative;
          z-index: 1;
        }
        
        .tagline {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 400;
          position: relative;
          z-index: 1;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 25px;
        }
        
        .message {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        
        .notification-card {
          background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%);
          border: 2px solid #68d391;
          border-radius: 16px;
          padding: 30px;
          margin: 30px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .notification-card::before {
          content: '🔔';
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 30px;
          opacity: 0.3;
          transform: rotate(15deg);
        }
        
        .token-number {
          font-size: 56px;
          font-weight: 900;
          color: #38a169;
          margin-bottom: 12px;
          text-shadow: 0 4px 8px rgba(56, 161, 105, 0.2);
          letter-spacing: -2px;
        }
        
        .token-label {
          font-size: 16px;
          color: #2f855a;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        
        .status-text {
          font-size: 18px;
          color: #2f855a;
          font-weight: 600;
          margin-top: 15px;
        }
        
        .clinic-info {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
        }
        
        .clinic-name {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .clinic-name::before {
          content: '🏥';
          font-size: 20px;
        }
        
        .instructions {
          background: #fff5f5;
          border-left: 4px solid #fc8181;
          padding: 20px;
          margin: 25px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .instructions-title {
          font-size: 16px;
          font-weight: 600;
          color: #c53030;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .instructions-title::before {
          content: '⚠️';
          font-size: 18px;
        }
        
        .instructions-text {
          font-size: 14px;
          color: #742a2a;
          line-height: 1.6;
        }
        
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
          font-size: 14px;
          color: #718096;
          margin-bottom: 15px;
        }
        
        .company-name {
          font-size: 18px;
          font-weight: 700;
          color: #4a5568;
          margin-bottom: 5px;
        }
        
        .company-tagline {
          font-size: 12px;
          color: #a0aec0;
          font-style: italic;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin: 25px 0;
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 0 10px;
            border-radius: 12px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .logo {
            font-size: 28px;
          }
          
          .token-number {
            font-size: 44px;
          }
          
          .greeting {
            font-size: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <div class="logo">MediQueue</div>
          <div class="tagline">Smart Healthcare Queue Management</div>
        </div>
        
        <!-- Content -->
        <div class="content">
          <div class="greeting">Hello ${patientName}! 👋</div>
          
          <div class="message">
            Great news! Your appointment is approaching and we want to make sure you're prepared.
          </div>
          
          <!-- Notification Card -->
          <div class="notification-card">
            <div class="token-label">Your Token Number</div>
            <div class="token-number">#${tokenNumber}</div>
            <div class="status-text">🟢 Your turn is coming up soon!</div>
          </div>
          
          <!-- Clinic Info -->
          <div class="clinic-info">
            <div style="font-size: 14px; color: #718096;">
              <strong>Clinic:</strong> ${clinicName}
            </div>
              Please be ready to proceed with your appointment.
            </div>
          </div>
          
          <!-- Instructions -->
          <div class="instructions">
            <div class="instructions-title">Important Reminders</div>
            <div class="instructions-text">
              • Please arrive at the clinic promptly when your number is called<br>
              • Have your identification and appointment details ready<br>
              • If you need to reschedule, please contact the clinic directly<br>
              • Follow all clinic safety protocols and guidelines
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div style="font-size: 16px; color: #4a5568; text-align: center;">
            Thank you for choosing our healthcare services. We appreciate your patience and look forward to serving you! 🏥
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="company-name">MediQueue</div>
          <div class="company-tagline">Revolutionizing Healthcare Experience</div>
          <div class="footer-text">
            This is an automated notification. Please do not reply to this email.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const plainTextVersion = `
    Hello ${patientName}! 👋

    Great news! Your appointment is approaching and we want to make sure you're prepared.

    YOUR TOKEN NUMBER: #${tokenNumber}
    CLINIC: ${clinicName}
    STATUS: Your turn is coming up soon!

    Please be ready to proceed with your appointment at the registered clinic.

    IMPORTANT REMINDERS:
    • Please arrive at the clinic promptly when your number is called
    • Have your identification and appointment details ready  
    • If you need to reschedule, please contact the clinic directly
    • Follow all clinic safety protocols and guidelines

    Thank you for choosing our healthcare services. We appreciate your patience and look forward to serving you!

    ---
    MediQueue - Revolutionizing Healthcare Experience
    This is an automated notification. Please do not reply to this email.
  `;

  return transporter.sendMail({
    from: `"MediQueue Healthcare" <${process.env.VITE_EMAIL_USER}>`,
    to,
    subject: `🔔 Your Turn is Coming Up - Token #${tokenNumber} | MediQueue`,
    text: plainTextVersion,
    html: htmlTemplate,
  });
};
