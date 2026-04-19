import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const toAbsoluteImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1591888227599-779811939961?auto=format&fit=crop&w=1200&q=80'
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  return `${API_BASE_URL}${imagePath}`
}

export const fetchProducts = async () => {
  const response = await api.get('/api/products')
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
  const response = await api.get('/api/projects?limit=12')
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
  const response = await api.get('/api/projects?limit=100&sort=latest')
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
  const response = await api.get('/api/services')
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
  const response = await api.get(`/api/projects/${id}`)
  return response.data
}

export const fetchHomepageData = async () => {
  const response = await api.get('/api/homepage')
  return response.data
}

export const updateHomepageData = async (token, formData) => {
  const response = await api.put('/api/homepage', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const adminLogin = async (payload) => {
  const response = await api.post('/api/auth/login', payload)
  return response.data
}

export const createQuoteRequest = async (payload) => {
  const response = await api.post('/api/quotes', payload)
  return response.data
}

export const fetchQuoteRequestsAdmin = async (token) => {
  const response = await api.get('/api/quotes', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

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
  const response = await api.patch(
    `/api/quotes/${quoteId}/open`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

export const deleteQuoteRequest = async (token, quoteId) => {
  const response = await api.delete(`/api/quotes/${quoteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const createProject = async (token, formData) => {
  const response = await api.post('/api/projects', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const createService = async (token, formData) => {
  const response = await api.post('/api/services', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const updateService = async (token, serviceId, formData) => {
  const response = await api.put(`/api/services/${serviceId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const updateProject = async (token, projectId, formData) => {
  const response = await api.put(`/api/projects/${projectId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const deleteProject = async (token, projectId) => {
  const response = await api.delete(`/api/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const deleteService = async (token, serviceId) => {
  const response = await api.delete(`/api/services/${serviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export default api
