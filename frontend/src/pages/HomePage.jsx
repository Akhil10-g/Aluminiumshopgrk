import { useState } from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Materials from '../components/Materials'
import { createQuoteRequest } from '../services/api'

const servicePoints = [
  'Domal Aluminium Door & Window Manufacturer',
  'Aluminium Fabrication Service',
  'Aluminium Partition Services',
  'Office Partition Service Provider',
  'Glass Aluminium Work Services',
  'Glazing Services',
  'Aluminium Window Installation Service',
  'Aluminium Door Installation Service',
  'Aluminium Partition Fabrication Work',
  'Aluminium Door Fabrication Work',
  'Aluminium Window Fabrication Work',
  'Stainless Steel Works',
]

const productPoints = [
  'Domal Aluminium Windows',
  'Domal Aluminium Doors',
  'Domal Aluminium Partitions',
  'Aluminium Partitions',
  'Aluminium Windows',
  'Aluminium Doors',
  'Aluminium Work Stations',
  'Aluminium Office Partitions',
  'Aluminium Room Partitions',
  'Aluminium Composite Panels',
  'Movable Aluminium Partitions',
  'Aluminium Structural Glazing',
  'Glass Patches',
  'Aluminium Plastic Composite Panel',
  'Shower Cubicle',
  'Aluminium Louvers',
  'Security Doors',
]

function HomePage() {
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
    contactMode: 'either',
    sendToWhatsApp: true,
  })
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteStatus, setQuoteStatus] = useState('')
  const [quoteError, setQuoteError] = useState('')

  const businessWhatsApp = '919392012776'

  const onQuoteFieldChange = (field, value) => {
    setQuoteForm((prev) => ({ ...prev, [field]: value }))
  }

  const onQuoteSubmit = async (event) => {
    event.preventDefault()
    setQuoteStatus('')
    setQuoteError('')
    setQuoteLoading(true)

    try {
      await createQuoteRequest({
        name: quoteForm.name,
        phone: quoteForm.phone,
        service: quoteForm.service,
        message: quoteForm.message,
        contactMode: quoteForm.contactMode,
      })

      setQuoteStatus('Quote request submitted successfully. We will contact you soon.')

      if (quoteForm.sendToWhatsApp) {
        const whatsAppMessage = `Hello GRK Aluminium Works,%0A%0AQuote Request:%0AName: ${encodeURIComponent(quoteForm.name)}%0APhone: ${encodeURIComponent(quoteForm.phone)}%0AService: ${encodeURIComponent(quoteForm.service || 'General Enquiry')}%0AContact Mode: ${encodeURIComponent(quoteForm.contactMode)}%0AMessage: ${encodeURIComponent(quoteForm.message || 'No additional message')}`
        window.open(`https://wa.me/${businessWhatsApp}?text=${whatsAppMessage}`, '_blank', 'noopener,noreferrer')
      }

      setQuoteForm({
        name: '',
        phone: '',
        service: '',
        message: '',
        contactMode: 'either',
        sendToWhatsApp: true,
      })
    } catch (error) {
      setQuoteError(error.response?.data?.message || 'Unable to submit quote request right now')
    } finally {
      setQuoteLoading(false)
    }
  }

  return (
    <>
      <Hero />

      <Services />
      <Materials />

      <section id="about" className="section about-section shell">
        <div className="section-header">
          <p className="eyebrow">About Us</p>
          <h2>Trusted Aluminium Specialists with Decades of Craftsmanship</h2>
        </div>
        <div className="about-grid">
          <article className="about-card">
            <h3>Founder Vision</h3>
            <p>
              Built on craftsmanship and integrity, GRK Aluminium Works was founded to
              deliver strong, elegant and long-lasting aluminium and ACP solutions.
              Our approach combines practical site knowledge with modern fabrication
              techniques to ensure every output is structurally reliable and visually refined.
            </p>
          </article>
          <article className="about-card">
            <h3>Capabilities & Scope</h3>
            <ul>
              <li>Architectural aluminium fabrication and installation</li>
              <li>ACP cladding, elevation systems, and facade detailing</li>
              <li>Office partitions, glass systems, and cabin solutions</li>
              <li>Door, window, and domal system customization</li>
            </ul>
          </article>
          <article className="about-card">
            <h3>Experience Highlights</h3>
            <ul>
              <li>20+ years of fabrication expertise</li>
              <li>Commercial and residential project delivery</li>
              <li>In-house design, production and installation</li>
              <li>End-to-end execution from survey to final handover</li>
            </ul>
          </article>
          <article className="about-card">
            <h3>Quality Promise</h3>
            <p>
              We focus on dimensional accuracy, quality hardware, corrosion-resistant finishes,
              and timely execution. Every project is delivered with attention to safety,
              detailing, and long-term durability.
            </p>
          </article>
        </div>
      </section>

      <section id="cta" className="section cta-section">
        <div className="shell cta-wrap">
          <h2>Need Aluminium Work?</h2>
          <p>Talk to our team for fast estimates and site-ready execution support.</p>
          <div className="cta-actions">
            <a href="tel:+919392012776" className="solid-btn">
              Call Now
            </a>
            <a
              href="https://wa.me/919392012776?text=Hello%20GRK%20Aluminium%20Works%2C%20I%20need%20a%20quote."
              target="_blank"
              rel="noreferrer"
              className="outline-btn light"
            >
              WhatsApp
            </a>
          </div>

          <p className="cta-contact-note">Contact: +91 9392012776, +91 9849170500</p>

          <form id="quote-form" className="quote-form" onSubmit={onQuoteSubmit}>
            <div className="quote-grid">
              <label>
                Name
                <input
                  type="text"
                  required
                  value={quoteForm.name}
                  onChange={(e) => onQuoteFieldChange('name', e.target.value)}
                  placeholder="Enter your name"
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  required
                  value={quoteForm.phone}
                  onChange={(e) => onQuoteFieldChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </label>

              <label>
                Service / Product
                <input
                  type="text"
                  value={quoteForm.service}
                  onChange={(e) => onQuoteFieldChange('service', e.target.value)}
                  placeholder="Ex: ACP Work, Aluminium Partitions"
                />
              </label>

              <label>
                Preferred Contact
                <select
                  value={quoteForm.contactMode}
                  onChange={(e) => onQuoteFieldChange('contactMode', e.target.value)}
                >
                  <option value="either">Call or WhatsApp</option>
                  <option value="call">Call</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </label>
            </div>

            <label>
              Message
              <textarea
                rows={4}
                value={quoteForm.message}
                onChange={(e) => onQuoteFieldChange('message', e.target.value)}
                placeholder="Enter dimensions, location, or requirement details"
              />
            </label>

            <label className="quote-check">
              <input
                type="checkbox"
                checked={quoteForm.sendToWhatsApp}
                onChange={(e) => onQuoteFieldChange('sendToWhatsApp', e.target.checked)}
              />
              Also send these details to WhatsApp after submit
            </label>

            {quoteError && <p className="error-message">{quoteError}</p>}
            {quoteStatus && <p className="info-message">{quoteStatus}</p>}

            <div className="quote-actions">
              <button type="submit" className="solid-btn" disabled={quoteLoading}>
                {quoteLoading ? 'Submitting...' : 'Submit Quote'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section id="products" className="section shell" aria-label="Services and products list">
        <div className="services-products-panel">
          <div className="services-products-grid">
            <article className="services-products-column">
              <h3>Our Services</h3>
              <ul>
                {servicePoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="services-products-column">
              <h3>Our Products</h3>
              <ul>
                {productPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
