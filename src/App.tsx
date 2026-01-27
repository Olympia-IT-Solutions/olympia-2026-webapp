import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useParams, Navigate, Outlet, useLocation } from 'react-router'
import { Banner } from './components/Banner'
import { Slider } from './components/Slider'
import { CountriesFeature } from './components/CountriesFeature'
import { DisciplinesSection } from './components/DisciplinesSection'
import { Footer } from './components/Footer'
import { FooterBanner } from './components/FooterBanner'
import { CookieMenu } from './components/CookieMenu'
import { Box, Heading, Button, ButtonGroup } from '@chakra-ui/react'
import { FaChevronDown } from 'react-icons/fa';
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'
import { Countries } from './pages/Countries'
import { SportPage } from './pages/SportPage'
import { NotFound } from './pages/NotFound'
import { HeroVideo } from './components/HeroVideo'

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
      <Box flex="1">
        <Outlet />
      </Box>
      {!isInternalPage && <FooterBanner />}
      {!isInternalPage && <Footer />}
      <CookieMenu />
    </Box>
  )
}

function Home() {
  const { t } = useTranslation()

  return (
    <Box>
      <Heading fontFamily="'MilanoCortina2026-Bold'" size="4xl" textAlign="center" mb={4} marginTop={50}>{t('welcome')}</Heading>

      <Box my={4} display="flex" justifyContent="center">
        <ButtonGroup gap={4}>
          <Button
            onClick={() => document.getElementById('disciplines')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            colorScheme="teal"
            borderRadius="full"
            bg="#007f80"
            color="white"
            _hover={{ bg: '#006666' }}
          >
            <FaChevronDown style={{ marginRight: '8px' }} />
            Die Disziplinen
          </Button>

          <Button
            onClick={() => document.getElementById('countries-feature')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            colorScheme="teal"
            borderRadius="full"
            bg="#007f80"
            color="white"
            _hover={{ bg: '#006666' }}
          >
            <FaChevronDown style={{ marginRight: '8px' }} />
            Die Länder
          </Button>
        </ButtonGroup>
      </Box>

      <Box height={50} />
      <Slider />      
      <Box height={50} />

      <Box id="disciplines">
        <DisciplinesSection />
      </Box>
      <Box height={50} />

      <HeroVideo />

      <Box height={50} />
      <Box id="countries-feature">
        <CountriesFeature id="countries-feature" />      
      </Box>
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
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/:lang/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/de" />} />
    </Routes>
  )
}

export default App
