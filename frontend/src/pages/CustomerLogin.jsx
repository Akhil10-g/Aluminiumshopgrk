import { Link } from 'react-router-dom'

function CustomerLogin() {
  return (
    <section className="section shell admin-page">
      <div className="admin-card auth-card customer-access-card">
        <h1>Customer Access</h1>
        <p>
          No password is required. Choose a quick method below to share your requirement,
          and our team will contact you.
        </p>

        <div className="customer-access-actions">
          <a
            href="/#quote-form"
            className="solid-btn"
          >
            Open Quote Form
          </a>

          <a
            href="https://wa.me/919392012776?text=Hello%20GRK%20Aluminium%20Works%2C%20I%20need%20a%20quote."
            target="_blank"
            rel="noreferrer"
            className="outline-btn"
          >
            Continue on WhatsApp
          </a>
        </div>

        <p className="admin-mini-text">Call us: +91 9392012776, +91 9849170500</p>

        <div className="customer-access-links">
          <Link to="/admin/login">Admin Login</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </section>
  )
}

export default CustomerLogin
