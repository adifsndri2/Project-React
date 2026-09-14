import React from 'react'
import { CalendarDays, ChevronDown, MoreHorizontal, Pencil, Search } from 'lucide-react'
import { formatCurrency } from '../data'

export function TransactionRows({ transactions, onSelect }) {
  return transactions.length ? transactions.map((transaction) => <div className="transaction-row" key={transaction.id}><div className={`merchant-icon ${transaction.color}`}>{transaction.icon}</div><div className="merchant-name"><strong>{transaction.merchant}</strong><span>{transaction.category}</span></div><span className="transaction-date">{transaction.date}</span><strong className={transaction.type === 'income' ? 'amount income' : 'amount'}>{transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}</strong><button className="more-button" onClick={() => onSelect(transaction)} aria-label={`Edit ${transaction.merchant}`}><Pencil size={16} /></button></div>) : <div className="empty-state">No transactions match your search.</div>
}

export function TransactionToolbar({ filter, setFilter, searchQuery, setSearchQuery, onDateClick }) {
  return <div className="table-toolbar"><div className="search-box"><Search size={16} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search transactions" /></div><div className="filter-tabs">{['All', 'Income', 'Expense'].map((item) => <button className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><button className="date-button" onClick={onDateClick}><CalendarDays size={15} /> Sep 2026 <ChevronDown size={14} /></button></div>
}

export function TransactionsView({ activeNav, transactions, visibleTransactions, filter, setFilter, searchQuery, setSearchQuery, onSelect, onViewAll, onDateClick }) {
  return <section className="panel transactions-panel"><div className="panel-heading"><div><h2>{activeNav === 'Overview' ? 'Recent transactions' : 'All transactions'}</h2><p>Your latest income and expenses.</p></div><button className="text-button" onClick={onViewAll}>View all <MoreHorizontal size={15} /></button></div><TransactionToolbar filter={filter} setFilter={setFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onDateClick={onDateClick} /><div className="transaction-list"><TransactionRows transactions={visibleTransactions} onSelect={onSelect} /></div></section>
}
