import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  HStack,
  Button,
  Text,
  Image,
  Box,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaChevronDown,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaGlobe,
  FaFutbol,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaTrophy,
} from 'react-icons/fa';
import logo from '../assets/milano-cortina-2026.gif';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router';
import { getCurrentUser, logout, Role } from '../logic/rights';
import { useTheme } from '../logic/theme';

const navIn = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, -12px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

// Styled-component for the main container
const NavContainer = styled.nav`
  background-color: var(--nav-bg);
  border-radius: 50px;
  padding: 10px 20px;
  box-shadow: var(--ring-soft), 0 10px 30px rgba(0, 28, 41, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  max-width: 1400px;
  margin: 0 auto;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 100;
  animation: ${navIn} var(--motion-base) var(--motion-ease) both;
  transition: transform var(--motion-fast) var(--motion-ease), box-shadow var(--motion-fast) var(--motion-ease);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--ring-soft), 0 14px 36px rgba(0, 28, 41, 0.18);
  }

  /* Mobile tweaks */
  @media (max-width: 768px) {
    border-radius: 16px;
    padding: 8px 12px;
    width: 100%;
  }
`;

export const NavBar = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [isSportsOpen, setIsSportsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const { theme, toggleTheme } = useTheme();
  const { open: isMobileOpen, onOpen: onMobileOpen, onClose: onMobileClose } = useDisclosure();

  useEffect(() => {
    // Aktualisiere den User-Status bei Änderungen (z.B. nach Login/Logout)
    const handleStorageChange = () => setCurrentUser(getCurrentUser());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    onMobileClose();
    navigate(`/${lang}/login`);
  };

  const currentLang = lang || i18n.language || 'de';
  const location = useLocation();
  
  const languages: Record<string, string> = {
    de: 'Deutsch',
    en: 'English',
    fr: 'Français',
    it: 'Italiano',
  };

  const sports: Record<string, string> = {
    biathlon: 'Biathlon',
    bobsport: 'Bobsport',
    curling: 'Curling',
    eishockey: 'Eishockey',
    eiskunstlauf: 'Eiskunstlauf',
    skilanglauf: 'Skilanglauf',
    skispringen: 'Skispringen',
  };

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    // keep the rest of the path intact – only replace the language segment
    const segments = location.pathname.split('/');
    if (segments.length > 1) {
      segments[1] = newLang;
    }
    const newPath = segments.join('/') || `/${newLang}`;
    navigate(newPath);
    setIsOpen(false);
    onMobileClose();
  };

  return (
    <NavContainer>
      {/* Left Side: Logo + Mobile Burger */}
      <Flex align="center">
        <Image 
          src={logo} 
          alt="Milano Cortina 2026" 
          height="60px" 
          objectFit="contain" 
          mr={4}
          cursor="pointer"
          transition="transform var(--motion-fast) var(--motion-ease)"
          _hover={{ transform: 'scale(1.03)' }}
          onClick={() => navigate(`/${currentLang}`)}
        />

        {/* Mobile burger button (visible on small screens) */}
        <Button
          aria-label="Open menu"
          display={{ base: 'inline-flex', md: 'none' }}
          onClick={onMobileOpen}
          size="sm"
          ml={2}
          variant="ghost"
        >
          <FaBars />
        </Button>
      </Flex>

      {/* Center: Countries and Sports (hidden on small screens) */}
      <Flex align="center" display={{ base: 'none', md: 'flex' }}>
        <HStack gap={3}>
          <Button
            bg="#007f80"
            color="white"
            borderRadius="full"
            px={6}
            py={5}
            fontWeight="bold"
            transition="all var(--motion-fast) var(--motion-ease)"
            _hover={{ bg: '#006666', transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(0, 102, 102, 0.3)' }}
            onClick={() => navigate(`/${currentLang}/countries`)}
          >
            {t('nav.countries')}
          </Button>

          <Box position="relative">
            <HStack 
              bg="#007f80"
              color="white"
              borderRadius="full" 
              px={4} 
              py={2} 
              cursor="pointer"
              border="1px solid #007f80"
              boxShadow="sm"
              transition="all var(--motion-fast) var(--motion-ease)"
              _hover={{ bg: '#006666', transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(0, 102, 102, 0.3)' }}
              onClick={() => setIsSportsOpen(!isSportsOpen)}
            >
              <Text fontWeight="bold" fontSize="sm">
                {t('nav.sports')}
              </Text>
              <FaChevronDown size={10} />
            </HStack>
            
            {isSportsOpen && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                mt={2}
                bg="var(--card-bg)"
                borderRadius="xl"
                boxShadow="lg"
                py={2}
                minW="150px"
                zIndex={200}
                overflow="hidden"
                border="1px solid var(--border-color)"
                style={{ animation: 'fadeUpIn var(--motion-base) var(--motion-ease)' }}
              >
                {Object.entries(sports).map(([key, label]) => (
                  <Box
                    key={key}
                    px={4}
                    py={2}
                    cursor="pointer"
                    _hover={{ bg: 'var(--hover-bg)', color: '#007f80' }}
                    onClick={() => {
                      navigate(`/${currentLang}/sports/${key}`);
                      setIsSportsOpen(false);
                    }}
                  >
                    <Text fontSize="sm">
                      {label}
                    </Text>
                  </Box>
                ))}
              </Box>
            )} 
          </Box>

          {currentUser && (
            <Button
              bg="#007f80"
              color="white"
              borderRadius="full"
              px={6}
              py={5}
              fontWeight="bold"
              transition="all var(--motion-fast) var(--motion-ease)"
              _hover={{ bg: '#006666', transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(0, 102, 102, 0.3)' }}
              onClick={() => navigate(`/${currentLang}/dashboard`)}
            >
              {t('nav.dashboard')}
            </Button>
          )}

          {currentUser?.role === Role.Admin && (
            <Button
              bg="#007f80"
              color="white"
              borderRadius="full"
              px={6}
              py={5}
              fontWeight="bold"
              transition="all var(--motion-fast) var(--motion-ease)"
              _hover={{ bg: '#006666', transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(0, 102, 102, 0.3)' }}
              onClick={() => navigate(`/${currentLang}/admin`)}
            >
              {t('nav.admin')}
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Right Side: Desktop only */}
      <Flex align="center" display={{ base: 'none', md: 'flex' }}>
        <HStack gap={3}>
          <Button
            bg="#007f80"
            color="white"
            borderRadius="full"
            px={6}
            py={5}
            fontWeight="bold"
            transition="all var(--motion-fast) var(--motion-ease)"
            _hover={{ bg: '#006666', transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(0, 102, 102, 0.3)' }}
            onClick={currentUser ? handleLogout : () => navigate(`/${currentLang}/login`)}
          >
            {currentUser ? t('nav.logout') : t('nav.login')}
          </Button>

          <Button
            bg="transparent"
            color={theme === 'light' ? '#003049' : 'white'}
            borderRadius="full"
            px={4}
            py={2}
            border="1px solid #eee"
            boxShadow="sm"
            transition="all var(--motion-fast) var(--motion-ease)"
            _hover={{ borderColor: '#ccc', transform: 'translateY(-2px)' }}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
          </Button>

          <Box position="relative">
              <HStack 
                  bg="var(--card-bg)" 
                  borderRadius="full" 
                  px={4} 
                  py={2} 
                  cursor="pointer"
                  border="1px solid var(--border-color)"
                  boxShadow="sm"
                  _hover={{ borderColor: 'var(--hover-border)' }}
                  onClick={() => setIsOpen(!isOpen)}
              >
                  <Text fontWeight="bold" fontSize="sm" color="var(--card-text)">
                      {languages[currentLang] || 'Deutsch'}
                  </Text>
                  <FaChevronDown size={10} color="var(--card-text)" />
              </HStack>
              
              {isOpen && (
                  <Box
                      position="absolute"
                      top="100%"
                      right="0"
                      mt={2}
                      bg="var(--card-bg)"
                      borderRadius="xl"
                      boxShadow="lg"
                      py={2}
                      minW="150px"
                      zIndex={200}
                      overflow="hidden"
                      border="1px solid var(--border-color)"
                      style={{ animation: 'fadeUpIn var(--motion-base) var(--motion-ease)' }}
                  >
                      {Object.entries(languages).map(([code, label]) => (
                          <Box
                              key={code}
                              px={4}
                              py={2}
                              cursor="pointer"
                              _hover={{ bg: 'var(--hover-bg)', color: '#007f80' }}
                              onClick={() => handleLanguageChange(code)}
                          >
                              <Text fontSize="sm" fontWeight={currentLang === code ? 'bold' : 'normal'}>
                                  {label}
                              </Text>
                          </Box>
                      ))}
                  </Box>
              )}
          </Box>
        </HStack>
      </Flex>

      {/* Mobile Slide-in Menu */}
      {isMobileOpen && (
        <Box
          position="fixed"
          inset="0"
          bg="rgba(0, 15, 20, 0.42)"
          backdropFilter="blur(1px)"
          zIndex={250}
          onClick={onMobileClose}
        />
      )}

      {isMobileOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          h="100vh"
          w={{ base: '80%', sm: '65%' }}
          maxW="320px"
          bg="var(--card-bg)"
          zIndex={300}
          boxShadow="lg"
          p={4}
          overflowY="auto"
          borderTopRightRadius="2xl"
          borderBottomRightRadius="2xl"
          borderRight="1px solid var(--border-color)"
          style={{ animation: 'fadeUpIn var(--motion-base) var(--motion-ease)' }}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <HStack>
              <Image src={logo} alt="logo" height="40px" objectFit="contain" />
              <Text fontWeight="bold">Milano Cortina 2026</Text>
            </HStack>
            <Button variant="ghost" onClick={onMobileClose} aria-label="Close menu"><FaTimes /></Button>
          </Flex>

          <Box mb={3}>
            <Button variant="ghost" w="100%" onClick={() => { navigate(`/${currentLang}/countries`); onMobileClose(); }}>
              <HStack gap={3}>
                <FaGlobe />
                <Text>{t('nav.countries')}</Text>
              </HStack>
            </Button>
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold" mb={2}>{t('nav.sports')}</Text>
            <Box>
              {Object.entries(sports).map(([key, label]) => (
                <Button key={key} variant="ghost" w="100%" onClick={() => { navigate(`/${currentLang}/sports/${key}`); onMobileClose(); }}>
                  <HStack gap={3}>
                    <FaFutbol />
                    <Text>{label}</Text>
                  </HStack>
                </Button>
              ))}
            </Box>
          </Box>

          <Box borderTop="1px solid var(--border-color)" pt={3} mb={3}>
            {currentUser ? (
              <Button variant="ghost" w="100%" onClick={handleLogout}>
                <HStack gap={3}><FaSignOutAlt /><Text>{t('nav.logout')}</Text></HStack>
              </Button>
            ) : (
              <Button variant="ghost" w="100%" onClick={() => { navigate(`/${currentLang}/login`); onMobileClose(); }}>
                <HStack gap={3}><FaSignInAlt /><Text>{t('nav.login')}</Text></HStack>
              </Button>
            )}

            {currentUser && (
              <Button variant="ghost" w="100%" onClick={() => { navigate(`/${currentLang}/dashboard`); onMobileClose(); }}>
                <HStack gap={3}><FaUser /><Text>{t('nav.dashboard')}</Text></HStack>
              </Button>
            )}

            {currentUser?.role === Role.Admin && (
              <Button variant="ghost" w="100%" onClick={() => { navigate(`/${currentLang}/admin`); onMobileClose(); }}>
                <HStack gap={3}><FaTrophy /><Text>{t('nav.admin')}</Text></HStack>
              </Button>
            )}
          </Box>

          <Box borderTop="1px solid var(--border-color)" pt={3}>
            <Button variant="ghost" w="100%" onClick={() => { toggleTheme(); }}>
              <HStack gap={3}><Box>{theme === 'light' ? <FaMoon /> : <FaSun />}</Box><Text>{theme === 'light' ? t('nav.darkMode') ?? 'Dark' : t('nav.lightMode') ?? 'Light'}</Text></HStack>
            </Button>

            <Box mt={3}>
              <Text fontWeight="bold" mb={2}>Language</Text>
              {Object.entries(languages).map(([code, label]) => (
                <Button key={code} variant={currentLang === code ? 'solid' : 'ghost'} w="100%" mb={1} onClick={() => handleLanguageChange(code)}>
                  {label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </NavContainer>
  );
};
