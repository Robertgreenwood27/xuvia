import { calculateShipping } from "@/lib/printify";

export async function POST(req) {
  try {
    const { address, items } = await req.json();

    if (!address || !items?.length) {
      return Response.json({ error: "Missing address or items" }, { status: 400 });
    }

    const lineItems = items.map((i) => ({
      product_id: i.productId,
      variant_id: i.variantId,
      quantity: i.quantity,
    }));

    const result = await calculateShipping(
      {
        first_name: address.firstName,
        last_name: address.lastName,
        email: address.email || "",
        phone: address.phone || "",
        country: address.country,
        region: address.state,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        zip: address.zip,
      },
      lineItems
    );

    const costCents = result.standard ?? result.economy ?? 0;
    return Response.json({ shipping: costCents / 100 });
  } catch (err) {
    console.error("Shipping calculation error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
