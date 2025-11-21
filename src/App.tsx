import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useParams, Link, Navigate } from 'react-router'

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
    <>
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
        <Link to="/en">English</Link>
        <Link to="/fr">Français</Link>
        <Link to="/it">Italiano</Link>
        <Link to="/de">Deutsch</Link>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
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
