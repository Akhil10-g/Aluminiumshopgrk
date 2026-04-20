import { useEffect, useState } from 'react'
import { fetchProducts, getApiErrorMessage, toAbsoluteImageUrl } from '../services/api'
import MaterialCard from './MaterialCard'
import MaterialFilters from './MaterialFilters'
import './Materials.css'
import acpSheet from '../assets/materials/acp-sheet.jpeg'
import acpSheetOne from '../assets/materials/acp-sheet1.jpeg'
import aluminiumProfileOne from '../assets/materials/aluminium-profile1.jpeg'
import aluminiumProfileTwo from '../assets/materials/aluminium-profile2.jpeg'
import aluminiumProfileThree from '../assets/materials/aluminium-profile3.jpeg'
import glassOne from '../assets/materials/glass1.jpeg'
import hardwareImage from '../assets/materials/hardware.jpeg'
import hardwareImageTwo from '../assets/materials/hardware2.jpeg'

const defaultCatalog = [
  {
    id: 'mat-aluminium-profiles',
    title: 'Aluminium Extrusion Profiles',
    filterCategory: 'Aluminium',
    image: aluminiumProfileOne,
    items: ['Heavy Extrusion Sections', 'L / T / U Profiles', 'Window Frame Channels', 'Partition Support Profiles'],
    description:
      'Precision aluminium extrusion profiles used for doors, windows, partitions, and fabrication frameworks with strong dimensional stability.',
  },
  {
    id: 'mat-aluminium-sheets',
    title: 'Industrial Aluminium Sheets',
    filterCategory: 'Aluminium',
    image: aluminiumProfileTwo,
    items: ['Plain Aluminium Sheets', 'Fabrication Grade Plates', 'Cut-to-Size Panels'],
    description:
      'Flat aluminium sheets suitable for cladding, ducting, fabrication, and structural panel work with corrosion resistance and long life.',
  },
  {
    id: 'mat-acp-panels',
    title: 'ACP Color Panel Sheets',
    filterCategory: 'ACP',
    image: acpSheet,
    items: ['Gloss ACP Panels', 'Matte ACP Panels', 'Exterior Grade ACP', 'Interior Decorative ACP'],
    description:
      'Multi-shade ACP sheets for elevation and interior cladding, offering weather protection, elegant finish, and lightweight installation.',
  },
  {
    id: 'mat-premium-acp',
    title: 'Premium ACP Sheets',
    filterCategory: 'ACP',
    image: acpSheetOne,
    items: ['4mm Premium ACP', 'Exterior UV-Coated ACP', 'Wood Finish ACP', 'Marble Finish ACP'],
    description:
      'Premium ACP materials used for facade elevation and modern interiors, offering rich finish quality, long durability, and low maintenance.',
  },
  {
    id: 'mat-glass',
    title: 'Toughened Glass Sheets',
    filterCategory: 'Glass',
    image: glassOne,
    items: ['Clear Toughened Glass', 'Partition Glass', 'Window Glazing Glass', 'Safety Processed Glass'],
    description:
      'Processed glass sheets for office partitions, windows, and shower areas with high strength, clarity, and safety performance.',
  },
  {
    id: 'mat-partitions',
    title: 'ACP Partition Board Panels',
    filterCategory: 'Partitions',
    image: acpSheetOne,
    items: ['Cabin Partition Panels', 'Office Divider ACP', 'Modular Partition Boards', 'Interior Wall Cladding Panels'],
    description:
      'Durable ACP board panels used in modular cabins and partitions, delivering neat joints, easy maintenance, and clean visual finish.',
  },
  {
    id: 'mat-door-window',
    title: 'Door and Window Frame Profiles',
    filterCategory: 'Aluminium',
    image: aluminiumProfileThree,
    items: ['Sliding Frame Sections', 'Casement Frame Profiles', 'Domal Window Profiles', 'Door Outer Frame Members'],
    description:
      'Architectural aluminium frame profiles for sliding and casement systems with high rigidity, smooth assembly, and premium finish.',
  },
  {
    id: 'mat-hardware',
    title: 'Hardware Fittings & Accessories',
    filterCategory: 'Hardware',
    image: hardwareImage,
    items: ['Handles & Locks', 'Friction Hinges', 'Roller Sets', 'Connecting Accessories'],
    description:
      'Complete range of aluminium hardware including handles, hinges, rollers, and connectors for reliable daily operation.',
  },
  {
    id: 'mat-finishes',
    title: 'Sliding Roller Hardware',
    filterCategory: 'Hardware',
    image: hardwareImageTwo,
    items: ['Bottom Roller Sets', 'Sliding Track Rollers', 'Heavy Shutter Rollers', 'Noise-Reduced Wheel Units'],
    description:
      'Precision roller components for smooth and silent movement in sliding windows and doors with long service life.',
  },
  {
    id: 'mat-domal-windows',
    title: 'Domal Windows System',
    filterCategory: 'Aluminium',
    image: aluminiumProfileThree,
    items: ['Domal Window Sections', 'Top-Hung Opening System', 'Weather Seals', 'Spring Hinges'],
    description:
      'Premium domal window systems offering excellent ventilation, aesthetic appeal, and weather protection with smooth operation.',
  },
  {
    id: 'mat-mesh-screen',
    title: 'Aluminium Mesh & Screen Materials',
    filterCategory: 'Aluminium',
    image: aluminiumProfileTwo,
    items: ['Security Mesh', 'Insect Screen Mesh', 'Powder Coated Mesh', 'Stainless Steel Mesh'],
    description:
      'High-quality mesh and screen materials for doors, windows, and ventilation with excellent durability and visibility.',
  },
  {
    id: 'mat-fall-ceiling',
    title: 'Fall Ceiling & Suspension Systems',
    filterCategory: 'Aluminium',
    image: aluminiumProfileOne,
    items: ['T-Grid Sections', 'Main & Cross Runners', 'Suspension Hangers', 'Grid Channels'],
    description:
      'Modular fall ceiling suspension systems for offices, shops, and residential spaces with clean finish and easy installation.',
  },
  {
    id: 'mat-glass-partition',
    title: 'Glass Partition Frameless System',
    filterCategory: 'Glass',
    image: glassOne,
    items: ['Frameless Glass Panels', 'Pivot Hinges', 'Glass Clamps', 'Sealing Gaskets'],
    description:
      'Modern frameless glass partition systems for office spaces offering transparency, sound insulation, and professional aesthetics.',
  },
  {
    id: 'mat-sliding-window',
    title: 'Sliding Window & Door Frames',
    filterCategory: 'Aluminium',
    image: aluminiumProfileThree,
    items: ['Sliding Frame Tracks', 'Roller Bearings', 'Frame Seals', 'Locking Mechanisms'],
    description:
      'Complete sliding window and door frame systems with smooth operation, weather protection, and modern design.',
  },
  {
    id: 'mat-glass-speciality',
    title: 'Specialty Glass Products',
    filterCategory: 'Glass',
    image: glassOne,
    items: ['Tempered Glass Sheets', 'Laminated Glass', 'Mirror Glass', 'Colored Glass Panels'],
    description:
      'Specialized glass products for various applications including shower enclosures, mirrors, and decorative installations.',
  },
]

const normalizeFilterCategory = (value) => {
  const raw = (value || '').toLowerCase()

  if (raw.includes('acp')) return 'ACP'
  if (raw.includes('glass')) return 'Glass'
  if (raw.includes('partition')) return 'Partitions'
  if (
    raw.includes('handle') ||
    raw.includes('lock') ||
    raw.includes('hinge') ||
    raw.includes('roller') ||
    raw.includes('track') ||
    raw.includes('hardware')
  ) {
    return 'Hardware'
  }

  return 'Aluminium'
}

const categoryDescriptions = {
  Aluminium: 'Premium aluminium systems designed for long-term strength, smooth functionality, and weather resistance.',
  ACP: 'Premium ACP panels for modern elevation and interior designs. Weather-resistant and available in multiple finishes.',
  Glass: 'High-strength glass materials used for partitions, windows, and shower enclosures. Safe, durable, and aesthetically appealing.',
  Partitions: 'Modern partition systems for offices and homes, offering flexibility, privacy, and stylish design.',
  Hardware: 'Essential hardware components ensuring smooth functionality and long-lasting performance.',
}

const mapBackendProduct = (product) => {
  const filterCategory = normalizeFilterCategory(`${product.category || ''} ${product.name || ''}`)

  return {
    id: product._id || product.name,
    title: product.name,
    filterCategory,
    image: toAbsoluteImageUrl(product.image),
    items: [product.category || filterCategory],
    price: product.price,
    description: product.description || categoryDescriptions[filterCategory],
  }
}

function Materials() {
  const [materials, setMaterials] = useState(defaultCatalog)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchText, setSearchText] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Compute filtered materials early
  const filteredMaterials = materials.filter((material) => {
    const matchesFilter = activeFilter === 'All' || material.filterCategory === activeFilter
    const haystack = `${material.title} ${material.description} ${(material.items || []).join(' ')}`.toLowerCase()
    const matchesSearch = haystack.includes(searchText.trim().toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Load backend products
  useEffect(() => {
    const loadProducts = async () => {
      setError('')
      try {
        const items = await fetchProducts()
        const mappedProducts = items.map(mapBackendProduct)

        if (mappedProducts.length === 0) {
          setMaterials(defaultCatalog)
          return
        }

        const merged = [...defaultCatalog]
        mappedProducts.forEach((product) => {
          const exists = merged.some(
            (entry) => entry.title.toLowerCase() === String(product.title).toLowerCase()
          )
          if (!exists) {
            merged.push(product)
          }
        })
        setMaterials(merged)
      } catch (err) {
        setMaterials(defaultCatalog)
        setError(getApiErrorMessage(err, 'Unable to refresh materials from server right now'))
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Auto-advance slides - safely access filteredMaterials
  useEffect(() => {
    const materialsLength = filteredMaterials.length
    if (materialsLength === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % materialsLength)
    }, 1100)

    return () => clearInterval(interval)
  }, [filteredMaterials.length])

  // Reset slide when filter/search changes
  useEffect(() => {
    setCurrentSlide(0)
  }, [activeFilter, searchText])

  // Calculate visible materials
  const visibleSlideCount = Math.min(filteredMaterials.length, 3)
  const visibleMaterials = Array.from({ length: visibleSlideCount }, (_, offset) => {
    const index = (currentSlide + offset) % (filteredMaterials.length || 1)
    return filteredMaterials[index]
  })

  return (
    <section id="materials" className="section materials-section shell material-catalog">
      <div className="section-header">
        <p className="eyebrow">Material Catalog</p>
        <h2>Global Aluminium, ACP, Glass & Structural Materials</h2>
      </div>

      <MaterialFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {loading && <p className="info-message">Loading materials...</p>}
      {!loading && error && <p className="error-message">{error}</p>}

      {!loading && (
        <>
          {filteredMaterials.length === 0 ? (
            <p className="info-message">No materials found for your current search/filter.</p>
          ) : (
            <div className="materials-carousel-wrapper">
              <div className="catalog-carousel" key={`${activeFilter}-${searchText}`}>
                {visibleMaterials.map((material, index) => (
                  <div
                    key={`${material.id || material.title}-${index}`}
                    className="catalog-carousel-item"
                  >
                    <MaterialCard
                      material={material}
                      onViewDetails={setSelectedMaterial}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMaterial && (
            <div className="catalog-modal-backdrop" role="presentation" onClick={() => setSelectedMaterial(null)}>
              <article
                className="catalog-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Material details"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="catalog-modal-close"
                  onClick={() => setSelectedMaterial(null)}
                  aria-label="Close"
                >
                  ×
                </button>

                <img src={selectedMaterial.image} alt={selectedMaterial.title} />

                <div className="catalog-modal-content">
                  <span className="catalog-tag">{selectedMaterial.filterCategory}</span>
                  <h3>{selectedMaterial.title}</h3>
                  <p>{selectedMaterial.description}</p>

                  <ul>
                    {(selectedMaterial.items || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  {selectedMaterial.price !== undefined && (
                    <p className="modal-price">
                      Approx. Price: ₹{Number(selectedMaterial.price || 0).toLocaleString('en-IN')}
                    </p>
                  )}

                  <div className="catalog-actions modal-actions">
                    <button
                      type="button"
                      className="catalog-btn outline"
                      onClick={() => setSelectedMaterial(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </article>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Materials
