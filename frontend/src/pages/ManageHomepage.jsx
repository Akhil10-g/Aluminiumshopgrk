import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createProject,
  deleteQuoteRequest,
  deleteProject,
  fetchProjectsAdmin,
  fetchQuoteRequestsAdmin,
  markQuoteAsOpened,
  toAbsoluteImageUrl,
} from '../services/api'

function ManageHomepage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [projects, setProjects] = useState([])
  const [quotes, setQuotes] = useState([])
  const [quoteActionId, setQuoteActionId] = useState('')
  const [projectForm, setProjectForm] = useState({
    title: '',
    company: '',
    description: '',
    images: [],
  })

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }

    const loadProjects = async () => {
      try {
        const [projectItems, quoteItems] = await Promise.all([
          fetchProjectsAdmin(),
          fetchQuoteRequestsAdmin(token),
        ])
        setProjects(projectItems)
        setQuotes(quoteItems)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load projects')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [navigate, token])

  const refreshQuotes = async () => {
    const quoteItems = await fetchQuoteRequestsAdmin(token)
    setQuotes(quoteItems)
  }

  const projectImagePreviews = useMemo(
    () => projectForm.images.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    })),
    [projectForm.images]
  )

  useEffect(() => {
    return () => {
      projectImagePreviews.forEach((entry) => URL.revokeObjectURL(entry.url))
    }
  }, [projectImagePreviews])

  const onProjectInputChange = (field, value) => {
    setProjectForm((prev) => ({ ...prev, [field]: value }))
  }

  const onProjectImagesChange = (files) => {
    const selected = Array.from(files || [])
    setProjectForm((prev) => ({
      ...prev,
      images: [...prev.images, ...selected],
    }))
  }

  const removeProjectDraftImage = (index) => {
    setProjectForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }))
  }

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      company: '',
      description: '',
      images: [],
    })
  }

  const saveProject = async () => {
    setError('')
    setSuccess('')

    if (!projectForm.title.trim() || !projectForm.company.trim()) {
      setError('Project title and company are required')
      return
    }

    if (projectForm.images.length === 0) {
      setError('Please select at least one project image')
      return
    }

    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('title', projectForm.title.trim())
      formData.append('company', projectForm.company.trim())
      formData.append('description', projectForm.description.trim())
      projectForm.images.forEach((file) => formData.append('images', file))

      await createProject(token, formData)

      const refreshedProjects = await fetchProjectsAdmin()
      setProjects(refreshedProjects)
      resetProjectForm()
      setSuccess('Project saved successfully. It is now visible on customer projects section.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(err.response?.data?.message || 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  const removeProject = async (projectId) => {
    setError('')
    setSuccess('')

    try {
      await deleteProject(token, projectId)
      setProjects((prev) => prev.filter((item) => item._id !== projectId))
      setSuccess('Project deleted successfully.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(err.response?.data?.message || 'Failed to delete project')
    }
  }

  const openQuote = async (quoteId) => {
    setError('')
    setQuoteActionId(quoteId)

    try {
      await markQuoteAsOpened(token, quoteId)
      await refreshQuotes()
      setSuccess('Quote marked as opened.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(err.response?.data?.message || 'Failed to mark quote as opened')
    } finally {
      setQuoteActionId('')
    }
  }

  const removeQuote = async (quoteId) => {
    setError('')
    setSuccess('')
    setQuoteActionId(quoteId)

    try {
      await deleteQuoteRequest(token, quoteId)
      await refreshQuotes()
      setSuccess('Quote request deleted successfully.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(err.response?.data?.message || 'Failed to delete quote request')
    } finally {
      setQuoteActionId('')
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <section className="section shell admin-page">
        <p className="info-message">Loading projects...</p>
      </section>
    )
  }

  return (
    <section className="section shell admin-page">
      <div className="admin-header">
        <h1>Manage Projects</h1>
        <button type="button" className="catalog-btn outline" onClick={logout}>
          Logout
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="info-message">{success}</p>}

      <div className="admin-card">
        <div className="admin-card-head">
          <h2>Add New Project</h2>
        </div>

        <div className="admin-form">
          <label>
            Project Title
            <input
              type="text"
              value={projectForm.title}
              onChange={(e) => onProjectInputChange('title', e.target.value)}
              placeholder="Ex: ACP Elevation Work"
            />
          </label>

          <label>
            Company / Client Name
            <input
              type="text"
              value={projectForm.company}
              onChange={(e) => onProjectInputChange('company', e.target.value)}
              placeholder="Ex: GRK Aluminium Works"
            />
          </label>

          <label>
            Description (Optional)
            <textarea
              value={projectForm.description}
              onChange={(e) => onProjectInputChange('description', e.target.value)}
              placeholder="Project overview (optional)"
              rows={4}
            />
          </label>

          <label>
            Project Images
            <input type="file" accept="image/*" multiple onChange={(e) => onProjectImagesChange(e.target.files)} />
          </label>

          {projectImagePreviews.length > 0 && (
            <div className="admin-grid">
              {projectImagePreviews.map((entry, index) => (
                <article key={`${entry.name}-${index}`} className="admin-item-card">
                  <img src={entry.url} alt={entry.name} />
                  <p className="admin-mini-text">{entry.name}</p>
                  <button
                    type="button"
                    className="catalog-btn outline"
                    onClick={() => removeProjectDraftImage(index)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="admin-footer-actions">
            <button type="button" className="solid-btn" onClick={saveProject} disabled={saving}>
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Existing Projects</h2>
        <div className="admin-grid">
          {projects.map((project) => (
            <article key={project._id} className="admin-item-card">
              <img src={toAbsoluteImageUrl(project.images?.[0])} alt={project.title} />
              <strong>{project.title}</strong>
              <p className="admin-mini-text">{project.company}</p>
              <p className="admin-mini-text">{(project.images || []).length} image(s)</p>
              <button
                type="button"
                className="catalog-btn outline"
                onClick={() => removeProject(project._id)}
              >
                Delete Project
              </button>
            </article>
          ))}
          {projects.length === 0 && <p className="info-message">No projects uploaded yet.</p>}
        </div>
      </div>

      <div className="admin-card">
        <h2>Customer Quote Requests</h2>
        <div className="admin-grid">
          {quotes.map((quote) => (
            <article key={quote._id} className="admin-item-card">
              <p className={`quote-status ${quote.isOpened ? 'opened' : 'new'}`}>
                {quote.isOpened ? 'Opened' : 'Not Opened'}
              </p>
              <strong>{quote.name}</strong>
              <p className="admin-mini-text">Phone: {quote.phone}</p>
              <p className="admin-mini-text">Service: {quote.service || 'General enquiry'}</p>
              <p className="admin-mini-text">Preferred: {quote.contactMode || 'either'}</p>
              <p className="admin-mini-text">Message: {quote.message || 'No message'}</p>
              <p className="admin-mini-text">
                Received: {new Date(quote.createdAt).toLocaleString('en-IN')}
              </p>
              {quote.openedAt && (
                <p className="admin-mini-text">
                  Opened: {new Date(quote.openedAt).toLocaleString('en-IN')}
                </p>
              )}
              <a className="catalog-btn outline" href={`tel:${quote.phone}`}>
                Call Customer
              </a>
              <a
                className="catalog-btn solid"
                href={`https://wa.me/${String(quote.phone).replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              {!quote.isOpened && (
                <button
                  type="button"
                  className="catalog-btn outline"
                  onClick={() => openQuote(quote._id)}
                  disabled={quoteActionId === quote._id}
                >
                  {quoteActionId === quote._id ? 'Updating...' : 'Mark Opened'}
                </button>
              )}
              <button
                type="button"
                className="catalog-btn outline"
                onClick={() => removeQuote(quote._id)}
                disabled={quoteActionId === quote._id}
              >
                {quoteActionId === quote._id ? 'Deleting...' : 'Delete Quote'}
              </button>
            </article>
          ))}
          {quotes.length === 0 && <p className="info-message">No quote requests yet.</p>}
        </div>
      </div>
    </section>
  )
}

export default ManageHomepage
