import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  async sendOrderNotification(order: any) {
    const {
      user,
      overallPrice,
      status,
      date,
      address,
      withDelivery,
      deliveryComment,
      longitude,
      latitude,
      paymentStatus,
      paymentMethod,
      orderTools,
      orderWorkers,
    } = order;

    const formattedDate = new Date(date).toLocaleString('en-GB', {
      timeZone: 'Asia/Tashkent',
    });

    const message = `
🛒 *New Order Placed!*

👤 *Customer:* ${user?.fullname ?? 'N/A'}
📧 *Email:* ${user?.email ?? 'N/A'}
📞 *Phone:* ${user?.phone ?? 'N/A'}

🧾 *Order Details:*
🆔 Order ID: ${order.id}
💰 Total Price: $${overallPrice}
🗓 Date: ${formattedDate}
📍 Address: ${address ?? 'Not provided'}
🚚 Delivery: ${withDelivery ? 'Yes' : 'No'}
📝 Delivery Note: ${deliveryComment ?? 'None'}

📍 Location:
Latitude: ${latitude ?? 'N/A'}
Longitude: ${longitude ?? 'N/A'}

💳 Payment Method: ${paymentMethod?.name ?? 'Unknown'}
💵 Payment Status: *${paymentStatus.toUpperCase()}*
📦 Order Status: *${status.toUpperCase()}*

🔧 *Tools:*
${
  orderTools?.length
    ? orderTools
        .map(
          (tool, idx) =>
            `#${idx + 1} ${tool.name ?? 'Tool'} x${tool.count} - $${tool.price}`,
        )
        .join('\n')
    : 'No tools added.'
}

👷‍♂️ *Workers:*
${
  orderWorkers?.length
    ? orderWorkers
        .map(
          (worker, idx) =>
            `#${idx + 1} Proficiency: ${worker.workerProficiency?.name ?? 'Unknown'}, Level: ${worker.workerLevel?.name ?? 'Unknown'}, Count: ${worker.count}, Tools: ${worker.withTools ? 'Yes' : 'No'}, Time: ${worker.time} ${worker.timeUnit}`,
        )
        .join('\n')
    : 'No workers requested.'
}
`;

    await axios.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      chat_id: this.chatId,
      text: message,
      parse_mode: 'Markdown',
    });
  }
}
