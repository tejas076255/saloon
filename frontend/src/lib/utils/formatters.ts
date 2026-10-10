export function formatCurrency(amount: number, currency = '₹'): string {
  return `${currency}${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

export function generateWhatsAppReceiptLink(
  phone: string | undefined,
  salonName: string,
  invoiceNumber: string,
  totalAmount: number,
  currency = '₹'
): string {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const message = `Hello from *${salonName}*! ✨\nThank you for visiting us. Your receipt *#${invoiceNumber}* for *${currency}${totalAmount.toFixed(2)}* has been generated.\nWe look forward to serving you again!`;
  const encoded = encodeURIComponent(message);
  return targetPhone ? `https://wa.me/${targetPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}
