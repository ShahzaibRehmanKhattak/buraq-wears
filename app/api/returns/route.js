import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { orderRef, email, reason, description } = await request.json();

    // 1. Structural Payload Validation
    if (!orderRef || !email || !reason || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required configuration variables." },
        { status: 400 }
      );
    }

    // Clean data inputs to prevent syntax mismatches
    const cleanOrderRef = orderRef.toUpperCase().trim().replace('#', '');
    const cleanEmail = email.toLowerCase().trim();

    // ============================================================
    // SECURE DATABASE VALIDATION STEP
    // ============================================================
    // We check the 'orders' table to find the record where the ID matches
    const { data: existingOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, customer_email')
      .eq('id', cleanOrderRef) // If your column is named differently (e.g. order_id), change 'id' to match
      .single();

    // If order record isn't found, or the email doesn't align with the order placement record
    if (orderError || !existingOrder || existingOrder.customer_email.toLowerCase().trim() !== cleanEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Verification Failed. The provided Order ID and Email Destination Terminal do not align in our registry." 
        },
        { status: 404 }
      );
    }
    // ============================================================

    // 2. Safe Database Insertion into 'returns' table
    const { error: dbError } = await supabaseAdmin
      .from('returns')
      .insert([
        { 
          order_ref: `#${cleanOrderRef}`, 
          email: cleanEmail, 
          reason, 
          description 
        }
      ]);

    if (dbError) throw dbError;

    // 3. Configure Nodemailer Transporter Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:"shahzaibkhattak0319@gmail.com",
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // 4. Formulate Email Notification Layout
    const mailOptions = {
      from: "shahzaibkhattak0319@gmail.com",
      to:  cleanEmail, // Send confirmation to the customer
      subject: `🚨 NEW RETURN REQUEST: #${cleanOrderRef}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111111; max-width: 600px; border: 1px solid #eaeaea;">
          <h2 style="text-transform: uppercase; letter-spacing: 0.1em; font-size: 16px; border-b: 1px solid #111; padding-bottom: 10px; margin-bottom: 20px;">
            Reverse Logistics Alert Matrix (Verified Order)
          </h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 140px; text-transform: uppercase; color: #666;">Order Reference:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #000;">#${cleanOrderRef}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; text-transform: uppercase; color: #666;">Client Email:</td>
              <td style="padding: 6px 0; color: #000;">${cleanEmail}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; text-transform: uppercase; color: #666;">Action Protocol:</td>
              <td style="padding: 6px 0; color: #000;">${reason}</td>
            </tr>
          </table>
          
          <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #777; margin-bottom: 8px;">Condition Analytics:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 3px solid #111; font-size: 13px; line-height: 1.6; color: #333; margin-bottom: 20px;">
            ${description.replace(/\n/g, '<br />')}
          </div>
          
          <hr style="border: none; border-top: 1px solid #eaeaea;" />
          <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 15px;">
            BuraqWears Automated Hub Routing System
          </p>
        </div>
      `,
    };

    // 5. Deliver Transport Email Payload
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Return Matrix Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Matrix Error" },
      { status: 500 }
    );
  }
}