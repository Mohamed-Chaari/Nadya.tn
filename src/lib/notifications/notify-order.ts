import "server-only";
import type { OrderStatus } from "@/lib/types";

export interface OrderNotificationPayload {
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  total: number;
  itemSummary: string;
}

interface OrderNotifier {
  sendOrderConfirmation(payload: OrderNotificationPayload): Promise<void>;
  sendStatusUpdate(payload: OrderNotificationPayload, status: OrderStatus): Promise<void>;
}

// No WhatsApp Cloud API credentials yet (see PRD open items). This console
// implementation keeps the call sites and payload shape final — swap the
// body for a Meta Graph API call once WHATSAPP_* env vars exist.
const consoleNotifier: OrderNotifier = {
  async sendOrderConfirmation(payload) {
    console.log(
      `[notify] Order #${payload.orderNumber} confirmation → ${payload.customerPhone} (${payload.customerName}): ${payload.itemSummary} — total ${payload.total} DT`
    );
  },
  async sendStatusUpdate(payload, status) {
    console.log(
      `[notify] Order #${payload.orderNumber} status → ${status} → ${payload.customerPhone}`
    );
  },
};

export const orderNotifier: OrderNotifier = consoleNotifier;
