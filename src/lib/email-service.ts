import nodemailer from 'nodemailer';

// Gmail SMTP transporter
const createGmailTransporter = () => {
  const user = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!user || !appPassword) {
    throw new Error('Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: appPassword,
    },
  });
};

// SendGrid SMTP transporter (if using SendGrid)
const createSendGridTransporter = () => {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    throw new Error('SendGrid API key not configured. Set SENDGRID_API_KEY.');
  }

  return nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: apiKey,
    },
  });
};

// Custom SMTP transporter
const createCustomTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) {
    throw new Error('Custom SMTP credentials not configured.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
  });
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const emailService = process.env.EMAIL_SERVICE || 'gmail';

  try {
    if (emailService === 'gmail') {
      transporter = createGmailTransporter();
    } else if (emailService === 'sendgrid') {
      transporter = createSendGridTransporter();
    } else {
      transporter = createCustomTransporter();
    }
    return transporter;
  } catch (error) {
    console.error('[EmailService] Error creating transporter:', error);
    throw error;
  }
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const transporter = getTransporter();
    const senderEmail = process.env.EMAIL_FROM || process.env.GMAIL_USER || 'noreply@madadwala.com';

    await transporter.sendMail({
      from: `Madadwala <${senderEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`[EmailService] Email sent to ${options.to}`);
  } catch (error) {
    console.error('[EmailService] Error sending email:', error);
    throw error;
  }
}

export async function sendOTPEmail(
  email: string,
  otp: string,
  expiryMinutes: number = 30
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Madadwala - OTP Verification</h2>
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for login is:</p>
      <h1 style="color: #f59e0b; letter-spacing: 2px; font-size: 32px;">${otp}</h1>
      <p style="color: #666;">
        This OTP is valid for <strong>${expiryMinutes} minutes</strong>.
        If you didn't request this code, please ignore this email.
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        © 2024 Madadwala. All rights reserved.
      </p>
    </div>
  `;

  const text = `Your Madadwala OTP is: ${otp}\nValid for ${expiryMinutes} minutes.`;

  await sendEmail({
    to: email,
    subject: 'Your Madadwala Login OTP',
    html,
    text,
  });
}

export async function sendWelcomeEmail(email: string, displayName: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Welcome to Madadwala!</h2>
      <p>Hi ${displayName},</p>
      <p>Welcome to Madadwala! Your account has been created successfully.</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/home" 
           style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Get Started
        </a>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        © 2024 Madadwala. All rights reserved.
      </p>
    </div>
  `;

  const text = `Welcome to Madadwala, ${displayName}! Your account is ready to use.`;

  await sendEmail({
    to: email,
    subject: 'Welcome to Madadwala',
    html,
    text,
  });
}
