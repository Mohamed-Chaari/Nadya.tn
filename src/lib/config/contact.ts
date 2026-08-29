export const FACEBOOK_PAGE_URL = "https://facebook.com/nadyacraft.tn";
export const MESSENGER_URL = "https://m.me/nadyacraft.tn";

// TODO: replace with the real WhatsApp Business number (digits only, with
// country code, e.g. "21612345678") once available — see PRD open items.
const WHATSAPP_PHONE_NUMBER = "21600000000";

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}
