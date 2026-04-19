import { useEffect, useMemo, useState } from 'react'
import { fetchProducts, toAbsoluteImageUrl } from '../services/api'
import MaterialCard from './MaterialCard'
import MaterialFilters from './MaterialFilters'
import './Materials.css'

const defaultCatalog = [
  {
    id: 'mat-aluminium-profiles',
    title: 'Aluminium Extrusion Profiles',
    filterCategory: 'Aluminium',
    image: '/materials/aluminium-profile1.jpeg',
    items: ['Heavy Extrusion Sections', 'L / T / U Profiles', 'Window Frame Channels', 'Partition Support Profiles'],
    description:
      'Precision aluminium extrusion profiles used for doors, windows, partitions, and fabrication frameworks with strong dimensional stability.',
  },
  {
    id: 'mat-aluminium-sheets',
    title: 'Industrial Aluminium Sheets',
    filterCategory: 'Aluminium',
    image: '/materials/aluminium-profile2.jpeg',
    items: ['Plain Aluminium Sheets', 'Fabrication Grade Plates', 'Cut-to-Size Panels'],
    description:
      'Flat aluminium sheets suitable for cladding, ducting, fabrication, and structural panel work with corrosion resistance and long life.',
  },
  {
    id: 'mat-acp-panels',
    title: 'ACP Color Panel Sheets',
    filterCategory: 'ACP',
    image: '/materials/acp-sheet.jpeg',
    items: ['Gloss ACP Panels', 'Matte ACP Panels', 'Exterior Grade ACP', 'Interior Decorative ACP'],
    description:
      'Multi-shade ACP sheets for elevation and interior cladding, offering weather protection, elegant finish, and lightweight installation.',
  },
  {
    id: 'mat-glass',
    title: 'Toughened Glass Sheets',
    filterCategory: 'Glass',
    image: '/materials/glass1.jpeg',
    items: ['Clear Toughened Glass', 'Partition Glass', 'Window Glazing Glass', 'Safety Processed Glass'],
    description:
      'Processed glass sheets for office partitions, windows, and shower areas with high strength, clarity, and safety performance.',
  },
  {
    id: 'mat-partitions',
    title: 'ACP Partition Board Panels',
    filterCategory: 'Partitions',
    image: '/materials/acp-sheet1.jpeg',
    items: ['Cabin Partition Panels', 'Office Divider ACP', 'Modular Partition Boards', 'Interior Wall Cladding Panels'],
    description:
      'Durable ACP board panels used in modular cabins and partitions, delivering neat joints, easy maintenance, and clean visual finish.',
  },
  {
    id: 'mat-door-window',
    title: 'Door and Window Frame Profiles',
    filterCategory: 'Aluminium',
    image: '/materials/aluminium-profile3.jpeg',
    items: ['Sliding Frame Sections', 'Casement Frame Profiles', 'Domal Window Profiles', 'Door Outer Frame Members'],
    description:
      'Architectural aluminium frame profiles for sliding and casement systems with high rigidity, smooth assembly, and premium finish.',
  },
  {
    id: 'mat-hardware',
    title: 'Hardware Fittings & Accessories',
    filterCategory: 'Hardware',
    image: '/materials/hardware.jpeg',
    items: ['Handles & Locks', 'Friction Hinges', 'Roller Sets', 'Connecting Accessories'],
    description:
      'Complete range of aluminium hardware including handles, hinges, rollers, and connectors for reliable daily operation.',
  },
  {
    id: 'mat-finishes',
    title: 'Sliding Roller Hardware',
    filterCategory: 'Hardware',
    image: '/materials/hardware2.jpeg',
    items: ['Bottom Roller Sets', 'Sliding Track Rollers', 'Heavy Shutter Rollers', 'Noise-Reduced Wheel Units'],
    description:
      'Precision roller components for smooth and silent movement in sliding windows and doors with long service life.',
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
  const [cardsPerView, setCardsPerView] = useState(4)
  const [carouselStart, setCarouselStart] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1)
        return
      }

      if (window.innerWidth <= 1024) {
        setCardsPerView(2)
        return
      }

      if (window.innerWidth <= 1200) {
        setCardsPerView(3)
        return
      }

      setCardsPerView(4)
    }

    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)

    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
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
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    const timer = window.setInterval(loadProducts, 10000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const filteredMaterials = materials.filter((material) => {
    const matchesFilter = activeFilter === 'All' || material.filterCategory === activeFilter
    const haystack = `${material.title} ${material.description} ${(material.items || []).join(' ')}`.toLowerCase()
    const matchesSearch = haystack.includes(searchText.trim().toLowerCase())

    return matchesFilter && matchesSearch
  })

  const visibleMaterials = useMemo(() => {
    if (filteredMaterials.length === 0) {
      return []
    }

    const count = Math.min(cardsPerView, filteredMaterials.length)

    return Array.from({ length: count }, (_, index) => {
      const itemIndex = (carouselStart + index) % filteredMaterials.length
      return filteredMaterials[itemIndex]
    })
  }, [filteredMaterials, cardsPerView, carouselStart])

  useEffect(() => {
    setCarouselStart(0)
  }, [activeFilter, searchText])

  useEffect(() => {
    if (filteredMaterials.length <= cardsPerView) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCarouselStart((prev) => (prev + 1) % filteredMaterials.length)
    }, 1400)

    return () => window.clearInterval(timer)
  }, [filteredMaterials, cardsPerView])

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

      {!loading && (
        <>
          <div className="catalog-grid moving-catalog" key={`${activeFilter}-${searchText}-${carouselStart}-${cardsPerView}`}>
            {visibleMaterials.map((material) => (
              <MaterialCard
                key={material.id || material.title}
                material={material}
                onViewDetails={setSelectedMaterial}
              />
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <p className="info-message">No materials found for your current search/filter.</p>
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
