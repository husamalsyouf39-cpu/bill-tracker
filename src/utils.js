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

export function getDaysUntil(dueDay) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let dueDate = new Date(currentYear, currentMonth, dueDay);

  if (dueDay < currentDay) {
    // Due day has passed this month, use next month
    dueDate = new Date(currentYear, currentMonth + 1, dueDay);
  }

  const diff = dueDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getDueStatus(bill) {
  if (!bill.active) return 'paused';
  const days = getDaysUntil(bill.dueDay);
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
    return getDaysUntil(a.dueDay) - getDaysUntil(b.dueDay);
  });
}
