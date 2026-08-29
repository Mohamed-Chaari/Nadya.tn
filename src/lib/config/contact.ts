export const FACEBOOK_PAGE_URL = "https://facebook.com/nadyacraft.tn";
export const MESSENGER_URL = "https://m.me/nadyacraft.tn";

const WHATSAPP_PHONE_NUMBER = "21622682363";

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}
