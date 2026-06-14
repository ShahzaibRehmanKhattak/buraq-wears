import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

// Admin service client used to completely bypass RLS error 42501 safely on the server
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Processing checkout workflow..." });
    const allCookies = cookieStore.getAll();

    // Mirroring your exact cart cookie matching setup
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

    // Securely pull user info from matched cookies
    const { data: { user }, error: authError } = await supabaseSession.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized: Active session required." }, { status: 401 });
    }

    // ⚡ NEW: Safely query the database to extract the actual email attached to this user id
    // Adjust the table name ('profiles') if your user profile records live under a different name
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    // Fallback directly to the auth session email if the custom table profile query returns empty
    const verifiedCustomerEmail = profileData?.email || user.email || "";

    const { 
      customerName, 
      email: payloadEmail, // From checkout form inputs
      shippingAddress, 
      city, 
      postalCode, 
      phone, 
      cartItems, 
      subtotal 
    } = await request.json();

    // Use the fetched verified database email or fall back to what they wrote in the payload input field
    const finalTargetCustomerEmail = (verifiedCustomerEmail || payloadEmail || "").toLowerCase().trim();

    // Structural Payload Validation
    if (!customerName || !finalTargetCustomerEmail || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required order payload fields." }, { status: 400 });
    }

    // Generate custom unique random order tracking ID string
    const customOrderId = Math.random().toString(36).substring(2, 10).toUpperCase();

    // 1. Insert master order row using admin client to eliminate RLS restrictions
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        id: customOrderId,
        user_id: user.id,
        customer_name: customerName,
        customer_email: finalTargetCustomerEmail,
        shipping_address: shippingAddress,
        city: city,
        postal_code: postalCode,
        phone: phone,
        total_amount: subtotal,
        status: 'Pending',
        payment_method: 'COD'
      }]);

    if (orderError) throw orderError;

    // 2. Format and insert relational items array records
    const itemRows = cartItems.map(item => ({
      order_id: customOrderId,
      product_id: item.product_id,
      product_title: item.product_title || item.products?.title || "Product Item", 
      quantity: item.quantity,
      size: item.selected_size || item.size || "M",
      price: item.products?.price || item.price,
      image_url: item.products?.images?.[0] || item.image_url || ""
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemRows);

    if (itemsError) throw itemsError;

    // 3. ⚡ CART PURGE SYSTEM: Destroys active user data lines inside cart_items table
    const { error: purgeError } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (purgeError) {
      console.error("Warning: DB Cart cleanup routine exception handled:", purgeError.message);
    }

    // 4. Dispatch System Email Notification Routing
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
          user: "shahzaibkhattak0319@gmail.com", 
          pass: process.env.EMAIL_SERVER_PASSWORD 
        }
      });

      // Render rows dynamically for the item list template view
      const emailItemRowsHtml = itemRows.map(item => `
        <tr style="border-bottom: 1px solid #eeeeee;">
          <td style="padding: 12px 0; font-size: 13px; color: #111111; font-weight: 600;">
            ${item.product_title}
            <div style="font-size: 11px; color: #777777; font-weight: 400; margin-top: 2px;">Size: ${item.size}</div>
          </td>
          <td style="padding: 12px 0; text-align: center; font-size: 13px; color: #555555;">${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right; font-size: 13px; font-weight: 600; color: #111111; font-family: monospace;">€${Number(item.price).toFixed(2)}</td>
        </tr>
      `).join('');

      // Build the standard professional template
      const buildEmailHtml = (isForAdmin) => `
        <div style="background-color: #f9f9f9; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            
            <div style="background-color: #111111; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 16px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin: 0;">BURAQWEARS</h1>
              <p style="color: #a3a3a3; font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin: 4px 0 0 0;">
                ${isForAdmin ? 'Incoming New Sale Matrix' : 'Order Confirmation Receipt'}
              </p>
            </div>

            <div style="padding: 32px 24px;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; background-color: #fef3c7; padding: 4px 8px; border-radius: 2px;">Cash On Delivery</span>
              </div>

              <h2 style="font-size: 20px; font-weight: 600; color: #111111; margin: 0 0 8px 0; letter-spacing: -0.01em;">Order #${customOrderId}</h2>
              <p style="font-size: 13px; color: #666666; margin: 0 0 24px 0; line-height: 1.5;">
                ${isForAdmin 
                  ? 'A new purchase transaction request has just passed checkout verification checks and needs logistical processing.' 
                  : 'Thank you for your order! We are preparing your shipment items. You will pay cash right at your doorstep upon delivery.'}
              </p>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px; background-color: #fcfcfc; border: 1px solid #eeeeee; border-radius: 2px;">
                <tr>
                  <td style="padding: 16px; width: 50%; vertical-align: top; border-right: 1px solid #eeeeee;">
                    <div style="font-size: 10px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Customer Details</div>
                    <div style="font-size: 13px; font-weight: 600; color: #111111;">${customerName}</div>
                    <div style="font-size: 12px; color: #555555; margin-top: 2px;">${finalTargetCustomerEmail}</div>
                    <div style="font-size: 12px; color: #555555; margin-top: 2px;">${phone || 'No phone provided'}</div>
                  </td>
                  <td style="padding: 16px; width: 50%; vertical-align: top;">
                    <div style="font-size: 10px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Shipping Destination</div>
                    <div style="font-size: 12px; color: #111111; line-height: 1.4; font-weight: 500;">
                      ${shippingAddress}<br />
                      ${postalCode}, ${city}
                    </div>
                  </td>
                </tr>
              </table>

              <h3 style="font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0; border-bottom: 1px solid #111111; padding-bottom: 6px;">Items Manifest</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="border-bottom: 1px solid #e5e5e5;">
                    <th style="text-align: left; font-size: 10px; font-weight: 700; color: #777777; padding-bottom: 8px; text-transform: uppercase;">Product Name</th>
                    <th style="text-align: center; font-size: 10px; font-weight: 700; color: #777777; padding-bottom: 8px; text-transform: uppercase; width: 60px;">Qty</th>
                    <th style="text-align: right; font-size: 10px; font-weight: 700; color: #777777; padding-bottom: 8px; text-transform: uppercase; width: 90px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${emailItemRowsHtml}
                </tbody>
              </table>

              <div style="border-top: 2px solid #111111; padding-top: 16px; text-align: right;">
                <span style="font-size: 11px; font-weight: 700; color: #777777; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 16px; vertical-align: middle;">Total Net Value</span>
                <span style="font-size: 20px; font-weight: 700; color: #111111; font-family: monospace; vertical-align: middle;">€${Number(subtotal).toFixed(2)}</span>
              </div>
            </div>

            <div style="background-color: #fafafa; border-top: 1px solid #eeeeee; padding: 16px; text-align: center;">
              <p style="font-size: 11px; color: #888888; margin: 0;">
                ${isForAdmin 
                  ? 'Please review your store backoffice dashboard panels to complete shipping dispatch logs.' 
                  : 'If you have any questions regarding your package logistics, simply reply to this email.'}
              </p>
            </div>
          </div>
        </div>
      `;

      // ✉️ EMAIL 1: Sent to Buraqwears Store (Admin Notification)
      await transporter.sendMail({
        from: '"BURAQWEARS ADMIN" <shahzaibkhattak0319@gmail.com>',
        to: 'shahzaibkhattak0319@gmail.com',
        subject: `🛒 NEW COD ORDER: #${customOrderId}`,
        html: buildEmailHtml(true)
      });

      // ✉️ EMAIL 2: Sent to the Customer's extracted email address
      if (finalTargetCustomerEmail) {
        await transporter.sendMail({
          from: '"BURAQWEARS" <shahzaibkhattak0319@gmail.com>',
          to: finalTargetCustomerEmail,
          subject: `Your Buraqwears Order Confirmation — #${customOrderId}`,
          html: buildEmailHtml(false)
        });
      }

    } catch (mailErr) {
      console.error("Mail server transmission halted safely:", mailErr.message);
    }

    return new NextResponse(JSON.stringify({ success: true, orderId: customOrderId }), {
      status: 200,
      headers: response.headers
    });

  } catch (error) {
    console.error("Core Checkout Pipeline Exception Catching:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}