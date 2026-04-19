import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, getApiErrorMessage } from '../services/api'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const existingToken = localStorage.getItem('adminToken')
    if (existingToken) {
      navigate('/admin/homepage', { replace: true })
    }
  }, [navigate])

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = await adminLogin({ email, password })
      localStorage.setItem('adminToken', payload.token)
      window.location.assign('/admin/homepage')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section shell admin-page">
      <div className="admin-card auth-card">
        <h1>Admin Login</h1>
        <p>Sign in to manage homepage images and sections.</p>

        <form className="admin-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="solid-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default AdminLogin
