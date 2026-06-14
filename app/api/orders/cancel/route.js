import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Syncing execution cancellations..." });
    const allCookies = cookieStore.getAll();

    const supabaseSession = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() { return allCookies; },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          }
        }
      }
    );

    const { data: { user }, error: authError } = await supabaseSession.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized: Active profile session required." }, { status: 401 });
    }

    const { orderId } = await request.json();

    const { data: order, error: queryError } = await supabaseAdmin
      .from('orders')
      .select('created_at, status, user_id, total_amount, customer_name, customer_email')
      .eq('id', orderId)
      .single();

    if (queryError || !order) {
      return NextResponse.json({ success: false, error: "Order details not found inside database arrays." }, { status: 404 });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ success: false, error: "Security Exception: User ID validation parameter mismatch." }, { status: 403 });
    }

    if (order.status !== 'Pending') {
      return NextResponse.json({ success: false, error: `Cannot drop tracking: order status is currently locked at "${order.status}".` }, { status: 400 });
    }

    const { data: profileData } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .maybeSingle();

    const finalTargetCustomerEmail = (
      order.customer_email || 
      profileData?.email || 
      user.email || 
      ""
    ).toLowerCase().trim();

    const customerDisplayName = order.customer_name || profileData?.full_name || "Customer";

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'Cancelled' })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // Dispatch Professional Cancellation Notifications
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
          user: "shahzaibkhattak0319@gmail.com", 
          pass: process.env.EMAIL_SERVER_PASSWORD 
        }
      });

      const buildCancellationEmailHtml = (isForAdmin) => `
        <div style="background-color: #f9f9f9; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            
            <div style="background-color: #111111; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 16px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin: 0;">BURAQWEARS</h1>
              <p style="color: #ef4444; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 4px 0 0 0;">Order Cancellation Update</p>
            </div>

            <div style="padding: 32px 24px;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #b91c1c; background-color: #fef2f2; padding: 4px 8px; border-radius: 2px;">Status: Cancelled</span>
              </div>

              <h2 style="font-size: 20px; font-weight: 600; color: #111111; margin: 0 0 8px 0; letter-spacing: -0.01em;">Order Details — #${orderId}</h2>
              <p style="font-size: 13px; color: #666666; margin: 0 0 24px 0; line-height: 1.5;">
                ${isForAdmin 
                  ? `The customer has manually cancelled order <strong>#${orderId}</strong> from their account profile portal.` 
                  : `Hello ${customerDisplayName}, as requested, your order <strong>#${orderId}</strong> has been successfully cancelled. You will not receive any package shipments or be requested for charges relative to this transaction.`}
              </p>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #fcfcfc; border: 1px solid #eeeeee; border-radius: 2px;">
                <tr>
                  <td style="padding: 14px;">
                    <span style="font-size: 10px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Account Target Profile</span>
                    <span style="font-size: 13px; font-weight: 600; color: #111111;">${customerDisplayName}</span>
                    <span style="font-size: 12px; color: #666666; display: block; margin-top: 1px;">${finalTargetCustomerEmail}</span>
                  </td>
                  <td style="padding: 14px; text-align: right; vertical-align: bottom;">
                    <span style="font-size: 10px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Voided Value</span>
                    <span style="font-size: 16px; font-weight: 700; color: #111111; font-family: monospace;">€${Number(order.total_amount).toFixed(2)}</span>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #999999; margin: 0; font-style: italic; line-height: 1.4;">
                ${isForAdmin 
                  ? 'Your store database item stocks have cleared this record timeline tracking automatically.' 
                  : 'If you cancelled this transaction by accident, feel free to visit our storefront bag anytime to re-initialize your checkout process.'}
              </p>
            </div>

            <div style="background-color: #fafafa; border-top: 1px solid #eeeeee; padding: 16px; text-align: center;">
              <p style="font-size: 11px; color: #888888; margin: 0;">
                Thank you for choosing Buraqwears. This is an automated log processing dispatch.
              </p>
            </div>

          </div>
        </div>
      `;

      // ✉️ EMAIL 1: Store Admin Copy
      await transporter.sendMail({
        from: 'shahzaibkhattak0319@gmail.com', // ◄ Safe identity matching
        to: 'shahzaibkhattak0319@gmail.com',
        replyTo: 'shahzaibkhattak0319@gmail.com',
        subject: `🚨 ORDER CANCELLED: #${orderId}`,
        html: buildCancellationEmailHtml(true)
      });

      // ✉️ EMAIL 2: Customer Copy
      if (finalTargetCustomerEmail) {
        await transporter.sendMail({
          from: 'shahzaibkhattak0319@gmail.com', // ◄ Safe identity matching
          to: finalTargetCustomerEmail,
          replyTo: 'shahzaibkhattak0319@gmail.com', // ◄ Establishes communication trust
          subject: `Order Cancellation Confirmed — #${orderId}`,
          text: `Hello ${customerDisplayName}, your order #${orderId} has been successfully cancelled.`, // ◄ Plain text fallback for spam filters
          html: buildCancellationEmailHtml(false)
        });
      }

    } catch (mailErr) {
      console.error("Warning: Cancellation mail service notification failed safely:", mailErr.message);
    }

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: response.headers
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}