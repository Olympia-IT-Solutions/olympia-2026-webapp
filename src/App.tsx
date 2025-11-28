import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useParams, Link, Navigate, Outlet, useLocation } from 'react-router'
import { NavBar } from './components/NavBar'
import { Banner } from './components/Banner'
import { Slider } from './components/Slider'
import { DisciplinesSection } from './components/DisciplinesSection'
import { Footer } from './components/Footer'
import { Box } from '@chakra-ui/react'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'
import { Countries } from './pages/Countries'
import { SportPage } from './pages/SportPage'

function Layout() {
  const { i18n } = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  const isInternalPage = location.pathname.includes('/admin') || location.pathname.includes('/dashboard')

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Banner />
      <NavBar />
      <Box flex="1">
        <Outlet />
      </Box>
      {!isInternalPage && <Footer />}
    </Box>
  )
}

function Home() {

  return (
    <Box>
      <Slider />
      <DisciplinesSection />
    </Box>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="admin" element={<Admin />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="countries" element={<Countries />} />
        <Route path="sports/:sportId" element={<SportPage />} />
      </Route>
      <Route path="/:lang/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/de" />} />
    </Routes>
  )
}

export default App
