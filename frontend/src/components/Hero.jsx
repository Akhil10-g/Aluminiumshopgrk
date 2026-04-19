import { useEffect, useMemo, useState } from 'react'

const slides = [
  {
    key: 'founder',
    type: 'founder',
    background: '/images/founder/founder.jpg',
    logo: '/images/logo/logo.png',
    title: 'GRK Aluminium Works',
    subtitle: 'Trusted Aluminium & ACP Team',
    description: 'Trusted Aluminium & ACP Solutions',
    cta: 'Get Quote',
  },
  {
    key: 'work',
    type: 'work',
    backgrounds: [
      '/images/services/aluminium-window-frame.jpeg',
      '/images/services/acp-sheet.jpeg',
      '/images/services/aluminium-partition-cabin.jpeg',
    ],
    title: 'Our Work Speaks Quality',
    subtitle: 'Premium Aluminium, ACP & Partition Solutions',
    description: 'Precision-crafted finishes that balance durability, style, and performance.',
  },
  {
    key: 'projects',
    type: 'projects',
    background: '/images/services/aluminium-partition-cabin.jpeg',
    logo: '/images/logo/logo.png',
    title: 'Explore Our Projects',
    subtitle: 'Residential & Commercial Installations',
    description: 'Browse completed aluminium, ACP, glazing, and partition projects delivered across locations.',
  },
  {
    key: 'contact',
    type: 'contact',
    background: '/images/services/aluminium-window.jpeg',
    logo: '/images/logo/logo.png',
    title: 'Get in Touch Today',
    subtitle: 'Phone: +91 9392012776, +91 9849170500',
    description: 'Fast consultation for aluminium, ACP, glazing, partitions, and installation work.',
  },
]

function Hero() {
  const [active, setActive] = useState(1)
  const [workImage, setWorkImage] = useState(0)

  const currentSlide = slides[active]
  const workImages = useMemo(() => {
    const workSlide = slides.find((slide) => slide.type === 'work')
    return workSlide?.backgrounds ?? []
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (currentSlide.type !== 'work' || workImages.length === 0) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setWorkImage((prev) => (prev + 1) % workImages.length)
    }, 4800)

    return () => window.clearInterval(timer)
  }, [currentSlide.type, workImages.length])

  const goPrev = () => setActive((prev) => (prev - 1 + slides.length) % slides.length)
  const goNext = () => setActive((prev) => (prev + 1) % slides.length)

  return (
    <section id="home" className="hero-section hero-modern">
      <div className="hero-slider-modern">
        {slides.map((slide, index) => {
          const isActive = index === active

          return (
            <article key={slide.key} className={`hero-slide-modern ${isActive ? 'active' : ''}`}>
              <div className="hero-slide-shell shell">
                <div className="hero-copy">
                  {slide.type === 'work' ? (
                    <>
                      <p className="hero-kicker">PREMIUM ALUMINIUM, ACP & PARTITION SOLUTIONS</p>
                      <h1>
                        <span>Our Work</span>
                        <span>Speaks Quality</span>
                      </h1>
                    </>
                  ) : (
                    <>
                      <p className="hero-kicker">{slide.subtitle}</p>
                      <h1>{slide.title}</h1>
                    </>
                  )}
                  <p className="hero-description">{slide.description}</p>

                  {slide.type === 'work' && (
                    <div className="hero-actions">
                      <a href="/#quote-form" className="hero-cta hero-main-btn">
                        Get Quote
                      </a>
                      <a href="/projects" className="outline-btn hero-secondary">
                        View Projects
                      </a>
                    </div>
                  )}

                  {slide.type === 'founder' && (
                    <a href="/#quote-form" className="hero-cta hero-main-btn">
                      {slide.cta}
                    </a>
                  )}

                  {slide.type === 'contact' && (
                    <div className="hero-actions">
                      <a href="tel:+919392012776" className="hero-cta">
                        Call Now
                      </a>
                      <a
                        href="https://wa.me/919392012776?text=Hello%20GRK%20Aluminium%20Works%2C%20I%20need%20a%20quote."
                        target="_blank"
                        rel="noreferrer"
                        className="outline-btn hero-secondary"
                      >
                        WhatsApp
                      </a>
                    </div>
                  )}

                  {slide.type === 'projects' && (
                    <div className="hero-actions">
                      <a href="/projects" className="hero-cta">
                        View Projects
                      </a>
                      <a href="/#quote-form" className="outline-btn hero-secondary">
                        Get Estimate
                      </a>
                    </div>
                  )}
                </div>

                <div className="hero-visual">
                  {slide.type === 'founder' && (
                    <div className="hero-foundation-card">
                      <img src={slide.background} alt="Founder of GRK Aluminium Works" />
                    </div>
                  )}

                  {slide.type === 'work' && (
                    <div className="hero-sample-stack">
                      {workImages.map((image, workIndex) => (
                        <div
                          key={image}
                          className={`hero-sample-card ${workIndex === workImage ? 'active' : ''}`}
                        >
                          <img src={image} alt={`Sample work ${workIndex + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}

                  {slide.type === 'contact' && (
                    <div className="hero-contact-card">
                      <img src={slide.background} alt="Industrial aluminium work" />
                      <img src={slide.logo} alt="GRK Aluminium Works logo" className="hero-watermark-center" />
                    </div>
                  )}

                  {slide.type === 'projects' && (
                    <div className="hero-contact-card">
                      <img src={slide.background} alt="Featured aluminium project" />
                      <img src={slide.logo} alt="GRK Aluminium Works logo" className="hero-watermark-center" />
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <button type="button" className="hero-arrow hero-arrow-left" onClick={goPrev} aria-label="Previous slide">
        ‹
      </button>
      <button type="button" className="hero-arrow hero-arrow-right" onClick={goNext} aria-label="Next slide">
        ›
      </button>

      <div className="hero-dots modern-dots" aria-label="Slider pagination">
        {slides.map((slide, index) => (
          <button
            key={slide.key}
            className={index === active ? 'active' : ''}
            onClick={() => setActive(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
