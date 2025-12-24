import { NextRequest, NextResponse } from 'next/server';
import { mailer } from '@/lib/mailer';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      service,
      name,
      email,
      phone,
      company,
      date,
      time,
      duration,
      message
    } = body;

    // Validate required fields
    if (!service || !name || !email || !phone || !date || !time || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Service mapping for display
    const serviceNames = {
      'studio-booking': 'Studio Booking',
      'equipment-rental': 'Equipment Rental',
      'consultation': 'Consultation',
      'training': 'Training Session'
    };

    // Create email content
    const subject = `New Booking Request: ${serviceNames[service as keyof typeof serviceNames]}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Booking Request
        </h2>

        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #007bff; margin-top: 0;">Service Details</h3>
          <p><strong>Service:</strong> ${serviceNames[service as keyof typeof serviceNames]}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Duration:</strong> ${duration} hour(s)</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #007bff; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        </div>

        ${message ? `
          <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #007bff; margin-top: 0;">Additional Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        ` : ''}

        <div style="background: #e9ecef; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; color: #6c757d;">
            <strong>Next Steps:</strong> Please contact the client within 24 hours to confirm availability and provide payment instructions.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="color: #6c757d; font-size: 12px;">
          This booking request was submitted via the T-Media Web platform.
        </p>
      </div>
    `;

    const textContent = `
New Booking Request

Service Details:
Service: ${serviceNames[service as keyof typeof serviceNames]}
Date: ${date}
Time: ${time}
Duration: ${duration} hour(s)

Contact Information:
Name: ${name}
Email: ${email}
Phone: ${phone}
${company ? `Company: ${company}` : ''}

${message ? `Additional Message:\n${message}` : ''}

Next Steps: Please contact the client within 24 hours to confirm availability and provide payment instructions.

This booking request was submitted via the T-Media Web platform.
    `;

    // Send email to admin/support
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@t-media.com';

    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject,
      html: htmlContent,
      text: textContent,
    });

    // Send confirmation email to client
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Booking Request Received</h2>

        <p>Dear ${name},</p>

        <p>Thank you for your booking request with T-Media. We have received your request for:</p>

        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Service:</strong> ${serviceNames[service as keyof typeof serviceNames]}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Duration:</strong> ${duration} hour(s)</p>
        </div>

        <p>Our team will review your request and contact you within 24 hours to confirm availability and provide next steps.</p>

        <p>If you have any questions, please don't hesitate to contact us.</p>

        <p>Best regards,<br>The T-Media Team</p>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="color: #6c757d; font-size: 12px;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      </div>
    `;

    const confirmationText = `
Booking Request Received

Dear ${name},

Thank you for your booking request with T-Media. We have received your request for:

Service: ${serviceNames[service as keyof typeof serviceNames]}
Date: ${date}
Time: ${time}
Duration: ${duration} hour(s)

Our team will review your request and contact you within 24 hours to confirm availability and provide next steps.

If you have any questions, please don't hesitate to contact us.

Best regards,
The T-Media Team

This is an automated confirmation. Please do not reply to this email.
    `;

    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Booking Request Confirmation - T-Media',
      html: confirmationHtml,
      text: confirmationText,
    });

    logger.info('Booking request processed successfully', { service, email, date });

    return NextResponse.json(
      { message: 'Booking request submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    logger.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}