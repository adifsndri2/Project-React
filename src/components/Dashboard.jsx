import React from 'react'
import { ArrowDownLeft, ArrowUpRight, ChevronDown, MoreHorizontal, Target, Wallet } from 'lucide-react'
import { formatCurrency } from '../data'

export function StatCard({ title, value, change, icon: Icon, tone }) {
  return <article className={`stat-card ${tone}`}><div className="stat-card__top"><span>{title}</span><span className="icon-button small"><Icon size={16} /></span></div><strong>{value}</strong><p><span className={change.startsWith('-') ? 'negative' : 'positive'}>{change}</span> <span className="muted">from saved transactions</span></p></article>
}

function ActivityChart({ transactions }) {
  const orderedTransactions = [...transactions].reverse()
  let runningBalance = 0
  const balances = orderedTransactions.map((transaction) => {
    runningBalance += transaction.amount
    return runningBalance
  })
  const values = balances.length ? balances : [0]
  const min = Math.min(...values, 0)
  const max = Math.max(...values, 1)
  const range = max - min || 1
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 260 : (index / (values.length - 1)) * 520
    const y = 106 - ((value - min) / range) * 94
    return `${x},${y}`
  }).join(' ')
  const labels = orderedTransactions.map((transaction) => transaction.date.split(',')[0]).slice(-6)
  return <div className="chart-wrap"><div className="chart-y"><span>{formatCurrency(max)}</span><span>{formatCurrency(Math.round((max + min) / 2))}</span><span>{formatCurrency(min)}</span><span>Rp 0</span></div><svg viewBox="0 0 520 120" preserveAspectRatio="none" role="img" aria-label="Balance activity from transactions"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4972e8" stopOpacity=".25" /><stop offset="1" stopColor="#4972e8" stopOpacity="0" /></linearGradient></defs><path d={`M ${points} L 520 120 L 0 120 Z`} fill="url(#area)" /><polyline points={points} fill="none" stroke="#4972e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx={values.length === 1 ? 260 : ((values.length - 1) / (values.length - 1)) * 520} cy={values.length === 1 ? 106 - ((values[0] - min) / range) * 94 : 106 - ((values[values.length - 1] - min) / range) * 94} r="5" fill="#fff" stroke="#4972e8" strokeWidth="3" /></svg><div className="chart-x">{(labels.length ? labels : ['No data']).map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div></div>
}

export function Overview({ transactions, onNotice }) {
  const income = transactions.filter((transaction) => transaction.type === 'income').reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
  const spendingTotal = transactions.filter((transaction) => transaction.type === 'expense').reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
  const balance = income - spendingTotal
  const savingsRate = income ? (balance / income) * 100 : 0
  const categoryTotals = transactions.filter((transaction) => transaction.type === 'expense').reduce((categories, transaction) => { categories[transaction.category] = (categories[transaction.category] || 0) + Math.abs(transaction.amount); return categories }, {})
  const categoryEntries = Object.entries(categoryTotals).sort(([, first], [, second]) => second - first)
  const categoryColors = ['var(--blue)', 'var(--coral)', 'var(--yellow)', 'var(--ink)']
  let categoryStart = 0
  const donutStops = categoryEntries.map(([, amount], index) => { const end = categoryStart + (amount / spendingTotal) * 100; const stop = `${categoryColors[index % categoryColors.length]} ${categoryStart}% ${end}%`; categoryStart = end; return stop }).join(', ')
  return <><section className="stats-grid"><StatCard title="Total balance" value={formatCurrency(balance)} change={`${transactions.length} transactions`} icon={Wallet} tone="blue" /><StatCard title="Monthly income" value={formatCurrency(income)} change="Income recorded" icon={ArrowDownLeft} tone="mint" /><StatCard title="Monthly spending" value={formatCurrency(spendingTotal)} change="Expenses recorded" icon={ArrowUpRight} tone="coral" /><StatCard title="Savings rate" value={`${savingsRate.toFixed(1)}%`} change="Income saved" icon={Target} tone="yellow" /></section><section className="dashboard-grid"><article className="panel activity-panel"><div className="panel-heading"><div><h2>Balance activity</h2><p>Cumulative balance from your transactions.</p></div><button className="select-button" onClick={() => onNotice('Showing all transaction activity')}>All activity <ChevronDown size={15} /></button></div><div className="chart-legend"><span><i className="legend-dot blue-dot" /> Balance</span><span className="muted">Based on saved data</span></div><ActivityChart transactions={transactions} /></article><article className="panel spending-panel"><div className="panel-heading"><div><h2>Spending breakdown</h2><p>Expense categories from your transactions.</p></div><button className="more-button" onClick={() => onNotice('Spending insights are up to date')} aria-label="More options"><MoreHorizontal size={20} /></button></div><div className="donut-wrap"><div className="donut" style={{ background: categoryEntries.length ? `conic-gradient(${donutStops})` : 'var(--line)' }}><div><strong>{formatCurrency(spendingTotal)}</strong><span>total spending</span></div></div></div><div className="spending-list">{categoryEntries.length ? categoryEntries.map(([label, amount], index) => <div className="spending-row" key={label}><div><i style={{ background: categoryColors[index % categoryColors.length] }} />{label}</div><strong>{formatCurrency(amount)}<small>{spendingTotal ? Math.round((amount / spendingTotal) * 100) : 0}%</small></strong></div>) : <div className="empty-state">No expense transactions yet.</div>}</div></article></section></>
}
