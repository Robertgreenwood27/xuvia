// Generates a local preview using fictional customer data; never sends email.
import { writeFile } from "node:fs/promises";
import { buildOrderEmail } from "../lib/order-email.mjs";

const preview = buildOrderEmail({
  id: "pi_preview12345678", receipt_email: "alex@example.com", currency: "usd", amount_received: 6500,
  metadata: { ship_firstName: "Alex", ship_lastName: "Example", ship_address1: "123 Example Street",
    ship_city: "Denver", ship_state: "CO", ship_zip: "80201", ship_country: "US",
    subtotal_cents: "5800", shipping_cents: "700" },
}, [{ title: "Gooty Sapphire Ornamental shirt", variant: "Black / M", quantity: 2 }], {
  from: "Robert at Xuvia <hello@xuvia.co>", replyTo: "hello@xuvia.co",
});
const destination = process.argv[2] || "/tmp/xuvia-order-email-preview.html";
await writeFile(destination, preview.html);
console.log(`Email preview saved to ${destination}`);
