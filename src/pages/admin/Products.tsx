import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminProducts() {
  useEffect(() => {
    console.log('🚀 Component mounted!')
    alert('Component is running!')
    
    const test = async () => {
      console.log('🔍 Starting test...')
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User:', user)
      alert(`User ID: ${user?.id || 'NOT LOGGED IN'}`)
    }
    
    test()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Products - Debug Mode</h1>
      <p>Check console (F12) for output</p>
    </div>
  )
}
