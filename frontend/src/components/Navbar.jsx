import { useState } from 'react'
import { Link } from 'react-router-dom'

const serviceHoverItems = [
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

const productHoverItems = [
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

const menuItems = [
  { label: 'Home', id: 'home' },
  { label: 'Services', id: 'services', dropdown: 'services' },
  { label: 'Products', id: 'products', dropdown: 'products' },
  { label: 'Projects', id: 'projects', to: '/projects' },
  { label: 'About Us', id: 'about' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState('')

  const closeMenus = () => {
    setIsOpen(false)
    setActiveDropdown('')
  }

  return (
    <header className="navbar-wrap">
      <Link to="/admin/login" className="admin-corner-icon" aria-label="Admin Login" title="Admin Login">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M12 2l8 3v6c0 5-3.4 9.5-8 11-4.6-1.5-8-6-8-11V5l8-3zm0 2.1L6 6.3V11c0 4.1 2.6 8 6 9.3 3.4-1.3 6-5.2 6-9.3V6.3l-6-2.2zm0 3.4a3 3 0 013 3c0 1.3-.8 2.4-2 2.8V16h-2v-2.7a3 3 0 01-2-2.8 3 3 0 013-3z" />
        </svg>
      </Link>

      <div className="top-contact-bar">
        <div className="shell top-contact-inner">
          <p className="top-address">Medchal, Telangana 501401</p>
          <p className="top-phones">
            <a href="tel:+919392012776">+91 9392012776</a>
            <span>, </span>
            <a href="tel:+919849170500">+91 9849170500</a>
          </p>
        </div>
      </div>

      <nav className="navbar shell" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={closeMenus}>
          <img src="/images/logo/logo.png" alt="GRK Aluminium Works logo" className="brand-logo" />
          <span>GRK Aluminium Works</span>
        </Link>

        <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={item.dropdown ? 'nav-item-with-dropdown' : ''}
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.dropdown)}
                onMouseLeave={() => item.dropdown && setActiveDropdown('')}
              >
                {item.to ? (
                  <Link to={item.to} onClick={closeMenus}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={`/#${item.id}`} onClick={closeMenus}>
                    {item.label}
                  </a>
                )}

                {item.dropdown === 'services' && (
                  <div
                    className={`nav-hover-panel services-panel ${activeDropdown === 'services' ? 'show' : ''}`}
                  >
                    <h4>Our Services</h4>
                    <ul>
                      {serviceHoverItems.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.dropdown === 'products' && (
                  <div
                    className={`nav-hover-panel products-panel ${activeDropdown === 'products' ? 'show' : ''}`}
                  >
                    <h4>Our Products</h4>
                    <ul>
                      {productHoverItems.map((product) => (
                        <li key={product}>{product}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

        </div>

        <button
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  )
}

export default Navbar
