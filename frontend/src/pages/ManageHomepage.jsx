import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createProject,
  createService,
  deleteProject,
  deleteQuoteRequest,
  deleteService,
  fetchProjectsAdmin,
  fetchQuoteRequestsAdmin,
  fetchServicesAdmin,
  getApiErrorMessage,
  markQuoteAsOpened,
  updateProject,
  updateService,
  toAbsoluteImageUrl,
} from '../services/api'

function ManageHomepage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  const [loading, setLoading] = useState(true)
  const [savingProject, setSavingProject] = useState(false)
  const [savingService, setSavingService] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const [quotes, setQuotes] = useState([])
  const [quoteActionId, setQuoteActionId] = useState('')
  const [savingServiceUpdateId, setSavingServiceUpdateId] = useState('')
  const [savingProjectUpdateId, setSavingProjectUpdateId] = useState('')
  const [serviceEdits, setServiceEdits] = useState({})
  const [projectEdits, setProjectEdits] = useState({})
  const [serviceEditModeById, setServiceEditModeById] = useState({})
  const [projectEditModeById, setProjectEditModeById] = useState({})
  const [serviceCreateStatus, setServiceCreateStatus] = useState('')
  const [serviceUpdateStatusById, setServiceUpdateStatusById] = useState({})

  const [projectForm, setProjectForm] = useState({
    description: '',
    images: [],
  })

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    image: null,
  })

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }

    const loadAdminData = async () => {
      try {
        const [projectItems, quoteItems, serviceItems] = await Promise.all([
          fetchProjectsAdmin(),
          fetchQuoteRequestsAdmin(token),
          fetchServicesAdmin(),
        ])

        setProjects(projectItems)
        setQuotes(quoteItems)
        setServices(serviceItems)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load admin data'))
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [navigate, token])

  const refreshQuotes = async () => {
    const quoteItems = await fetchQuoteRequestsAdmin(token)
    setQuotes(quoteItems)
  }

  const refreshProjects = async () => {
    const items = await fetchProjectsAdmin()
    setProjects(items)
  }

  const refreshServices = async () => {
    const items = await fetchServicesAdmin()
    setServices(items)
  }

  const projectImagePreviews = useMemo(
    () => projectForm.images.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    [projectForm.images]
  )

  const serviceImagePreview = useMemo(() => {
    if (!serviceForm.image) {
      return ''
    }

    return URL.createObjectURL(serviceForm.image)
  }, [serviceForm.image])

  const projectEditImagePreviewsById = useMemo(
    () =>
      Object.entries(projectEdits).reduce((acc, [projectId, draft]) => {
        const addedFiles = Array.isArray(draft?.imageFiles) ? draft.imageFiles : []
        const replacementEntries = Object.entries(draft?.replacementFilesByImage || {})
          .filter(([, file]) => Boolean(file))

        acc[projectId] = {
          added: addedFiles.map((file, index) => ({
            name: file.name,
            url: URL.createObjectURL(file),
            key: `added-${file.name}-${index}`,
            label: 'New',
          })),
          replaced: replacementEntries.map(([imagePath, file], index) => ({
            name: file.name,
            url: URL.createObjectURL(file),
            key: `replace-${imagePath}-${index}`,
            label: 'Replacement',
          })),
        }
        return acc
      }, {}),
    [projectEdits]
  )

  useEffect(() => {
    return () => {
      projectImagePreviews.forEach((entry) => URL.revokeObjectURL(entry.url))
      if (serviceImagePreview) {
        URL.revokeObjectURL(serviceImagePreview)
      }
      Object.values(projectEditImagePreviewsById).forEach((groups) => {
        ;(groups.added || []).forEach((entry) => URL.revokeObjectURL(entry.url))
        ;(groups.replaced || []).forEach((entry) => URL.revokeObjectURL(entry.url))
      })
    }
  }, [projectImagePreviews, serviceImagePreview, projectEditImagePreviewsById])

  const resetProjectForm = () => {
    setProjectForm({ description: '', images: [] })
  }

  const resetServiceForm = () => {
    setServiceForm({ title: '', description: '', image: null })
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

  const saveProject = async () => {
    setError('')
    setSuccess('')

    if (projectForm.images.length === 0) {
      setError('Please select at least one project image')
      return
    }

    setSavingProject(true)

    try {
      const formData = new FormData()
      formData.append('description', projectForm.description.trim())
      projectForm.images.forEach((file) => formData.append('images', file))

      await createProject(token, formData)
      await refreshProjects()
      resetProjectForm()
      setSuccess('Project added successfully.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(getApiErrorMessage(err, 'Failed to add project'))
    } finally {
      setSavingProject(false)
    }
  }

  const saveService = async () => {
    setError('')
    setSuccess('')
    setServiceCreateStatus('')

    if (!serviceForm.title.trim()) {
      setError('Service title is required')
      return
    }

    if (!serviceForm.description.trim()) {
      setError('Service description is required')
      return
    }

    if (!serviceForm.image) {
      setError('Please select one service image')
      return
    }

    setSavingService(true)

    try {
      const formData = new FormData()
      formData.append('title', serviceForm.title.trim())
      formData.append('description', serviceForm.description.trim())
      formData.append('image', serviceForm.image)

      await createService(token, formData)
      await refreshServices()
      resetServiceForm()
      setSuccess('Service added successfully.')
      setServiceCreateStatus('Service saved successfully.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      const serverMessage = err.response?.data?.message
      const statusCode = err.response?.status
      setError(
        serverMessage
          ? `Failed to add service: ${serverMessage}`
          : `${getApiErrorMessage(err, 'Failed to add service')}${statusCode ? ` (HTTP ${statusCode})` : ''}`
      )
      setServiceCreateStatus('')
    } finally {
      setSavingService(false)
    }
  }

  const removeProject = async (projectId) => {
    setError('')
    setSuccess('')

    try {
      await deleteProject(token, projectId)
      setProjects((prev) => prev.filter((item) => item._id !== projectId))
      setProjectEditModeById((prev) => {
        const next = { ...prev }
        delete next[projectId]
        return next
      })
      setProjectEdits((prev) => {
        const next = { ...prev }
        delete next[projectId]
        return next
      })
      setSuccess('Project deleted successfully.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(getApiErrorMessage(err, 'Failed to delete project'))
    }
  }

  const removeService = async (serviceId) => {
    setError('')
    setSuccess('')

    try {
      await deleteService(token, serviceId)
      setServices((prev) => prev.filter((item) => item._id !== serviceId))
      setServiceUpdateStatusById((prev) => {
        const next = { ...prev }
        delete next[serviceId]
        return next
      })
      setServiceEditModeById((prev) => {
        const next = { ...prev }
        delete next[serviceId]
        return next
      })
      setServiceEdits((prev) => {
        const next = { ...prev }
        delete next[serviceId]
        return next
      })
      setSuccess('Service deleted successfully.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(getApiErrorMessage(err, 'Failed to delete service'))
    }
  }

  const updateServiceEdit = (serviceId, patch) => {
    setServiceEdits((prev) => ({
      ...prev,
      [serviceId]: {
        ...(prev[serviceId] || {}),
        ...patch,
      },
    }))
  }

  const startServiceEdit = (service) => {
    setServiceUpdateStatusById((prev) => ({
      ...prev,
      [service._id]: '',
    }))
    setServiceEdits((prev) => ({
      ...prev,
      [service._id]: {
        title: String(service.title || ''),
        description: String(service.description || ''),
        imageFile: null,
      },
    }))
    setServiceEditModeById((prev) => ({
      ...prev,
      [service._id]: true,
    }))
  }

  const cancelServiceEdit = (serviceId) => {
    setServiceEdits((prev) => {
      const next = { ...prev }
      delete next[serviceId]
      return next
    })
    setServiceEditModeById((prev) => ({
      ...prev,
      [serviceId]: false,
    }))
    setServiceUpdateStatusById((prev) => ({
      ...prev,
      [serviceId]: '',
    }))
  }

  const updateProjectEdit = (projectId, patch) => {
    setProjectEdits((prev) => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || {}),
        ...patch,
      },
    }))
  }

  const startProjectEdit = (project) => {
    setProjectEdits((prev) => ({
      ...prev,
      [project._id]: {
        title: String(project.title || ''),
        company: String(project.company || ''),
        description: String(project.description || ''),
        imageFiles: [],
        removedImages: [],
        replacementFilesByImage: {},
      },
    }))
    setProjectEditModeById((prev) => ({
      ...prev,
      [project._id]: true,
    }))
  }

  const cancelProjectEdit = (projectId) => {
    setProjectEdits((prev) => {
      const next = { ...prev }
      delete next[projectId]
      return next
    })
    setProjectEditModeById((prev) => ({
      ...prev,
      [projectId]: false,
    }))
  }

  const toggleProjectImageRemoval = (projectId, imagePath) => {
    setProjectEdits((prev) => {
      const draft = prev[projectId] || {}
      const removedSet = new Set(Array.isArray(draft.removedImages) ? draft.removedImages : [])

      if (removedSet.has(imagePath)) {
        removedSet.delete(imagePath)
      } else {
        removedSet.add(imagePath)
      }

      return {
        ...prev,
        [projectId]: {
          ...draft,
          removedImages: Array.from(removedSet),
        },
      }
    })
  }

  const setProjectImageReplacement = (projectId, imagePath, file) => {
    setProjectEdits((prev) => {
      const draft = prev[projectId] || {}
      const nextReplacements = {
        ...(draft.replacementFilesByImage || {}),
      }

      if (file) {
        nextReplacements[imagePath] = file
      } else {
        delete nextReplacements[imagePath]
      }

      return {
        ...prev,
        [projectId]: {
          ...draft,
          replacementFilesByImage: nextReplacements,
        },
      }
    })
  }

  const saveServiceUpdate = async (service) => {
    const draft = serviceEdits[service._id] || {}
    const title = String(draft.title ?? service.title ?? '').trim()
    const description = String(draft.description ?? service.description ?? '').trim()

    setError('')
    setSuccess('')
    setServiceUpdateStatusById((prev) => ({
      ...prev,
      [service._id]: '',
    }))

    if (!title) {
      setError('Service title is required')
      return
    }

    if (!description) {
      setError('Service description is required')
      return
    }

    setSavingServiceUpdateId(service._id)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)

      if (draft.imageFile) {
        formData.append('image', draft.imageFile)
      }

      await updateService(token, service._id, formData)
      await refreshServices()

      setServiceEdits((prev) => {
        const next = { ...prev }
        delete next[service._id]
        return next
      })
      setServiceEditModeById((prev) => ({
        ...prev,
        [service._id]: false,
      }))

      setSuccess('Service updated successfully.')
      setServiceUpdateStatusById((prev) => ({
        ...prev,
        [service._id]: 'Service saved successfully.',
      }))
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(getApiErrorMessage(err, 'Failed to update service'))
      setServiceUpdateStatusById((prev) => ({
        ...prev,
        [service._id]: '',
      }))
    } finally {
      setSavingServiceUpdateId('')
    }
  }

  const saveProjectUpdate = async (project) => {
    const draft = projectEdits[project._id] || {}
    const title = String(draft.title ?? project.title ?? '').trim()
    const company = String(draft.company ?? project.company ?? '').trim()
    const description = String(draft.description ?? project.description ?? '').trim()
    const existingImages = Array.isArray(project.images) ? project.images : []
    const removedImages = new Set(Array.isArray(draft.removedImages) ? draft.removedImages : [])
    const replacementFilesByImage = draft.replacementFilesByImage || {}
    const replacementImagePaths = new Set(
      Object.entries(replacementFilesByImage)
        .filter(([, file]) => Boolean(file))
        .map(([imagePath]) => imagePath)
    )
    const retainedImages = existingImages.filter(
      (imagePath) => !removedImages.has(imagePath) && !replacementImagePaths.has(imagePath)
    )
    const addedFiles = Array.isArray(draft.imageFiles) ? draft.imageFiles : []
    const replacementFiles = Object.values(replacementFilesByImage).filter(Boolean)
    const nextUploadFiles = [...addedFiles, ...replacementFiles]

    setError('')
    setSuccess('')

    if (retainedImages.length + nextUploadFiles.length === 0) {
      setError('At least one project image is required')
      return
    }

    setSavingProjectUpdateId(project._id)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('company', company)
      formData.append('description', description)
      formData.append('retainedImages', JSON.stringify(retainedImages))

      nextUploadFiles.forEach((file) => formData.append('images', file))

      await updateProject(token, project._id, formData)
      await refreshProjects()

      setProjectEdits((prev) => {
        const next = { ...prev }
        delete next[project._id]
        return next
      })
      setProjectEditModeById((prev) => ({
        ...prev,
        [project._id]: false,
      }))

      setSuccess('Project updated successfully.')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      setError(getApiErrorMessage(err, 'Failed to update project'))
    } finally {
      setSavingProjectUpdateId('')
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

      setError(getApiErrorMessage(err, 'Failed to mark quote as opened'))
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

      setError(getApiErrorMessage(err, 'Failed to delete quote request'))
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
        <p className="info-message">Loading admin data...</p>
      </section>
    )
  }

  return (
    <section className="section shell admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Admin Control Center</h1>
        </div>
        <button type="button" className="catalog-btn outline" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="admin-summary-strip">
        <article className="admin-summary-card">
          <p className="admin-mini-text">Total Services</p>
          <strong>{services.length}</strong>
        </article>
        <article className="admin-summary-card">
          <p className="admin-mini-text">Total Projects</p>
          <strong>{projects.length}</strong>
        </article>
        <article className="admin-summary-card">
          <p className="admin-mini-text">Pending Quotes</p>
          <strong>{quotes.filter((item) => !item.isOpened).length}</strong>
        </article>
        <article className="admin-summary-card">
          <p className="admin-mini-text">Opened Quotes</p>
          <strong>{quotes.filter((item) => item.isOpened).length}</strong>
        </article>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="info-message">{success}</p>}

      <div className="admin-create-grid">
        <div className="admin-card">
          <h2>Add Service (Image + Description)</h2>
          <div className="admin-form">
            <label>
              Service Title
              <input
                type="text"
                value={serviceForm.title}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Example: ACP Elevation Work"
              />
            </label>

            <label>
              Service Description
              <textarea
                value={serviceForm.description}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Example: ACP cladding and aluminium elevation finishing for commercial buildings."
                rows={4}
              />
            </label>

            <label>
              Service Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setServiceForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))}
              />
            </label>

            {serviceImagePreview && <img src={serviceImagePreview} alt="Service preview" className="admin-preview" />}

            <div className="admin-footer-actions">
              <button type="button" className="solid-btn" onClick={saveService} disabled={savingService}>
                {savingService ? 'Saving...' : 'Add Service'}
              </button>
              {serviceCreateStatus && <p className="admin-mini-text">{serviceCreateStatus}</p>}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2>Add Project (Image with Optional Description)</h2>
          <div className="admin-form">
            <label>
              Project Description (Optional)
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional: Office partition installation completed in Medchal."
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
              <button type="button" className="solid-btn" onClick={saveProject} disabled={savingProject}>
                {savingProject ? 'Saving...' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Existing Services</h2>
        <div className="admin-grid">
          {services.map((service) => (
            <article key={service._id} className="admin-item-card">
              {serviceEditModeById[service._id] ? (
                <p className="admin-mini-text">Editing service</p>
              ) : (
                <p className="admin-mini-text">View mode</p>
              )}
              <img src={toAbsoluteImageUrl(service.image)} alt="Service" />
              <input
                value={serviceEdits[service._id]?.title ?? service.title ?? ''}
                onChange={(e) => updateServiceEdit(service._id, { title: e.target.value })}
                placeholder="Service title"
                disabled={!serviceEditModeById[service._id]}
              />
              <textarea
                rows={3}
                value={serviceEdits[service._id]?.description ?? service.description ?? ''}
                onChange={(e) => updateServiceEdit(service._id, { description: e.target.value })}
                placeholder="Service description"
                disabled={!serviceEditModeById[service._id]}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateServiceEdit(service._id, { imageFile: e.target.files?.[0] || null })}
                disabled={!serviceEditModeById[service._id]}
              />
              {serviceEditModeById[service._id] && serviceEdits[service._id]?.imageFile && (
                <p className="admin-mini-text">New image selected: {serviceEdits[service._id].imageFile.name}</p>
              )}
              {serviceEditModeById[service._id] ? (
                <>
                  <button
                    type="button"
                    className="solid-btn"
                    onClick={() => saveServiceUpdate(service)}
                    disabled={savingServiceUpdateId === service._id}
                  >
                    {savingServiceUpdateId === service._id ? 'Saving...' : 'Save Service'}
                  </button>
                  <button
                    type="button"
                    className="catalog-btn outline"
                    onClick={() => cancelServiceEdit(service._id)}
                    disabled={savingServiceUpdateId === service._id}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="solid-btn"
                  onClick={() => startServiceEdit(service)}
                >
                  Edit Service
                </button>
              )}
              {serviceUpdateStatusById[service._id] && (
                <p className="admin-mini-text">{serviceUpdateStatusById[service._id]}</p>
              )}
              <button type="button" className="catalog-btn outline" onClick={() => removeService(service._id)}>
                Delete Service
              </button>
            </article>
          ))}
          {services.length === 0 && <p className="info-message">No services added yet.</p>}
        </div>
      </div>

      <div className="admin-card">
        <h2>Existing Projects</h2>
        <div className="admin-projects-grid">
          {projects.map((project) => {
            const isEditing = Boolean(projectEditModeById[project._id])
            const titleValue = projectEdits[project._id]?.title ?? project.title ?? ''
            const companyValue = projectEdits[project._id]?.company ?? project.company ?? ''
            const descriptionValue = projectEdits[project._id]?.description ?? project.description ?? ''
            const removedImages = new Set(projectEdits[project._id]?.removedImages || [])
            const replacementFilesByImage = projectEdits[project._id]?.replacementFilesByImage || {}
            const selectedPreviewGroups = projectEditImagePreviewsById[project._id] || { added: [], replaced: [] }
            const selectedPreviewItems = [...selectedPreviewGroups.replaced, ...selectedPreviewGroups.added]

            return (
              <article key={project._id} className="admin-project-card">
                <div className="admin-project-head">
                  <p className="admin-mini-text">{(project.images || []).length} image(s) uploaded</p>
                  <p className="admin-mini-text">{isEditing ? 'Editing' : 'View'}</p>
                </div>

                <img src={toAbsoluteImageUrl(project.images?.[0])} alt="Project" className="admin-project-cover" />

                <div className="admin-project-form">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={titleValue}
                        onChange={(e) => updateProjectEdit(project._id, { title: e.target.value })}
                        placeholder="Project title"
                      />
                      <input
                        type="text"
                        value={companyValue}
                        onChange={(e) => updateProjectEdit(project._id, { company: e.target.value })}
                        placeholder="Company"
                      />
                      <textarea
                        rows={3}
                        value={descriptionValue}
                        onChange={(e) => updateProjectEdit(project._id, { description: e.target.value })}
                        placeholder="Project description (optional)"
                      />
                    </>
                  ) : (
                    <>
                      <p className="admin-mini-text"><strong>Title:</strong> {String(titleValue).trim() || 'Untitled Project'}</p>
                      <p className="admin-mini-text"><strong>Company:</strong> {String(companyValue).trim() || 'GRK Aluminium Works'}</p>
                      <p className="admin-project-description">
                        {String(descriptionValue).trim() || 'No description added for this project yet.'}
                      </p>
                    </>
                  )}

                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => updateProjectEdit(project._id, { imageFiles: Array.from(e.target.files || []) })}
                    />
                  )}
                </div>

                {(project.images || []).length > 0 && (
                  <>
                    <p className="admin-mini-text">Current images</p>
                    <div className={`admin-image-row ${isEditing ? 'admin-image-editor-row' : ''}`}>
                      {(project.images || []).map((image, index) => (
                        <article
                          key={`${project._id}-current-${index}`}
                          className={`admin-image-edit-card ${removedImages.has(image) ? 'is-removed' : ''}`}
                        >
                          <img src={toAbsoluteImageUrl(image)} alt={`Project ${index + 1}`} />
                          <p className="admin-mini-text">Image {index + 1}</p>
                          {replacementFilesByImage[image] && !removedImages.has(image) && (
                            <p className="admin-mini-text">Replacement: {replacementFilesByImage[image].name}</p>
                          )}

                          {isEditing && (
                            <div className="admin-image-edit-actions">
                              <button
                                type="button"
                                className="catalog-btn outline"
                                onClick={() => toggleProjectImageRemoval(project._id, image)}
                              >
                                {removedImages.has(image) ? 'Undo Delete' : 'Delete Image'}
                              </button>

                              {!removedImages.has(image) && (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setProjectImageReplacement(project._id, image, e.target.files?.[0] || null)}
                                />
                              )}

                              {!removedImages.has(image) && replacementFilesByImage[image] && (
                                <button
                                  type="button"
                                  className="catalog-btn outline"
                                  onClick={() => setProjectImageReplacement(project._id, image, null)}
                                >
                                  Clear Replacement
                                </button>
                              )}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </>
                )}

                {isEditing && selectedPreviewItems.length > 0 && (
                  <>
                    <p className="admin-mini-text">Selected new and replacement images</p>
                    <div className="admin-image-row">
                      {selectedPreviewItems.map((entry) => (
                        <article key={entry.key} className="admin-image-edit-card">
                          <img src={entry.url} alt={entry.name} />
                          <p className="admin-mini-text">{entry.label}: {entry.name}</p>
                        </article>
                      ))}
                    </div>
                  </>
                )}

                <div className="admin-project-actions">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="solid-btn"
                        onClick={() => saveProjectUpdate(project)}
                        disabled={savingProjectUpdateId === project._id}
                      >
                        {savingProjectUpdateId === project._id ? 'Saving...' : 'Save Project'}
                      </button>
                      <button
                        type="button"
                        className="catalog-btn outline"
                        onClick={() => cancelProjectEdit(project._id)}
                        disabled={savingProjectUpdateId === project._id}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" className="solid-btn" onClick={() => startProjectEdit(project)}>
                      Edit Project
                    </button>
                  )}
                  <button type="button" className="catalog-btn outline" onClick={() => removeProject(project._id)}>
                    Delete Project
                  </button>
                </div>
              </article>
            )
          })}
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
              <p className="admin-mini-text">Received: {new Date(quote.createdAt).toLocaleString('en-IN')}</p>
              {quote.openedAt && (
                <p className="admin-mini-text">Opened: {new Date(quote.openedAt).toLocaleString('en-IN')}</p>
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
