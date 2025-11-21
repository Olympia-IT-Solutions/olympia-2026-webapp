import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useParams, Link, Navigate, Outlet } from 'react-router'
import { NavBar } from './components/NavBar'
import { Box } from '@chakra-ui/react'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'

function Layout() {
  const { i18n } = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  return (
    <Box minH="100vh" bgGradient="linear(to-r, #003049, #007f80, #d62828)">
      <NavBar />
      <Outlet />
    </Box>
  )
}

function Home() {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)

  return (
    <Box p={10} textAlign="center" color="white">
      <h1>{t('welcome')}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          {t('description')}
        </p>
      </div>
      <div>
        <Link to="/en" style={{ color: 'white', margin: '0 10px' }}>English</Link>
        <Link to="/fr" style={{ color: 'white', margin: '0 10px' }}>Français</Link>
        <Link to="/it" style={{ color: 'white', margin: '0 10px' }}>Italiano</Link>
        <Link to="/de" style={{ color: 'white', margin: '0 10px' }}>Deutsch</Link>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
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
      </Route>
      <Route path="/:lang/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/de" />} />
    </Routes>
  )
}

export default App
