import type { OrderStatus } from "@/lib/types";

// Real WhatsApp Business API automation needs Meta verification + approved
// templates (or a paid provider) — not actually free. This stays manual:
// admin taps the button, WhatsApp opens pre-filled, admin hits send. Zero
// cost, zero new accounts.
const MESSAGE_BUILDERS: Partial<Record<OrderStatus, (name: string, orderNumber: number) => string>> = {
  confirmed: (name, n) =>
    `Bonjour ${name}, votre commande #${n} chez NADYA — Art & Handcraft a été confirmée ! Merci pour votre confiance 💛`,
  shipped: (name, n) => `Bonjour ${name}, votre commande #${n} a été expédiée et arrive bientôt !`,
  delivered: (name, n) =>
    `Bonjour ${name}, nous espérons que vous adorez votre commande #${n} ! N'hésitez pas à nous laisser un avis 💛`,
  cancelled: (name, n) =>
    `Bonjour ${name}, votre commande #${n} a été annulée. N'hésitez pas à nous contacter si vous avez des questions.`,
};

export function WhatsAppNotifyButton({
  phone,
  name,
  orderNumber,
  status,
}: {
  phone: string;
  name: string;
  orderNumber: number;
  status: OrderStatus;
}) {
  const buildMessage = MESSAGE_BUILDERS[status];
  if (!buildMessage) return null;

  const digits = phone.replace(/\D/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(buildMessage(name, orderNumber))}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 border border-nadya-line dark:border-nadya-gold/15 px-3 py-1.5 text-xs font-medium text-nadya-black dark:text-nadya-cream transition hover:border-nadya-gold hover:text-nadya-gold-dark"
    >
      💬 Notifier via WhatsApp
    </a>
  );
}
