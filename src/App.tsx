import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useParams, Navigate, Outlet, useLocation } from 'react-router'
import { useSportsStore } from './store/sports'
import { Banner } from './components/Banner'
import { Slider } from './components/Slider'
import { CountriesFeature } from './components/CountriesFeature'
import { DisciplinesSection } from './components/DisciplinesSection'
import { Footer } from './components/Footer'
import { FooterBanner } from './components/FooterBanner'
import { CookieMenu } from './components/CookieMenu'
import { Box } from '@chakra-ui/react'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'
import { Countries } from './pages/Countries'
import { CountryDetail } from './pages/CountryDetail'
import { SportPage } from './pages/SportPage'
import { NotFound } from './pages/NotFound'
import { CookiePolicy } from './pages/CookiePolicy'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { Accessibility } from './pages/Accessibility'
import { HeroVideo } from './components/HeroVideo'
import { getCurrentUser } from './logic/rights'
import type { RoleType } from './logic/rights'

function Layout() {
  const { i18n } = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  // Scrolle zur Oberseite bei Route-Änderung
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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

/**
 * Geschützte Route für authentifizierte Benutzer mit bestimmten Rollen
 */
interface ProtectedRouteProps {
  element: React.ReactElement
  requiredRoles?: RoleType[]
}

function ProtectedRoute({ element, requiredRoles = [] }: ProtectedRouteProps) {
  const { lang } = useParams<{ lang: string }>()
  const currentUser = getCurrentUser()

  // Benutzer nicht eingeloggt
  if (!currentUser) {
    return <Navigate to={`/${lang}/login`} replace />
  }

  // Wenn Rollen definiert sind, überprüfen ob Benutzer eine davon hat
  if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
    return <NotFound />
  }

  return element
}

function Home() {
  const { t } = useTranslation()

  return (
    <Box>
      {/*<Heading fontFamily="'MilanoCortina2026-Bold'" size="4xl" textAlign="center" mb={4} marginTop={50}>{t('welcome')}</Heading>

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
            {t('hero.disciplines')}
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
            {t('hero.countries')}
          </Button>
        </ButtonGroup>
      </Box>*/}

      <HeroVideo title={t('welcome')} />

      <Box height={50} />
      <Box id="disciplines">
        <DisciplinesSection />
      </Box>
      <Box height={50} />

      <Box height={50} />
      <Slider />      
      <Box height={50} />

      <Box height={50} />
      <Box id="countries-feature">
        <CountriesFeature id="countries-feature" />      
      </Box>
    </Box>
  )
} 

function App() {
  const initializeSports = useSportsStore((state) => state.initializeSports);

  // Initialize sports data on app load
  useEffect(() => {
    initializeSports();
  }, [initializeSports]);

  return (
    <Routes>
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="admin" element={<ProtectedRoute element={<Admin />} requiredRoles={['admin']} />} />
        <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} requiredRoles={['admin', 'referee']} />} />
        <Route path="countries" element={<Countries />} />
        <Route path="country/:country" element={<CountryDetail />} />
        <Route path="sports/:sportId" element={<SportPage />} />
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/:lang/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/de" />} />
    </Routes>
  )
}

export default App
