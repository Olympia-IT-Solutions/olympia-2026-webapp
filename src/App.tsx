import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useParams, Link, Navigate } from 'react-router'
import { NavBar } from './components/NavBar'
import { Box } from '@chakra-ui/react'

function MainApp() {
  const { t, i18n } = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  return (
    <Box minH="100vh" bgGradient="linear(to-r, #003049, #007f80, #d62828)">
      <NavBar />
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
    </Box>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/:lang" element={<MainApp />} />
      <Route path="/" element={<Navigate to="/de" />} />
    </Routes>
  )
}

export default App
