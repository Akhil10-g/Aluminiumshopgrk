import { Link } from 'react-router-dom'
import { toAbsoluteImageUrl } from '../services/api'

function ProjectCard({ project }) {
  const coverImage = project.images?.[0]

  return (
    <article className="project-card">
      <img src={toAbsoluteImageUrl(coverImage)} alt={project.title} loading="lazy" />
      <div className="project-overlay">
        <p className="project-company">{project.company}</p>
        <p className="project-state">Completed Project</p>
        <Link to={`/projects/${project._id}`} className="solid-btn">
          View Details
        </Link>
      </div>
    </article>
  )
}

export default ProjectCard
