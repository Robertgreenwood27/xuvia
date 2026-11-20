// Fictional order using real catalog items. This is the same renderer used for customers.
import { buildOrderEmail } from "../lib/order-email-template.mjs";

export function buildSampleOrderEmail() {
  return buildOrderEmail({
    id: "pi_preview8F3A21C7", receipt_email: "customer@example.com",
    currency: "usd", amount_received: 8191,
    metadata: {
      ship_firstName: "Alex", ship_lastName: "Example",
      ship_address1: "123 Sample Lane", ship_city: "Denver",
      ship_state: "CO", ship_zip: "80201", ship_country: "United States",
      subtotal_cents: "7542", shipping_cents: "649",
    },
  }, [{"title":"Poecilotheria metallica — Long Sleeve","variant":"Size M","quantity":1,"image":"https://d123s6f1z9g2wk.cloudfront.net/files/2026/11/20261117192115-1f1e2bc0-efa5-646a-b174-dad6ef3db321.png"},{"title":"Greenbottle Blue — Phone Case","variant":"iPhone 17 Pro","quantity":1,"image":"https://images-api.printify.com/mockup/6a261e4fdae137a3a60c618a/62582/97458/chromatopelma-cyaneopubescens-phone-case.jpg?camera_label=front-and-side"}], {
    from: "Robert at Xuvia <hello@xuvia.co>", replyTo: "hello@xuvia.co",
  });
}
