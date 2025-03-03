import nodemailer from 'nodemailer';
// import { IBooking } from '@/models/Booking';
import Property from '@/models/Property';

// Function to format date to a readable string
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Email notification
async function sendEmailNotification(booking: any, property: any) {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email recipients
    const recipients = [
      'anitaazuike@gmail.com',
      'Pheesayor.miro@gmail.com',
      'arinzevsvp@gmail.com'
    ];

    // Email content with booking details and WhatsApp instructions
    const emailContent = `
      <h2>New Booking Confirmed!</h2>
      <p><strong>Property:</strong> ${property.title}</p>
      <p><strong>Reference:</strong> ${booking.reference}</p>
      <p><strong>Guest:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
      <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
      <p><strong>Guests:</strong> ${booking.guests}</p>
      <p><strong>Status:</strong> ${booking.paymentStatus}</p>
      <p><strong>Booking Date:</strong> ${new Date().toLocaleString()}</p>
      
      <hr>
      <p><strong>To contact guest via WhatsApp:</strong><br>
      <a href="https://wa.me/${booking.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(booking.name)},%20thank%20you%20for%20booking%20${encodeURIComponent(property.title)}!%20We%20are%20confirming%20your%20reservation%20from%20${encodeURIComponent(formatDate(booking.checkIn))}%20to%20${encodeURIComponent(formatDate(booking.checkOut))}.">Click here to send WhatsApp message</a></p>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Gifted Homes Booking" <${process.env.EMAIL_USER}>`,
      to: recipients.join(', '),
      subject: `New Booking: ${property.title} - Ref: ${booking.reference}`,
      html: emailContent,
    });

    console.log('Email notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}

// Main function to send notifications
export async function sendBookingNotifications(booking: any) {
  try {
    // Get the property information
    const property = await Property.findById(booking.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Send email notification
    const emailResult = await sendEmailNotification(booking, property);
    
    return {
      email: emailResult,
      // No WhatsApp notification, but keep the structure for future expansion
      whatsapp: false
    };
  } catch (error) {
    console.error('Error sending booking notifications:', error);
    throw error;
  }
}