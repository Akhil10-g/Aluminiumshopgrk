import axios from 'axios'
import { API_BASE_URL } from '../config/apiConfig'

const REQUEST_TIMEOUT_MS = 10000

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
})

const normalizeApiError = (error) => {
  if (error?.isApiError) {
    return error
  }

  const normalized = new Error(
    error?.response?.data?.message || error?.message || 'Request failed. Please try again.'
  )

  normalized.name = 'ApiError'
  normalized.isApiError = true
  normalized.status = error?.response?.status || null
  normalized.response = error?.response

  return normalized
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
)

const request = async (promiseFactory) => {
  try {
    return await promiseFactory()
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const getApiErrorMessage = (error, fallbackMessage = 'Something went wrong. Please try again.') => {
  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  if (typeof error?.response?.data?.message === 'string' && error.response.data.message.trim()) {
    return error.response.data.message
  }

  return fallbackMessage
}

const materialAssetUrls = import.meta.glob('../assets/materials/*', {
  eager: true,
  import: 'default',
})
const serviceAssetUrls = import.meta.glob('../assets/services/*', {
  eager: true,
  import: 'default',
})
const projectAssetUrls = import.meta.glob('../assets/PROJECTIMAGES/*', {
  eager: true,
  import: 'default',
})

const mapAssetByFileName = (assetMap) =>
  Object.entries(assetMap).reduce((acc, [path, assetUrl]) => {
    const fileName = path.split('/').pop()?.toLowerCase()
    if (fileName) {
      acc[fileName] = assetUrl
    }
    return acc
  }, {})

const localAssetsByType = {
  materials: mapAssetByFileName(materialAssetUrls),
  services: mapAssetByFileName(serviceAssetUrls),
  projects: mapAssetByFileName(projectAssetUrls),
}

const getLocalAssetUrl = (imagePath) => {
  if (typeof imagePath !== 'string') {
    return ''
  }

  const cleanedPath = imagePath.split('?')[0].split('#')[0]
  const fileName = cleanedPath.split('/').pop()?.toLowerCase()
  if (!fileName) {
    return ''
  }

  const normalizedPath = cleanedPath.toLowerCase()

  if (normalizedPath.includes('/materials/')) {
    return localAssetsByType.materials[fileName] || ''
  }

  if (normalizedPath.includes('/services/')) {
    return localAssetsByType.services[fileName] || ''
  }

  if (
    normalizedPath.includes('/projectimages/') ||
    normalizedPath.includes('/project-images/') ||
    normalizedPath.includes('/projects/')
  ) {
    return localAssetsByType.projects[fileName] || ''
  }

  return ''
}

export const toAbsoluteImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1591888227599-779811939961?auto=format&fit=crop&w=1200&q=80'
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  const localAsset = getLocalAssetUrl(imagePath)
  if (localAsset) {
    return localAsset
  }

  // Static images from public folder (starting with /) stay as-is.
  // Database/upload images from backend are prefixed with API_BASE_URL.
  if (imagePath.startsWith('/images/') || imagePath.startsWith('/materials/') || imagePath.startsWith('/services/')) {
    return imagePath
  }

  return `${API_BASE_URL}${imagePath}`
}

export const fetchProducts = async () => {
  const response = await request(() => api.get('/api/products'))
  const payload = response.data

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.products)) {
    return payload.products
  }

  return []
}

export const fetchProjects = async () => {
  const response = await request(() => api.get('/api/projects?limit=12'))
  const payload = response.data

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.projects)) {
    return payload.projects
  }

  return []
}

export const fetchProjectsAdmin = async () => {
  const response = await request(() => api.get('/api/projects?limit=100&sort=latest'))
  const payload = response.data

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.projects)) {
    return payload.projects
  }

  return []
}

export const fetchServices = async () => {
  const response = await request(() => api.get('/api/services'))
  const payload = response.data

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.services)) {
    return payload.services
  }

  return []
}

export const fetchServicesAdmin = fetchServices

export const fetchProjectById = async (id) => {
  const response = await request(() => api.get(`/api/projects/${id}`))
  return response.data
}

export const fetchHomepageData = async () => {
  const response = await request(() => api.get('/api/homepage'))
  return response.data
}

export const updateHomepageData = async (token, formData) => {
  const response = await request(() => api.put('/api/homepage', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  return response.data
}

export const adminLogin = async (payload) => {
  const response = await request(() =>
    api.post('/api/auth/login', payload)
  )
  return response.data
}

export const createQuoteRequest = async (payload) => {
  const response = await request(() => api.post('/api/quotes', payload))
  return response.data
}

export const fetchQuoteRequestsAdmin = async (token) => {
  const response = await request(() => api.get('/api/quotes', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  const payload = response.data

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.quotes)) {
    return payload.quotes
  }

  return []
}

export const markQuoteAsOpened = async (token, quoteId) => {
  const response = await request(() => api.patch(
    `/api/quotes/${quoteId}/open`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ))

  return response.data
}

export const deleteQuoteRequest = async (token, quoteId) => {
  const response = await request(() => api.delete(`/api/quotes/${quoteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  return response.data
}

export const createProject = async (token, formData) => {
  const response = await request(() => api.post('/api/projects', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  return response.data
}

export const createService = async (token, formData) => {
  const response = await request(() => api.post('/api/services', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  return response.data
}

export const updateService = async (token, serviceId, formData) => {
  const response = await request(() => api.put(`/api/services/${serviceId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  return response.data
}

export const updateProject = async (token, projectId, formData) => {
  const response = await request(() => api.put(`/api/projects/${projectId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  return response.data
}

export const deleteProject = async (token, projectId) => {
  const response = await request(() => api.delete(`/api/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  return response.data
}

export const deleteService = async (token, serviceId) => {
  const response = await request(() => api.delete(`/api/services/${serviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }))

  return response.data
}

export default api
