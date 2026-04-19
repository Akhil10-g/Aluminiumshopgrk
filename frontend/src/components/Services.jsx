import './Services.css'
import { toAbsoluteImageUrl } from '../services/api'

const workHighlights = [
  'All Kind of Aluminium Works',
  'Domal Windows',
  'Aluminium Partitions',
  'Glass Partitions',
  'Fall Ceiling Work',
  'Mesh Work',
]

function Services({ servicesData = [], loading = false, error = '' }) {
  const dynamicServiceList = (servicesData || []).map((item, index) => ({
    title: item.title || `Service ${index + 1}`,
    images:
      Array.isArray(item.images) && item.images.length > 0
        ? item.images.map((img) => toAbsoluteImageUrl(img))
        : item.image
          ? [toAbsoluteImageUrl(item.image)]
          : [],
    description: item.description || '',
  }))

  const serviceList = dynamicServiceList

  return (
    <section id="services" className="section services-section shell">
      <div className="section-header">
        <p className="eyebrow">Our Expertise</p>
        <h2>Services Built for Quality and Durability</h2>
      </div>

      {loading ? (
        <p className="info-message">Loading services...</p>
      ) : serviceList.length === 0 ? (
        <>
          {error && <p className="error-message">{error}</p>}
        <p className="info-message">No services have been added by admin yet.</p>
        </>
      ) : (
        <div className="services-v2-grid">
          {serviceList.map((service) => (
            <article key={service.title} className="service-v2-card">
              <img
                src={service.images[0] || ''}
                alt={service.title}
                loading="lazy"
                className={service.images[0] ? '' : 'empty-image'}
              />
              <div className="service-v2-content">
                <h3>{service.title}</h3>
                <p>{service.description || 'Service details added by admin.'}</p>

                {service.images.length > 1 && (
                  <div className="service-v2-thumbs">
                    {service.images.slice(0, 6).map((image, index) => (
                      <img key={`${service.title}-${index}`} src={image} alt={`${service.title} ${index + 1}`} />
                    ))}
                  </div>
                )}

                <div className="service-v2-hover-info" aria-hidden="true">
                  <h4>Also Available</h4>
                  <ul>
                    {workHighlights.map((work) => (
                      <li key={`${service.title}-${work}`}>{work}</li>
                    ))}
                  </ul>
                </div>

                <a href="/#quote-form" className="service-v2-btn">
                  Get Quote
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

    </section>
  )
}

export default Services
