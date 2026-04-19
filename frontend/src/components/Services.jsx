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

const buildDescription = (title) =>
  `${title} solutions crafted with durable materials, precision fitment, and clean modern finishing for long-term performance.`

const staticServiceList = [
  {
    title: 'ACP Work',
    images: ['/images/services/acp-sheet.jpeg'],
    description:
      'High-quality ACP cladding solutions for modern building exteriors. Weather-resistant, durable, and stylish finishes.',
  },
  {
    title: 'Elevation',
    images: ['/images/services/acp-elevation-building.jpeg'],
    description:
      'Modern elevation designs using aluminium and ACP panels to enhance building appearance and durability.',
  },
  {
    title: 'Aluminium Doors',
    images: ['/images/services/aluminium-door-sliding.jpeg'],
    description:
      'Strong and stylish aluminium doors with smooth sliding and long-lasting performance.',
  },
  {
    title: 'Aluminium Partitions',
    images: ['/images/services/aluminium-patition.jpeg'],
    description:
      'Custom aluminium partitions for offices and homes, offering durability and a clean modern look.',
  },
  {
    title: 'Aluminium Windows',
    images: ['/images/services/aluminium-window-frame.jpeg'],
    description:
      'Premium aluminium windows with excellent ventilation, strength, and long lifespan.',
  },
  {
    title: 'Domal Windows',
    images: ['/images/services/domal-window-sliding.jpeg'],
    description:
      'High-quality domal aluminium windows with superior finish, corrosion resistance, and smooth operation.',
  },
]

function Services({ servicesData = [] }) {
  const dynamicServiceList = (servicesData || []).map((item) => ({
    title: item.title,
    images:
      Array.isArray(item.images) && item.images.length > 0
        ? item.images.map((img) => toAbsoluteImageUrl(img))
        : item.image
          ? [toAbsoluteImageUrl(item.image)]
          : [],
    description: item.description || buildDescription(item.title),
  }))

  const serviceList = dynamicServiceList.length > 0 ? dynamicServiceList : staticServiceList

  return (
    <section id="services" className="section services-section shell">
      <div className="section-header">
        <p className="eyebrow">Our Expertise</p>
        <h2>Services Built for Quality and Durability</h2>
      </div>

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
              <p>{service.description}</p>

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

    </section>
  )
}

export default Services
