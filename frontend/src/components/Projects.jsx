import { useEffect, useState } from 'react'
import { fetchProjects, getApiErrorMessage } from '../services/api'
import ProjectCard from './ProjectCard'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const items = await fetchProjects()
        setProjects(items)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load projects right now'))
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <section id="projects" className="section projects-section shell">
      <div className="section-header">
        <p className="eyebrow">Recent Work</p>
        <h2>Project Portfolio</h2>
      </div>

      {loading && <p className="info-message">Loading projects...</p>}
      {error && !loading && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Projects
