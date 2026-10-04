import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { success: false, error: "Telegram not configured on server" },
        { status: 500 }
      );
    }

    const itemsList = (order.items || [])
      .map(
        (i: any) =>
          `${i.name} (${i.size}) x${i.quantity} - N${(
            i.price * i.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    const message = `
NEW ORDER — ${order.orderNumber}

CUSTOMER
Name: ${order.customer?.name || "-"}
Phone: ${order.customer?.phone || "-"}
Email: ${order.customer?.email || "-"}
Address: ${order.customer?.address || "-"}, ${order.customer?.city || "-"}, ${order.customer?.state || "-"}

ITEMS
${itemsList}

Products Total: N${(order.subtotal || 0).toLocaleString()}
Delivery: TO BE QUOTED (contact customer with fee)
TOTAL PAID: N${(order.total || 0).toLocaleString()}

Payment Ref: ${order.paymentReference || "-"}
${order.notes ? `Notes: ${order.notes}` : ""}
`.trim();

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { success: false, error: body },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}