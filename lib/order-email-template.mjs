// Email-safe tables and inline styles carry the storefront's visual identity.
// Web fonts are optional: system fallbacks keep Gmail and Outlook readable.
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

function productImage(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return "";
    if (url.hostname === "xuvia.co" || url.hostname === "www.xuvia.co" ||
        url.hostname.endsWith(".printify.com") || url.hostname.endsWith(".cloudfront.net")) return url.href;
  } catch {}
  return "";
}

export function buildOrderEmail(pi, items, { from, replyTo }) {
  const md = pi.metadata;
  const money = (cents) => new Intl.NumberFormat("en-US", {
    style: "currency", currency: pi.currency.toUpperCase(),
  }).format(Number(cents) / 100);
  const reference = `XUVIA-${pi.id.slice(-8)}`;
  const address = [
    `${md.ship_firstName || ""} ${md.ship_lastName || ""}`.trim(),
    md.ship_address1, md.ship_address2,
    [md.ship_city, md.ship_state, md.ship_zip].filter(Boolean).join(", "), md.ship_country,
  ].filter(Boolean);
  const greeting = `Hi ${md.ship_firstName || "there"},`;
  const thankYou = "Thank you for supporting Xuvia. Every design starts with the animals themselves—the posture, the color, the details that make you stop and look. Made for the keepers who see it, too.";
  const next = "Your payment is confirmed, and your order has been received by our print partner. Each piece is made to order, so printing comes next.";
  const shipping = "You’ll receive a shipping email with tracking once your order ships. Stripe sends your payment receipt separately.";
  const contact = "Questions about your order? Just reply to this email. I read and answer every message myself.";
  const description = (item) => `${item.title}${item.variant ? ` · ${item.variant}` : ""}`;
  const totals = [["Subtotal", money(md.subtotal_cents)], ["Shipping", money(md.shipping_cents)], ["Total paid", money(pi.amount_received)]];
  const text = ["XUVIA · FOR THE KEEPERS", "YOUR ORDER IS IN.", greeting, thankYou, next,
    `Your order: ${reference}`, items.map((item) => `${item.quantity} × ${description(item)}`).join("\n"),
    totals.map(([label, value]) => `${label}: ${value}`).join("\n"), `Shipping to:\n${address.join("\n")}`,
    shipping, contact, "Thanks for being part of it.\nRobert\nKeeper & creator, Xuvia",
    "Respect for the animals. Devotion to the details.", "Shipping & returns: https://xuvia.co/shipping-returns",
    "https://xuvia.co",
  ].join("\n\n");
  const bodyFont = "Arial, Helvetica, sans-serif";
  const displayFont = "Georgia, 'Times New Roman', serif";
  const monoFont = "'Courier New', Courier, monospace";
  const label = `font-family:${monoFont};font-size:10px;line-height:18px;letter-spacing:2px;text-transform:uppercase;color:#c8a96e;`;
  const paragraph = (value, margin = "0 0 20px") => `<p style="margin:${margin};font-size:15px;line-height:26px;color:#d4cfc8;">${escapeHtml(value)}</p>`;
  const hasProductImages = items.some((item) => productImage(item.image));
  const productRows = items.map((item) => {
    const image = productImage(item.image);
    return `<tr>${hasProductImages ? `<td class="product-thumb" width="82" valign="top" style="width:82px;padding:18px 14px 18px 0;border-bottom:1px solid #353027;">${image ? `<img src="${escapeHtml(image)}" alt="" width="68" style="display:block;width:68px;max-width:68px;height:auto;border:0;background:#0a0a0b;">` : "&nbsp;"}</td>` : ""}
<td valign="middle" style="padding:18px 0;border-bottom:1px solid #353027;word-break:break-word;">
<p style="margin:0;color:#e8e4dd;font-size:15px;line-height:23px;">${escapeHtml(item.title)}</p>
${item.variant ? `<p style="margin:5px 0 0;color:#a6a3aa;font-size:12px;line-height:20px;">${escapeHtml(item.variant)}</p>` : ""}</td>
<td width="42" align="right" valign="middle" style="width:42px;text-align:right;padding:18px 0 18px 8px;border-bottom:1px solid #353027;font-family:${monoFont};font-size:12px;line-height:20px;color:#c8a96e;white-space:nowrap;">× ${escapeHtml(item.quantity)}</td></tr>`;
  }).join("");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>Your Xuvia order is confirmed</title>
<style>:root{color-scheme:dark;supported-color-schemes:dark;}body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}table{border-collapse:collapse;}img{-ms-interpolation-mode:bicubic;}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;}@media only screen and (max-width:480px){.outer-pad{padding:12px 0!important;}.shell-pad{padding-left:22px!important;padding-right:22px!important;}.brand-name{font-size:40px!important;letter-spacing:9px!important;}.hero-title{font-size:28px!important;letter-spacing:2px!important;}.summary-pad{padding-left:18px!important;padding-right:18px!important;}.product-thumb{width:74px!important;padding-right:10px!important;}.order-ref{font-size:11px!important;letter-spacing:1px!important;}}</style></head>
<body bgcolor="#0a0a0b" style="margin:0;padding:0;width:100%;background-color:#0a0a0b;font-family:${bodyFont};color:#d4cfc8;">
<div style="display:none;font-size:1px;line-height:1px;color:#0a0a0b;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">Your payment is confirmed. Printing comes next; tracking follows when it ships.</div>
<table role="presentation" width="100%" bgcolor="#0a0a0b" style="width:100%;background-color:#0a0a0b;"><tr><td class="outer-pad" align="center" style="padding:28px 12px;">
<!--[if mso]><table role="presentation" width="620" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" bgcolor="#111114" style="width:100%;max-width:620px;margin:0 auto;text-align:left;background-color:#111114;border:1px solid #353027;">
<tr><td height="2" bgcolor="#c8a96e" style="height:2px;font-size:1px;line-height:2px;background-color:#c8a96e;">&nbsp;</td></tr>
<tr><td class="shell-pad" align="center" bgcolor="#000000" style="padding:20px 36px 30px;text-align:center;background-color:#000000;">
<a href="https://xuvia.co" style="text-decoration:none;"><img src="https://xuvia.co/logo.png" alt="" width="144" height="96" style="display:block;width:144px;height:96px;margin:0 auto 4px;border:0;"></a>
<p class="brand-name" style="margin:0 0 16px;font-family:${displayFont};font-size:48px;line-height:54px;letter-spacing:12px;color:#e8e4dd;"><a href="https://xuvia.co" style="text-decoration:none;color:#e8e4dd;">XUVIA</a></p>
<p style="margin:0;font-family:${monoFont};font-size:10px;line-height:18px;letter-spacing:4px;color:#c8a96e;">FOR THE KEEPERS</p>
</td></tr>
<tr><td class="shell-pad" style="padding:34px 36px 28px;">
<p style="${label}margin:0 0 12px;">ORDER CONFIRMED</p>
<h1 class="hero-title" style="margin:0 0 26px;font-family:${displayFont};font-weight:normal;font-size:34px;line-height:43px;letter-spacing:3px;text-transform:uppercase;color:#e8e4dd;">Your order is in.</h1>
${paragraph(greeting, "0 0 12px")}${paragraph(thankYou)}${paragraph(next, "0")}
</td></tr>
<tr><td class="shell-pad" style="padding:0 36px 28px;">
<table role="presentation" width="100%" bgcolor="#19191d" style="width:100%;background-color:#19191d;border:1px solid #353027;">
<tr><td class="summary-pad" style="padding:22px 24px 0;">
<table role="presentation" width="100%" style="width:100%;"><tr><td style="${label}padding-bottom:14px;">YOUR ORDER</td><td class="order-ref" align="right" style="text-align:right;font-family:${monoFont};font-size:12px;line-height:18px;letter-spacing:1px;color:#e8e4dd;padding-bottom:14px;">${escapeHtml(reference)}</td></tr></table>
<table role="presentation" width="100%" style="width:100%;font-family:${bodyFont};">${productRows}</table>
</td></tr>
<tr><td class="summary-pad" style="padding:14px 24px 22px;">
<table width="100%" style="width:100%;font-family:${bodyFont};font-size:13px;line-height:22px;color:#a6a3aa;">${totals.map(([name, value], index) => `<tr><th scope="row" align="left" style="text-align:left;padding:${index === 2 ? "13px" : "5px"} 0 ${index === 2 ? "0" : "5px"};font-weight:normal;${index === 2 ? `border-top:1px solid #353027;color:#e8e4dd;font-size:15px;` : ""}">${escapeHtml(name)}</th><td align="right" style="text-align:right;padding:${index === 2 ? "13px" : "5px"} 0 ${index === 2 ? "0" : "5px"};white-space:nowrap;${index === 2 ? `border-top:1px solid #353027;color:#c8a96e;font-size:20px;` : ""}">${escapeHtml(value)}</td></tr>`).join("")}</table>
</td></tr></table></td></tr>
<tr><td class="shell-pad" style="padding:0 36px 28px;">
<p style="${label}margin:0 0 10px;">SHIPPING TO</p>
<p style="margin:0 0 26px;font-size:14px;line-height:24px;color:#e8e4dd;">${address.map(escapeHtml).join("<br>")}</p>
<table role="presentation" width="100%" style="width:100%;border-top:1px solid #353027;border-bottom:1px solid #353027;"><tr><td style="padding:18px 0;">
<p style="${label}margin:0 0 7px;">WHAT HAPPENS NEXT</p>
<p style="margin:0;font-size:14px;line-height:24px;color:#d4cfc8;">${escapeHtml(shipping)}</p>
</td></tr></table>
</td></tr>
<tr><td class="shell-pad" style="padding:0 36px 34px;">
${paragraph(contact)}<p style="margin:0 0 5px;font-size:14px;line-height:24px;color:#d4cfc8;">Thanks for being part of it.</p>
<p style="margin:0;font-family:${displayFont};font-size:23px;line-height:30px;color:#c8a96e;">Robert</p>
<p style="margin:4px 0 26px;font-size:11px;line-height:18px;letter-spacing:1px;color:#a6a3aa;">KEEPER &amp; CREATOR, XUVIA</p>
<table role="presentation" style="border-collapse:separate;"><tr><td align="center" bgcolor="#c8a96e" style="background-color:#c8a96e;mso-padding-alt:13px 20px;"><a href="https://xuvia.co/shipping-returns" style="display:inline-block;padding:13px 20px;font-family:${displayFont};font-size:11px;font-weight:bold;line-height:18px;letter-spacing:2px;text-decoration:none;color:#0a0a0b;">SHIPPING &amp; RETURNS</a></td></tr></table>
</td></tr>
<tr><td class="shell-pad" align="center" bgcolor="#0a0a0b" style="padding:25px 36px 26px;text-align:center;background-color:#0a0a0b;border-top:1px solid #353027;">
<p style="margin:0 0 14px;font-family:${displayFont};font-size:12px;line-height:23px;letter-spacing:1px;color:#c8a96e;">Respect for the animals.<br>Devotion to the details.</p>
<p style="margin:0;font-size:11px;line-height:22px;color:#a6a3aa;"><a href="https://xuvia.co" style="color:#d4cfc8;text-decoration:none;">XUVIA.CO</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="mailto:${escapeHtml(replyTo)}" style="color:#d4cfc8;text-decoration:none;">${escapeHtml(replyTo)}</a></p>
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
  return { from, to: [pi.receipt_email], reply_to: replyTo, subject: `Your order is in — ${reference}`, html, text };
}
