import { createOrder } from "@/lib/printify";

export async function POST(req) {
  try {
    const body = await req.json();
    const { address, items, email } = body;

    if (!address || !items?.length || !email) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lineItems = items.map((i) => ({
      product_id: i.productId,
      variant_id: i.variantId,
      quantity: i.quantity,
    }));

    const order = await createOrder({
      label: `XUVIA-${Date.now()}`,
      line_items: lineItems,
      shipping_method: 1,
      send_shipping_notification: true,
      address_to: {
        first_name: address.firstName,
        last_name: address.lastName,
        email,
        phone: address.phone || "",
        country: address.country,
        region: address.state,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        zip: address.zip,
      },
    });

    return Response.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
