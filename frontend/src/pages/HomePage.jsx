import { useEffect, useMemo, useState } from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Materials from '../components/Materials'
import { createQuoteRequest, fetchServices, getApiErrorMessage } from '../services/api'

const coreStats = [
  { label: 'Years Experience', value: '35+' },
  { label: 'Projects Delivered', value: '750+' },
  { label: 'On-time Completion', value: '96%' },
  { label: 'Client Satisfaction', value: '4.9/5' },
]

const executionSteps = [
  {
    title: 'Site Survey',
    text: 'We inspect dimensions, usage needs, and structural conditions before planning.',
  },
  {
    title: 'Design & Quote',
    text: 'You receive practical design options and transparent cost estimates quickly.',
  },
  {
    title: 'Fabrication',
    text: 'In-house fabrication ensures precision fit, finish consistency, and durability.',
  },
  {
    title: 'Installation',
    text: 'Our team handles safe installation, clean handover, and post-install support.',
  },
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
  const [catalogTab, setCatalogTab] = useState('services')
  const [selectedCatalogItem, setSelectedCatalogItem] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [servicesData, setServicesData] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [servicesError, setServicesError] = useState('')

  const businessWhatsApp = '919392012776'

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % executionSteps.length)
    }, 2600)

    return () => window.clearInterval(timer)
  }, [])

  const activeCatalogItems = useMemo(
    () => (catalogTab === 'services' ? servicesData : productPoints),
    [catalogTab, servicesData],
  )

  const getCatalogItemLabel = (item) => (typeof item === 'string' ? item : item.title || '')

  useEffect(() => {
    const loadServices = async () => {
      setServicesError('')

      try {
        const items = await fetchServices()
        setServicesData(items)
      } catch (error) {
        setServicesData([])
        setServicesError(getApiErrorMessage(error, 'Unable to load services right now'))
      } finally {
        setServicesLoading(false)
      }
    }

    loadServices()
  }, [])

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
      setQuoteError(getApiErrorMessage(error, 'Unable to submit quote request right now'))
    } finally {
      setQuoteLoading(false)
    }
  }

  return (
    <>
      <Hero />

      <section className="section shell home-intro-section" aria-label="Company overview">
        <div className="home-intro-grid">
          <article className="home-intro-copy">
            <p className="eyebrow">Why GRK</p>
            <h2>Engineered Aluminium Work with a Clean, Modern Finish</h2>
            <p>
              We design and execute aluminium, ACP, glazing, and partition projects for
              residential and commercial spaces with strong materials, precise fitment,
              and dependable site coordination.
            </p>
            <div className="intro-actions">
              <a href="/#quote-form" className="solid-btn">
                Request Estimate
              </a>
              <a href="/projects" className="outline-btn">
                View Portfolio
              </a>
            </div>
          </article>

          <aside className="home-intro-panel" aria-label="Business highlights">
            <p className="intro-panel-title">Performance Snapshot</p>
            <div className="home-stats-grid">
              {coreStats.map((item) => (
                <article key={item.label} className="stat-tile">
                  <p className="stat-value">{item.value}</p>
                  <p className="stat-label">{item.label}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <div className="process-track" aria-label="Project execution process">
          {executionSteps.map((step, index) => (
            <article key={step.title} className={`process-step ${index === activeStep ? 'active' : ''}`}>
              <p className="process-index">0{index + 1}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <Services servicesData={servicesData} loading={servicesLoading} error={servicesError} />
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

          <div className="direct-contact-alert" role="alert" aria-live="polite">
            <p>For direct contact, use quick connect options:</p>
            <div className="direct-contact-links">
              <a href="tel:+919392012776" className="direct-contact-link call-link">
                <span className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img">
                    <path d="M6.62 10.79a15.46 15.46 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.2 11.2 0 003.53.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.2 11.2 0 00.56 3.53 1 1 0 01-.24 1.01l-2.2 2.25z" />
                  </svg>
                </span>
                Call +91 9392012776
              </a>

              <a
                href="https://wa.me/919392012776?text=Hello%20GRK%20Aluminium%20Works%2C%20I%20need%20direct%20contact."
                target="_blank"
                rel="noreferrer"
                className="direct-contact-link whatsapp-link"
              >
                <span className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img">
                    <path d="M20.52 3.48A11.86 11.86 0 0012.08 0C5.57 0 .28 5.29.28 11.8c0 2.08.54 4.11 1.58 5.9L0 24l6.5-1.7a11.74 11.74 0 005.58 1.42h.01c6.51 0 11.8-5.3 11.8-11.81 0-3.15-1.22-6.1-3.37-8.43zm-8.44 18.2h-.01a9.8 9.8 0 01-5-1.37l-.36-.21-3.86 1.01 1.03-3.76-.24-.39a9.75 9.75 0 01-1.49-5.16c0-5.39 4.39-9.78 9.79-9.78 2.61 0 5.06 1.02 6.9 2.87a9.72 9.72 0 012.86 6.91c0 5.39-4.39 9.78-9.78 9.78zm5.36-7.34c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.14-.18.28-.73.93-.89 1.11-.17.19-.33.21-.62.07-.29-.14-1.2-.44-2.28-1.42-.84-.74-1.41-1.66-1.58-1.95-.16-.29-.02-.45.12-.6.13-.13.29-.34.43-.5.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.64-1.55-.87-2.12-.23-.56-.46-.49-.64-.49h-.54c-.2 0-.52.08-.79.38-.27.3-1.04 1.02-1.04 2.49 0 1.48 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.7-.7 1.94-1.39.24-.68.24-1.27.17-1.39-.07-.12-.26-.2-.55-.34z" />
                  </svg>
                </span>
                WhatsApp Direct Contact
              </a>
            </div>
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
        <div className="services-products-panel cleaner-panel">
          <div className="services-products-head">
            <div>
              <p className="eyebrow">Complete Catalog</p>
              <h3>Services and Products</h3>
            </div>

            <div className="catalog-tabs" role="tablist" aria-label="Choose list type">
              <button
                type="button"
                role="tab"
                aria-selected={catalogTab === 'services'}
                className={catalogTab === 'services' ? 'active' : ''}
                onClick={() => {
                  setCatalogTab('services')
                  setSelectedCatalogItem('')
                }}
              >
                Services
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={catalogTab === 'products'}
                className={catalogTab === 'products' ? 'active' : ''}
                onClick={() => {
                  setCatalogTab('products')
                  setSelectedCatalogItem('')
                }}
              >
                Products
              </button>
            </div>
          </div>

          <p className="catalog-selection-note" aria-live="polite">
            {selectedCatalogItem
              ? `Selected: ${selectedCatalogItem}`
              : 'Click any item in the complete catalog to highlight it.'}
          </p>

          {catalogTab === 'services' && servicesLoading && (
            <p className="info-message">Loading service catalog...</p>
          )}
          {catalogTab === 'services' && servicesError && !servicesLoading && (
            <p className="error-message">{servicesError}</p>
          )}

          <div className="catalog-pill-grid" role="tabpanel" aria-live="polite">
            {activeCatalogItems.map((item) => {
              const itemLabel = getCatalogItemLabel(item)

              return (
                <button
                  key={typeof item === 'string' ? item : item._id || item.title}
                  type="button"
                  className={`catalog-pill-item ${selectedCatalogItem === itemLabel ? 'active' : ''}`}
                  onClick={() => setSelectedCatalogItem(itemLabel)}
                  aria-pressed={selectedCatalogItem === itemLabel}
                >
                  {itemLabel}
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
