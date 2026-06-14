import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// FIXED: Using SERVICE_ROLE_KEY to bypass RLS walls safely on the server backend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, orderNumber, subject, message } = body;

    // 1. Save to Supabase Log Matrix
    const { error: dbError } = await supabase
      .from('contact_inquiries')
      .insert([
        {
          recipient_email: 'shahzaibkhattak0319@gmail.com',
          client_name: name,
          client_email: email,
          order_number: orderNumber || null,
          subject_context: subject,
          message_body: message
        }
      ]);

    if (dbError) throw dbError;

    // 2. Configure NodeMailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shahzaibkhattak0319@gmail.com',
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    });

    // Format strings neatly for display
    const cleanName = name.trim();
    const cleanSubject = subject.trim();

    // 3. High-End Luxury HTML Email Template Design
    const mailOptions = {
      from: `"BuraqWears Concierge" <shahzaibkhattak0319@gmail.com>`,
      to: 'shahzaibkhattak0319@gmail.com',
      replyTo: email,
      // FIXED: Perfectly clean subject line with NO square brackets
      subject: `BuraqWears Support: ${cleanName} — ${cleanSubject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              background-color: #f7f7f7; 
              margin: 0; 
              padding: 40px 10px; 
              color: #111111; 
              -webkit-font-smoothing: antialiased; 
            }
            .wrapper { 
              max-width: 580px; 
              margin: 0 auto; 
              background: #ffffff; 
              border: 1px solid #e8e8e8; 
              border-radius: 0px; 
              overflow: hidden; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.015); 
            }
            .header { 
              padding: 40px 35px; 
              border-bottom: 1px solid #f5f5f5; 
              background-color: #ffffff;
              text-align: left;
            }
            .brand-logo { 
              font-size: 22px; 
              font-weight: 800; 
              letter-spacing: 0.08em; 
              text-transform: uppercase; 
              color: #000000; 
              margin: 0; 
            }
            .brand-sub { 
              font-weight: 300; 
              color: #777777; 
            }
            .meta-subtitle { 
              font-size: 9px; 
              font-weight: 600; 
              letter-spacing: 0.2em; 
              text-transform: uppercase; 
              color: #999999; 
              margin-top: 6px; 
            }
            .content { 
              padding: 0 35px 40px 35px; 
            }
            .section-header {
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: #a1a1a1;
              margin-bottom: 14px;
              margin-top: 30px;
            }
            .grid-box {
              width: 100%;
              background-color: #fafafa;
              border: 1px solid #eaeaea;
              padding: 20px;
              box-sizing: border-box;
            }
            .grid-table { 
              width: 100%; 
              border-collapse: collapse; 
            }
            .grid-row td { 
              padding: 8px 0; 
              font-size: 13px; 
              vertical-align: top; 
            }
            .label { 
              width: 35%; 
              color: #777777; 
              font-weight: 500;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .value { 
              width: 65%; 
              color: #000000; 
              font-weight: 600; 
            }
            .message-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #777777;
              margin-bottom: 8px;
              margin-top: 24px;
            }
            .message-box { 
              background-color: #ffffff; 
              border: 1px solid #eaeaea; 
              padding: 24px; 
              font-size: 13px; 
              line-height: 1.6; 
              color: #222222; 
              white-space: pre-wrap; 
              font-style: normal;
              box-shadow: inset 0 1px 2px rgba(0,0,0,0.01);
            }
            .footer { 
              background-color: #000000; 
              padding: 30px 35px; 
              text-align: center; 
            }
            .footer-text { 
              font-size: 10px; 
              color: #ffffff; 
              letter-spacing: 0.08em; 
              line-height: 1.6;
              margin: 0;
              font-weight: 300;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            
            <div class="header">
              <div class="brand-logo">Buraq<span class="brand-sub">Wears</span></div>
              <div class="meta-subtitle">Secure Inquiry Desk Routing</div>
            </div>
            
            <div class="content">
              <div class="section-header">Client Ticket Specifications</div>
              
              <div class="grid-box">
                <table class="grid-table">
                  <tr class="grid-row">
                    <td class="label">Client Identity</td>
                    <td class="value" style="color: #000000;">${cleanName}</td>
                  </tr>
                  <tr class="grid-row">
                    <td class="label">Email Terminal</td>
                    <td class="value"><a href="mailto:${email}" style="color: #000000; text-decoration: none; border-bottom: 1px dashed #000;">${email}</a></td>
                  </tr>
                  <tr class="grid-row">
                    <td class="label">Order Link</td>
                    <td class="value" style="font-family: monospace; font-size: 14px;">${orderNumber ? `#${orderNumber.replace('#', '')}` : '<span style="color:#b5b5b5; font-weight:400; font-family:sans-serif; font-size:12px;">None Linked</span>'}</td>
                  </tr>
                  <tr class="grid-row">
                    <td class="label">Inquiry Lane</td>
                    <td class="value" style="color: #000000; font-weight: 700;">${cleanSubject}</td>
                  </tr>
                </table>
              </div>
              
              <div class="message-label">Transmission Payload</div>
              <div class="message-box">${message}</div>
            </div>
            
            <div class="footer">
              <p class="footer-text">
                © ${new Date().getFullYear()} <span style="font-weight: 600; letter-spacing: 0.1em;">BURAQWEARS CO.</span> OPERATIONS TERMINAL.<br/>
                DIRECT CLIENT INQUIRY PROCESSED SECURELY VIA SUPABASE MATRIX RELAYS.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Core Email Pipeline Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}