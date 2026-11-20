// Generates a local preview using fictional customer data; never sends email.
import { writeFile } from "node:fs/promises";
import { buildSampleOrderEmail } from "./order-email-sample.mjs";

const preview = buildSampleOrderEmail();
const destination = process.argv[2] || "/tmp/xuvia-order-email-preview.html";
await writeFile(destination, preview.html);
console.log(`Email preview saved to ${destination}`);
