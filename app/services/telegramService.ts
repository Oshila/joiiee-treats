import { Order } from "./orderService";

export const sendOrderToTelegram = async (order: Order) => {
  try {
    const res = await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Telegram send failed" };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};