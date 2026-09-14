import { supabase, isSupabaseConfigured } from '../lib/supabase'

export async function signIn(email, password) {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase belum dikonfigurasi.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function signUp(email, password, fullName) {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase belum dikonfigurasi.')
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
  if (error) throw error
  return data
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
}

export async function getSession() {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}
