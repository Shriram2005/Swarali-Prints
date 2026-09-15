import { Order, CartItem, CustomJobConfig } from './types';

export function getWhatsAppNumber(): string {
  return '919823123456';
}

export function buildWhatsAppChatLink(customMessage?: string): string {
  const phone = getWhatsAppNumber();
  const text = customMessage
    ? encodeURIComponent(customMessage)
    : encodeURIComponent('Hello Swarali Prints! I would like to inquire about printing services at your Cidco, Nashik shop.');
  return `https://wa.me/${phone}?text=${text}`;
}

export function buildWhatsAppCustomPrintLink(config: CustomJobConfig, estimatedTotal: number): string {
  let details = `*New Printing Inquiry from Website*\n`;
  details += `*Service:* ${config.serviceType.replace('-', ' ').toUpperCase()}\n`;

  if (config.serviceType === 'flex-printing') {
    details += `*Size:* ${config.widthFt} ft x ${config.heightFt} ft (${(config.widthFt || 0) * (config.heightFt || 0)} sq.ft)\n`;
    details += `*Material:* ${config.material || 'Standard'}\n`;
    if (config.finishing?.length) details += `*Finishing:* ${config.finishing.join(', ')}\n`;
  } else if (config.serviceType === 'document-printing') {
    details += `*Pages:* ${config.pageCount}, *Copies:* ${config.copies}\n`;
    details += `*Color Mode:* ${config.colorMode === 'color' ? 'Color' : 'B&W'}\n`;
    details += `*Paper Size:* ${config.paperSize}\n`;
    if (config.binding) details += `*Binding:* ${config.binding}\n`;
  } else if (config.serviceType === 'visiting-cards') {
    details += `*Quantity:* ${config.cardQuantity} cards\n`;
    details += `*Sides:* ${config.sides}\n`;
    details += `*Stock:* ${config.cardStock}\n`;
  }

  details += `*Quantity:* ${config.quantity || 1}\n`;
  if (config.designRequired) details += `*Design Help Needed:* Yes\n`;
  if (config.instructions) details += `*Instructions:* ${config.instructions}\n`;
  details += `*Est. Price:* ₹${estimatedTotal}\n\n`;
  details += `Can you please confirm this order and turnaround time?`;

  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(details)}`;
}

export function buildWhatsAppOrderLink(order: Order): string {
  let msg = `*Order Update / Inquiry: ${order.id}*\n`;
  msg += `*Customer:* ${order.customerName} (${order.customerPhone})\n`;
  msg += `*Total Amount:* ₹${order.totalAmount} (${order.paymentStatus.toUpperCase()})\n`;
  msg += `*Fulfillment:* ${order.fulfillmentMethod.replace(/_/g, ' ')}\n`;
  msg += `*Items:*\n`;
  order.items.forEach((item, index) => {
    msg += `${index + 1}. ${item.title} (x${item.quantity}) - ₹${item.totalPrice}\n`;
  });
  msg += `\nPlease update me regarding my print status. Thank you!`;
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(msg)}`;
}

export const buildWhatsAppOrderSummary = buildWhatsAppOrderLink;

export function buildWhatsAppStatusNotification(
  phone: string,
  orderId: string,
  status: string,
  customerName: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const targetNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const message = `Hello ${customerName},\n\nYour Swarali Prints order *${orderId}* status has been updated to: *${status.replace(/_/g, ' ').toUpperCase()}*.\n\nTrack your order and review proofs here: https://swaraliprints.com/orders/${orderId}\n\nThank you for choosing Swarali Prints, Trimurti Chowk, Cidco, Nashik!`;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppQuoteInquiry(data: {
  name: string;
  phone: string;
  service: string;
  quantity: string;
  notes?: string;
}): string {
  let msg = `*Bulk Quote Inquiry from Website*\n`;
  msg += `*Name:* ${data.name}\n`;
  msg += `*Phone:* ${data.phone}\n`;
  msg += `*Service Required:* ${data.service}\n`;
  msg += `*Quantity:* ${data.quantity}\n`;
  if (data.notes) msg += `*Details:* ${data.notes}\n`;
  msg += `\nPlease provide your wholesale quotation and expected delivery timeline.`;
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(msg)}`;
}
