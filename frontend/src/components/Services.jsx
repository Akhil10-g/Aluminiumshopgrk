import { useEffect, useState } from "react"
import './Services.css'
import acpElevation from '../assets/services/acp-elevation-building.jpeg'
import partition from '../assets/services/aluminium-patition.jpeg'
import glassPartition from '../assets/services/glass-partition-office.jpeg'
import aluminiumDoor from '../assets/services/aluminium-door-sliding.jpeg'
import domalWindow from '../assets/services/domal-window-sliding.jpeg'
import fallCeiling from '../assets/services/aluminium-fall-ceiling.jpeg'
import meshDoors from '../assets/services/aluminium-mesh-doors.jpeg'
import windowImg from '../assets/services/aluminium-window.jpeg'

// ✅ Image Mapping
const imageMapping = {
  acp: acpElevation,
  partition: partition,
  glass: glassPartition,
  window: windowImg,
  domal: domalWindow,
  door: aluminiumDoor,
  mesh: meshDoors,
  ceiling: fallCeiling,
  default: acpElevation,
}

// ✅ Image Logic (UPDATED: supports backend images)
const getServiceImage = (service) => {
  // 🔥 1. Use backend image if available
  if (service?.image) {
    return service.image
  }

  const source = `${service?.title || ''} ${service?.description || ''}`.toLowerCase()

  if (source.includes('acp')) return imageMapping.acp
  if (source.includes('glass')) return imageMapping.glass
  if (source.includes('partition')) return imageMapping.partition
  if (source.includes('domal')) return imageMapping.domal
  if (source.includes('window')) return imageMapping.window
  if (source.includes('door')) return imageMapping.door
  if (source.includes('mesh')) return imageMapping.mesh
  if (source.includes('ceiling')) return imageMapping.ceiling

  return imageMapping.default
}

// ✅ Highlights
const workHighlights = [
  'All Kind of Aluminium Works',
  'Domal Windows',
  'Aluminium Partitions',
  'Glass Partitions',
  'Fall Ceiling Work',
  'Mesh Work',
]

// ✅ Category
const getServiceCategory = (service) => {
  const source = `${service?.title || ''} ${service?.description || ''}`.toLowerCase()

  if (source.includes('glass')) return 'GLASS'
  if (source.includes('acp')) return 'ACP'

  return 'ALUMINIUM'
}

export default function Services() {
  const [servicesData, setServicesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      .then(res => res.json())
      .then(data => {
        setServicesData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError("Failed to load services")
        setLoading(false)
      })
  }, [])

  const serviceList = (servicesData || []).map((item, index) => ({
    title: item.title || `Service ${index + 1}`,
    category: getServiceCategory(item),
    image: getServiceImage(item),
    description: item.description || '',
  }))

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
          <p className="info-message">
            No services have been added by admin yet.
          </p>
        </>
      ) : (
        <div className="services-v2-grid">
          {serviceList.map((service, index) => (
            <article key={index} className="service-v2-card">
              <img
                src={service.image || imageMapping.default}
                alt={service.title}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = imageMapping.default
                }}
              />

              <div className="service-v2-content">
                <span className="service-v2-badge">{service.category}</span>
                <h3>{service.title}</h3>
                <p>
                  {service.description || 'Service details added by admin.'}
                </p>

                <div className="service-v2-hover-info">
                  <h4>Also Available</h4>
                  <ul>
                    {workHighlights.map((work, i) => (
                      <li key={i}>{work}</li>
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