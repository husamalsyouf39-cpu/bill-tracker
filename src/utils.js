export const CATEGORIES = [
  { value: 'streaming', label: 'Streaming', icon: '📺', color: '#9c27b0' },
  { value: 'utilities', label: 'Utilities', icon: '⚡', color: '#ff9800' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️', color: '#2196f3' },
  { value: 'subscription', label: 'Subscription', icon: '🔄', color: '#00bcd4' },
  { value: 'rent', label: 'Rent', icon: '🏠', color: '#4caf50' },
  { value: 'phone', label: 'Phone', icon: '📱', color: '#3f51b5' },
  { value: 'loan', label: 'Loan', icon: '💳', color: '#f44336' },
  { value: 'other', label: 'Other', icon: '📌', color: '#607d8b' },
];

export const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

export function getMonthlyAmount(amount, frequency) {
  switch (frequency) {
    case 'weekly': return amount * 4.33;
    case 'yearly': return amount / 12;
    case 'quarterly': return amount / 3;
    default: return amount;
  }
}

// Accepts a full bill object. Returns days until next due date (0 = due today).
export function getDaysUntil(bill) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (bill.frequency === 'weekly') {
    // dueDay: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
    // JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const targetJsDay = bill.dueDay === 7 ? 0 : bill.dueDay;
    const diff = (targetJsDay - today.getDay() + 7) % 7;
    return diff; // 0 = due today, next occurrence otherwise
  }

  if (bill.frequency === 'yearly') {
    // dueMonth is 1-indexed (1=Jan … 12=Dec), dueDay is day of that month
    const month = (bill.dueMonth || 1) - 1;
    let due = new Date(today.getFullYear(), month, bill.dueDay);
    if (due < today) due = new Date(today.getFullYear() + 1, month, bill.dueDay);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  }

  if (bill.frequency === 'quarterly') {
    // Next occurrence of dueDay in this month; if past, jump 3 months ahead
    let due = new Date(today.getFullYear(), today.getMonth(), bill.dueDay);
    if (due < today) due = new Date(today.getFullYear(), today.getMonth() + 3, bill.dueDay);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  }

  // monthly
  let due = new Date(today.getFullYear(), today.getMonth(), bill.dueDay);
  if (due < today) due = new Date(today.getFullYear(), today.getMonth() + 1, bill.dueDay);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

export function getDueStatus(bill) {
  if (!bill.active) return 'paused';
  const days = getDaysUntil(bill);
  if (days < 0) return 'overdue';
  if (days <= 3) return 'critical';
  if (days <= 7) return 'soon';
  return 'ok';
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCategoryMeta(value) {
  return CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
}

export function sortBillsByDue(bills) {
  return [...bills].sort((a, b) => {
    if (!a.active && b.active) return 1;
    if (a.active && !b.active) return -1;
    return getDaysUntil(a) - getDaysUntil(b);
  });
}
