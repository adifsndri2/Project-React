import { supabase, isSupabaseConfigured } from '../lib/supabase'

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.')
  }
  return supabase
}

function toTransaction(row) {
  return { id: row.id, merchant: row.merchant, category: row.category, date: new Date(row.transaction_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), amount: row.type === 'expense' ? -Number(row.amount) : Number(row.amount), type: row.type, icon: row.merchant.slice(0, 2).toUpperCase(), color: row.type === 'expense' ? 'coral' : 'mint' }
}

function toBudget(row) {
  return { id: row.id, name: row.name, limit: Number(row.limit_amount), spent: Number(row.spent_amount), color: 'mint' }
}

export const database = {
  async listTransactions() {
    const { data, error } = await requireSupabase().from('transactions').select('*').order('transaction_date', { ascending: false })
    if (error) throw error
    return data.map(toTransaction)
  },

  async createTransaction(transaction, userId) {
    const { data, error } = await requireSupabase().from('transactions').insert({ user_id: userId, merchant: transaction.merchant, category: transaction.category, amount: Math.abs(transaction.amount), type: transaction.type, transaction_date: transaction.transaction_date || new Date().toISOString() }).select().single()
    if (error) throw error
    return toTransaction(data)
  },

  async updateTransaction(id, transaction) {
    const { data, error } = await requireSupabase().from('transactions').update({ merchant: transaction.merchant, category: transaction.category, amount: Math.abs(transaction.amount), type: transaction.type }).eq('id', id).select().single()
    if (error) throw error
    return toTransaction(data)
  },

  async deleteTransaction(id) {
    const { error } = await requireSupabase().from('transactions').delete().eq('id', id)
    if (error) throw error
  },

  async listBudgets() {
    const { data, error } = await requireSupabase().from('budgets').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data.map(toBudget)
  },

  async createBudget(budget, userId) {
    const { data, error } = await requireSupabase().from('budgets').insert({ user_id: userId, name: budget.name, limit_amount: budget.limit, spent_amount: budget.spent || 0 }).select().single()
    if (error) throw error
    return toBudget(data)
  },

  async updateBudget(id, budget) {
    const { data, error } = await requireSupabase().from('budgets').update({ name: budget.name, limit_amount: budget.limit, spent_amount: budget.spent || 0 }).eq('id', id).select().single()
    if (error) throw error
    return toBudget(data)
  },

  async deleteBudget(id) {
    const { error } = await requireSupabase().from('budgets').delete().eq('id', id)
    if (error) throw error
  },
}
