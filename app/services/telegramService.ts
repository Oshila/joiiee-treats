import { Order } from "./orderService";

export const sendOrderToTelegram = async (order: Order) => {
  const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (!token || !chatId) return { success: false, error: "Telegram not configured" };

  const itemsList = order.items
    .map(
      (i) =>
        `${i.name} (${i.size}) x${i.quantity} - N${(i.price * i.quantity).toLocaleString()}`
    )
    .join("\n");

  const message = `
NEW ORDER — ${order.orderNumber}

CUSTOMER
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Email: ${order.customer.email}
Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state}

ITEMS
${itemsList}

Products Total: N${order.subtotal.toLocaleString()}
Delivery: TO BE QUOTED (contact customer with fee)
TOTAL PAID: N${order.total.toLocaleString()}

Payment Ref: ${order.paymentReference}
${order.notes ? `Notes: ${order.notes}` : ""}
`.trim();

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      }
    );
    if (!res.ok) throw new Error("Telegram send failed");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};