/**
 * WhatsApp deep links.
 *
 * Every "message us" affordance on the site funnels through here so the number
 * lives in exactly one place (`contact.whatsapp` in catalog.ts) and every
 * message opens with the same identifiable prefix.
 *
 * `wa.me` picks the right target itself — the native app on mobile, WhatsApp
 * Web on desktop — so there is nothing to feature-detect.
 */
import { contact, type Product } from "./catalog";

const BASE = "https://wa.me";

/** Builds a wa.me link with a pre-filled message. */
export function whatsappLink(message?: string): string {
  const url = `${BASE}/${contact.whatsapp}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}

/** Opening line, so an incoming chat is recognisable at a glance. */
const GREETING = "Hi Space-ious,";

export const generalEnquiry = () =>
  whatsappLink(`${GREETING} I'd like to know more about your hardware range.`);

export const categoryEnquiry = (categoryName: string) =>
  whatsappLink(`${GREETING} I'd like pricing for your ${categoryName} range.`);

/** Product enquiry, including the code so it can be looked up directly. */
export function productEnquiry(product: Product, finish?: string): string {
  const lines = [
    `${GREETING} I'd like a quote for:`,
    "",
    `• Product: ${product.name}`,
    `• Code: ${product.code}`,
    `• Finish: ${finish ?? product.finish}`,
  ];
  // Size is only carried on entries where it has been confirmed.
  if (product.size) lines.push(`• Size: ${product.size}`);
  return whatsappLink(lines.join("\n"));
}

export type EnquiryDetails = {
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  message?: string;
};

/**
 * Turns the contact form into a WhatsApp message.
 *
 * The form has no backend, so instead of pretending to submit it we hand the
 * filled-in enquiry straight to WhatsApp, where the user can send it and keep a
 * copy in their own chat history.
 */
export function enquiryMessage({ name, phone, email, interest, message }: EnquiryDetails): string {
  const lines = [`${GREETING} I'd like to request a quotation.`, ""];
  lines.push(`• Name: ${name}`);
  lines.push(`• Phone: ${phone}`);
  if (email) lines.push(`• Email: ${email}`);
  if (interest) lines.push(`• Interested in: ${interest}`);
  if (message?.trim()) {
    lines.push("", "Requirement:", message.trim());
  }
  return whatsappLink(lines.join("\n"));
}
