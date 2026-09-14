import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownLeft, ArrowUpRight, Bell, ChevronDown, ChevronRight, CircleHelp, LayoutDashboard, LogOut, Plus, Settings, Target, Wallet } from 'lucide-react'
import { initialBudgets, initialTransactions } from './data'
import { Overview } from './components/Dashboard'
import { BudgetsView } from './components/Budgets'
import { HelpCenterView } from './components/HelpCenter'
import { LoginScreen } from './components/LoginScreen'
import { SettingsView } from './components/Settings'
import { TransactionModal } from './components/TransactionModal'
import { TransactionToolbar, TransactionRows } from './components/Transactions'
import { getSession, signOut } from './services/auth'
import { database } from './services/database'
import './style.css'

function App() {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeNav, setActiveNav] = useState('Overview')
  const [transactions, setTransactions] = useState(initialTransactions)
  const [budgets, setBudgets] = useState(initialBudgets)
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    getSession().then(async (currentSession) => {
      setSession(currentSession)
      if (currentSession) await loadDatabase(currentSession.user.id)
    }).catch((error) => setNotice(error.message)).finally(() => setIsLoading(false))
  }, [])

  const visibleTransactions = useMemo(() => transactions.filter((transaction) => {
    const matchesFilter = filter === 'All' || transaction.type === filter.toLowerCase()
    return matchesFilter && `${transaction.merchant} ${transaction.category}`.toLowerCase().includes(searchQuery.toLowerCase())
  }), [filter, searchQuery, transactions])

  if (isLoading) return <div className="loading-screen">Connecting to Finora...</div>
  if (!session) return <LoginScreen onLogin={handleLogin} />

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function selectNav(label) {
    setActiveNav(label)
    showNotice(`${label} opened`)
  }

  async function loadDatabase(userId) {
    try {
      const [cloudTransactions, cloudBudgets] = await Promise.all([database.listTransactions(), database.listBudgets()])
      setTransactions(cloudTransactions)
      setBudgets(cloudBudgets)
    } catch (error) {
      showNotice(`Database error: ${error.message}`)
    }
  }

  async function handleLogin(nextSession) {
    setSession(nextSession)
    await loadDatabase(nextSession.user.id)
  }

  async function saveTransaction(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const amount = Number(form.get('amount'))
    const type = form.get('type')
    const transaction = { id: editingTransaction?.id || Date.now(), merchant: form.get('merchant'), category: form.get('category'), date: editingTransaction?.date || 'Just now', amount: type === 'expense' ? -amount : amount, type, icon: String(form.get('merchant')).slice(0, 2).toUpperCase(), color: type === 'expense' ? 'coral' : 'mint' }
    try {
      const saved = editingTransaction ? await database.updateTransaction(editingTransaction.id, transaction) : await database.createTransaction(transaction, session.user.id)
      setTransactions((current) => editingTransaction ? current.map((item) => item.id === editingTransaction.id ? saved : item) : [saved, ...current])
      closeModal()
      showNotice(editingTransaction ? 'Transaction updated successfully' : 'Transaction added successfully')
    } catch (error) {
      showNotice(`Unable to save transaction: ${error.message}`)
    }
  }

  async function deleteTransaction() {
    try {
      await database.deleteTransaction(editingTransaction.id)
      setTransactions((current) => current.filter((item) => item.id !== editingTransaction.id))
      closeModal()
      showNotice('Transaction deleted successfully')
    } catch (error) {
      showNotice(`Unable to delete transaction: ${error.message}`)
    }
  }

  function closeModal() {
    setEditingTransaction(null)
    setShowModal(false)
  }

  function handleLogout() {
    signOut()
    setSession(null)
    setShowProfileMenu(false)
  }

  const userEmail = session.user.email
  const userName = userEmail.split('@')[0]
  const userInitials = userName.slice(0, 2).toUpperCase()
  const pageCopy = {
    Overview: [`Good morning, ${userName}`, 'Here is your financial snapshot for this month.'],
    Transactions: ['Transactions', 'Review, search, and manage your money movement.'],
    Budgets: ['Budgets', 'Plan your spending and stay ahead of your goals.'],
    Settings: ['Settings', 'Personalize your Finora workspace.'],
    'Help center': ['Help center', 'Answers and guidance for your financial workflow.'],
  }
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">F</span><span>finora</span></div><div className="profile-wrap"><button className="profile" onClick={() => setShowProfileMenu((current) => !current)}><div className="avatar">{userInitials}</div><div><strong>{userName}</strong><span>{userEmail}</span></div><ChevronDown size={15} /></button>{showProfileMenu && <div className="profile-menu"><span>Signed in as<br /><strong>{userEmail}</strong></span><button onClick={handleLogout}><LogOut size={15} /> Sign out</button></div>}</div><nav className="nav-list"><p className="nav-label">Workspace</p>{[['Overview', LayoutDashboard], ['Transactions', Wallet], ['Budgets', Target]].map(([label, Icon]) => <button className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => selectNav(label)} key={label}><Icon size={18} /><span>{label}</span>{label === 'Transactions' && <b>{transactions.length}</b>}</button>)}<p className="nav-label nav-label--spaced">Manage</p>{[['Settings', Settings], ['Help center', CircleHelp]].map(([label, Icon]) => <button className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => selectNav(label)} key={label}><Icon size={18} /><span>{label}</span></button>)}</nav><div className="sidebar-bottom"><div className="upgrade-card"><span className="spark">✦</span><strong>Make your money<br />work smarter.</strong><p>Unlock advanced insights with Finora Pro.</p><button onClick={() => showNotice('Pro preview coming soon')}>Explore Pro <ArrowUpRight size={14} /></button></div><span className="version">Finora v1.0.0</span></div></aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" onClick={() => showNotice('You are all caught up')} aria-label="Notifications"><Bell size={19} /><i /></button><button className="top-avatar" onClick={() => setShowProfileMenu((current) => !current)} aria-label="Open profile">{userInitials}</button></div></header><section className="page-heading"><div><p className="eyebrow">Monday, 14 September 2026</p><h1>{pageCopy[activeNav][0]}<span> ✦</span></h1><p className="subtitle">{pageCopy[activeNav][1]}</p></div>{(activeNav === 'Overview' || activeNav === 'Transactions') && <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={18} /> Add transaction</button>}</section>
      {activeNav === 'Overview' && <Overview transactions={transactions} onNotice={showNotice} />}
      {(activeNav === 'Overview' || activeNav === 'Transactions') && <section className="panel transactions-panel"><div className="panel-heading"><div><h2>{activeNav === 'Overview' ? 'Recent transactions' : 'All transactions'}</h2><p>Your latest income and expenses.</p></div><button className="text-button" onClick={() => selectNav('Transactions')}>View all <ArrowUpRight size={15} /></button></div><TransactionToolbar filter={filter} setFilter={setFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onDateClick={() => showNotice('Date filter is set to September 2026')} /><div className="transaction-list"><TransactionRows transactions={visibleTransactions} onSelect={(transaction) => { setEditingTransaction(transaction); setShowModal(true) }} /></div></section>}
      {activeNav === 'Budgets' && <BudgetsView budgets={budgets} transactions={transactions} onAdd={async (budget) => { try { const saved = await database.createBudget(budget, session.user.id); setBudgets((current) => [...current, saved]); showNotice('Budget created successfully') } catch (error) { showNotice(`Unable to create budget: ${error.message}`) } }} onEdit={async (budget) => { try { const saved = await database.updateBudget(budget.id, budget); setBudgets((current) => current.map((item) => item.id === budget.id ? saved : item)); showNotice('Budget updated successfully') } catch (error) { showNotice(`Unable to update budget: ${error.message}`) } }} onDelete={async (id) => { try { await database.deleteBudget(id); setBudgets((current) => current.filter((budget) => budget.id !== id)) } catch (error) { showNotice(`Unable to delete budget: ${error.message}`) } }} onNotice={showNotice} />}
      {activeNav === 'Settings' && <SettingsView onNotice={showNotice} userEmail={userEmail} userName={userName} />}{activeNav === 'Help center' && <HelpCenterView onNotice={showNotice} />}<footer>© 2026 Finora <span>Built for better financial habits.</span></footer></main>
    {notice && <div className="toast"><span>✓</span>{notice}</div>}{showModal && <TransactionModal transaction={editingTransaction} onClose={closeModal} onSubmit={saveTransaction} onDelete={editingTransaction ? deleteTransaction : undefined} />}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
