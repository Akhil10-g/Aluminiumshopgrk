import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjectsAdmin, getApiErrorMessage } from '../services/api'
import './ProjectsPage.css'

// Import project images
import project1 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.30.jpeg'
import project2 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.32.jpeg'
import project3 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.37 (1).jpeg'
import project4 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.37.jpeg'
import project5 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.38 (1).jpeg'
import project6 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.38 (2).jpeg'
import project7 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.38.jpeg'
import project8 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.39 (1).jpeg'
import project9 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.39 (2).jpeg'
import project10 from '../assets/PROJECTIMAGES/WhatsApp Image 2026-04-17 at 09.43.39.jpeg'

// Project images array for fallback/cycling
const projectImages = [
  project1, project2, project3, project4, project5,
  project6, project7, project8, project9, project10,
]

function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const items = await fetchProjectsAdmin()
        setProjects(items)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load project gallery right now'))
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const galleryItems = useMemo(
    () =>
      projects.flatMap((project, projectIndex) =>
        (project.images || []).map((_, imageIndex) => ({
          id: `${project._id}-${imageIndex}`,
          projectId: project._id,
          projectTitle: project.title,
          projectCompany: project.company,
          projectDescription: project.description,
          image: projectImages[imageIndex % projectImages.length],
          imageIndex: imageIndex + 1,
          imageCount: (project.images || []).length,
        }))
      ),
    [projects]
  )

  return (
    <section className="section shell projects-gallery-page">
      <div className="projects-gallery-head">
        <p className="projects-breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <strong>Our Work</strong>
        </p>
        <h1>Our Work</h1>
        <p>Explore recent aluminium, ACP, partition, and glazing execution snapshots.</p>
      </div>

      {loading && <p className="info-message">Loading project gallery...</p>}
      {error && !loading && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <div className="projects-gallery-grid">
            {galleryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="projects-gallery-tile"
                onClick={() => setSelectedItem(item)}
                aria-label={`Open ${item.projectTitle}`}
                title={item.projectTitle}
              >
                <img 
                  src={item.image} 
                  alt={item.projectTitle} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = projectImages[0]
                    e.target.alt = item.projectTitle
                  }}
                />
              </button>
            ))}
          </div>

          {galleryItems.length === 0 && (
            <p className="info-message">No project images uploaded yet.</p>
          )}

          {selectedItem && (
            <div className="projects-modal-backdrop" onClick={() => setSelectedItem(null)} role="presentation">
              <article
                className="projects-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Project details"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="projects-modal-close"
                  onClick={() => setSelectedItem(null)}
                  aria-label="Close"
                >
                  ×
                </button>

                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.projectTitle} 
                  className="projects-modal-image"
                  onError={(e) => {
                    e.target.src = projectImages[0]
                    e.target.alt = selectedItem.projectTitle
                  }}
                />

                <div className="projects-modal-content">
                  <h3>{selectedItem.projectTitle}</h3>
                  <p className="projects-modal-company">{selectedItem.projectCompany}</p>
                  {selectedItem.projectDescription ? <p>{selectedItem.projectDescription}</p> : null}
                  <p className="projects-modal-count">
                    Image {selectedItem.imageIndex} of {selectedItem.imageCount}
                  </p>

                  <div className="projects-modal-actions">
                    <Link to={`/projects/${selectedItem.projectId}`} className="solid-btn">
                      Open Full Project
                    </Link>
                    <button type="button" className="outline-btn" onClick={() => setSelectedItem(null)}>
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

export default ProjectsPage
