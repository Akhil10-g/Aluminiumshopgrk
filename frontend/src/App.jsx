import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ExperienceBadge from './components/ExperienceBadge'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetails from './pages/ProjectDetails'
import AdminLogin from './pages/AdminLogin'
import CustomerLogin from './pages/CustomerLogin'
import ManageHomepage from './pages/ManageHomepage'
import './App.css'

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const id = location.hash.replace('#', '')
    const target = document.getElementById(id)

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location])

  return null
}

function AppShell() {
  const token = localStorage.getItem('adminToken')

  return (
    <>
      <ScrollToHash />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login/customer" element={<CustomerLogin />} />
          <Route
            path="/admin/homepage"
            element={token ? <ManageHomepage /> : <Navigate to="/admin/login" replace />}
          />
        </Routes>
      </main>
      <Footer />
      <ExperienceBadge />
      <WhatsAppButton />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
