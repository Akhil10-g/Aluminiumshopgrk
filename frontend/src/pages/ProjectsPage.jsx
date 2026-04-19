import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjectsAdmin, toAbsoluteImageUrl } from '../services/api'
import './ProjectsPage.css'

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
        setError(err.response?.data?.message || 'Unable to load project gallery right now')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const galleryItems = useMemo(
    () =>
      projects.flatMap((project) =>
        (project.images || []).map((image, index) => ({
          id: `${project._id}-${index}`,
          projectId: project._id,
          projectTitle: project.title,
          projectCompany: project.company,
          projectDescription: project.description,
          image: toAbsoluteImageUrl(image),
          imageIndex: index + 1,
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
                <img src={item.image} alt={item.projectTitle} loading="lazy" />
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

                <img src={selectedItem.image} alt={selectedItem.projectTitle} className="projects-modal-image" />

                <div className="projects-modal-content">
                  <h3>{selectedItem.projectTitle}</h3>
                  <p className="projects-modal-company">{selectedItem.projectCompany}</p>
                  <p>{selectedItem.projectDescription || 'Project images uploaded from admin gallery.'}</p>
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
