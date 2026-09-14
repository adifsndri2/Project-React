import React, { useState } from 'react'
import { LockKeyhole } from 'lucide-react'
import { signIn, signUp } from '../services/auth'

export function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('Adi Fathul')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submitLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isSignUp) {
        const result = await signUp(email, password, fullName)
        if (result.session) onLogin(result.session)
        else setError('Akun dibuat. Cek email kamu untuk konfirmasi sebelum login.')
      } else {
        const session = await signIn(email, password)
        onLogin(session)
      }
    } catch (loginError) {
      setError(loginError.message || 'Email atau password belum sesuai.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="login-page"><div className="login-decoration login-decoration--one" /><div className="login-decoration login-decoration--two" /><section className="login-card"><div className="brand login-brand"><span className="brand-mark">F</span><span>finora</span></div><p className="eyebrow">Your money, in focus</p><h1>{isSignUp ? 'Create your account.' : 'Welcome back.'}</h1><p className="login-copy">{isSignUp ? 'Start building better financial habits with Finora.' : 'Sign in to keep your financial habits moving in the right direction.'}</p><form onSubmit={submitLogin} className="login-form">{isSignUp && <label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" required /></label>}<label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required autoFocus /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" minLength="6" required /></label>{error && <p className="login-error">{error}</p>}<button className="primary-button" type="submit" disabled={loading}><LockKeyhole size={16} /> {loading ? 'Connecting...' : isSignUp ? 'Create account' : 'Sign in to Finora'}</button></form><button className="login-switch" onClick={() => { setIsSignUp((current) => !current); setError('') }}>{isSignUp ? 'Already have an account? Sign in' : 'New to Finora? Create an account'}</button></section><p className="login-footer">Personal finance, made calmer.</p></main>
}
