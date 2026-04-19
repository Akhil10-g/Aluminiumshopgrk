import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProjectById, toAbsoluteImageUrl } from '../services/api'

function ProjectDetails() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProject = async () => {
      try {
        const item = await fetchProjectById(id)
        setProject(item)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load project details')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id])

  if (loading) {
    return (
      <section className="section shell details-page">
        <p className="info-message">Loading project details...</p>
      </section>
    )
  }

  if (error || !project) {
    return (
      <section className="section shell details-page">
        <p className="error-message">{error || 'Project not found'}</p>
        <Link to="/" className="outline-btn">
          Back to Home
        </Link>
      </section>
    )
  }

  return (
    <section className="section shell details-page">
      <Link to="/" className="back-link">
        ← Back to Projects
      </Link>

      <div className="details-head">
        <h1>{project.title}</h1>
        <p className="details-company">{project.company}</p>
        {project.description ? <p className="details-description">{project.description}</p> : null}
      </div>

      <div className="details-gallery">
        {(project.images || []).map((image) => (
          <img key={image} src={toAbsoluteImageUrl(image)} alt={project.title} loading="lazy" />
        ))}
      </div>
    </section>
  )
}

export default ProjectDetails
