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
  partition,
  glass: glassPartition,
  window: windowImg,
  domal: domalWindow,
  door: aluminiumDoor,
  mesh: meshDoors,
  ceiling: fallCeiling,
  default: acpElevation,
}

// ✅ Image Logic
const getServiceImage = (service) => {
  if (service?.image) return service.image

  const text = `${service?.title || ''} ${service?.description || ''}`.toLowerCase()

  if (text.includes('acp')) return imageMapping.acp
  if (text.includes('glass')) return imageMapping.glass
  if (text.includes('partition')) return imageMapping.partition
  if (text.includes('domal')) return imageMapping.domal
  if (text.includes('window')) return imageMapping.window
  if (text.includes('door')) return imageMapping.door
  if (text.includes('mesh')) return imageMapping.mesh
  if (text.includes('ceiling')) return imageMapping.ceiling

  return imageMapping.default
}

// ✅ Category
const getServiceCategory = (service) => {
  const text = `${service?.title || ''} ${service?.description || ''}`.toLowerCase()

  if (text.includes('glass')) return 'GLASS'
  if (text.includes('acp')) return 'ACP'

  return 'ALUMINIUM'
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

export default function Services() {
  const [servicesData, setServicesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ✅ FETCH DATA (SAFE VERSION)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      .then(res => res.json())
      .then(data => {
        console.log("API RESPONSE:", data)

        let safeArray = []

        if (Array.isArray(data)) {
          safeArray = data
        } else if (Array.isArray(data.services)) {
          safeArray = data.services
        } else if (Array.isArray(data.data)) {
          safeArray = data.data
        } else {
          safeArray = []
        }

        setServicesData(safeArray)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError("Failed to load services")
        setLoading(false)
      })
  }, [])

  // ✅ SAFE MAPPING (NO CRASH)
  const serviceList = Array.isArray(servicesData)
    ? servicesData.map((item, index) => ({
        title: item.title || `Service ${index + 1}`,
        category: getServiceCategory(item),
        image: getServiceImage(item),
        description: item.description || '',
      }))
    : []

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
          <p className="info-message">No services available.</p>
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
                <p>{service.description}</p>

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