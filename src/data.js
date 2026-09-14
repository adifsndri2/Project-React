export const initialTransactions = [
  { id: 1, merchant: 'Monthly salary', category: 'Income', date: 'Today, 09:12', amount: 12500000, type: 'income', icon: 'MS', color: 'mint' },
  { id: 2, merchant: 'Whole Foods Market', category: 'Groceries', date: 'Today, 08:40', amount: -682500, type: 'expense', icon: 'WF', color: 'coral' },
  { id: 3, merchant: 'Notion Labs', category: 'Subscriptions', date: 'Yesterday, 18:20', amount: -145000, type: 'expense', icon: 'N', color: 'ink' },
  { id: 4, merchant: 'Grab Transport', category: 'Transport', date: 'Yesterday, 13:04', amount: -86000, type: 'expense', icon: 'G', color: 'yellow' },
  { id: 5, merchant: 'Freelance project', category: 'Income', date: '12 Sep 2026, 16:30', amount: 2450000, type: 'income', icon: 'FP', color: 'blue' },
]

export const spending = [
  { label: 'Housing', value: 42, amount: 'Rp 3.8 jt', color: 'var(--blue)' },
  { label: 'Food & dining', value: 28, amount: 'Rp 2.5 jt', color: 'var(--coral)' },
  { label: 'Lifestyle', value: 18, amount: 'Rp 1.6 jt', color: 'var(--yellow)' },
  { label: 'Others', value: 12, amount: 'Rp 1.1 jt', color: 'var(--ink)' },
]

export const initialBudgets = [
  { id: 1, name: 'Food & dining', limit: 3000000, spent: 2180000, color: 'coral' },
  { id: 2, name: 'Transport', limit: 1500000, spent: 860000, color: 'blue' },
  { id: 3, name: 'Entertainment', limit: 1000000, spent: 420000, color: 'yellow' },
]

export const helpArticles = [
  { title: 'How do I add a transaction?', text: 'Use Add transaction from Overview or Transactions, then fill in the merchant, type, category, and amount.' },
  { title: 'How do I create a budget?', text: 'Open Budgets from the sidebar and choose New budget to set a monthly spending limit.' },
  { title: 'Can I edit or delete my data?', text: 'Select the pencil icon on a transaction or budget. You can update its details or remove it.' },
  { title: 'How is my spending calculated?', text: 'Finora groups expense transactions by category to help you understand monthly habits.' },
]

export function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Math.abs(value)).replace('Rp', 'Rp ')
}
