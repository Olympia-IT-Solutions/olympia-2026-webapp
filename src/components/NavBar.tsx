import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { HStack, Button, Text, Image, Box, Flex } from '@chakra-ui/react';
import { FaChevronDown, FaSun, FaMoon } from 'react-icons/fa';
import logo from '../assets/milano-cortina-2026.gif';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { getCurrentUser, logout, Role } from '../logic/rights';
import { useTheme } from '../logic/theme';

// Styled-component for the main container
const NavContainer = styled.nav`
  background-color: var(--nav-bg);
  border-radius: 50px;
  padding: 10px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  max-width: 1400px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 100;
`;

export const NavBar = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [isSportsOpen, setIsSportsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Aktualisiere den User-Status bei Änderungen (z.B. nach Login/Logout)
    const handleStorageChange = () => setCurrentUser(getCurrentUser());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigate(`/${lang}/login`);
  };

  const currentLang = lang || i18n.language || 'de';
  
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
    navigate(`/${newLang}`);
    setIsOpen(false);
  };

  return (
    <NavContainer>
      {/* Left Side: Logo */}
      <Flex align="center">
        <Image 
          src={logo} 
          alt="Milano Cortina 2026" 
          height="60px" 
          objectFit="contain" 
          mr={8}
          cursor="pointer"
          onClick={() => navigate(`/${currentLang}`)}
        />
      </Flex>

      {/* Center: Countries and Sports */}
      <Flex align="center">
        <HStack gap={3}>
          <Button
            bg="#007f80"
            color="white"
            borderRadius="full"
            px={6}
            py={5}
            fontWeight="bold"
            _hover={{ bg: '#006666' }}
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
              _hover={{ bg: '#006666' }}
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
              _hover={{ bg: '#006666' }}
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
              _hover={{ bg: '#006666' }}
              onClick={() => navigate(`/${currentLang}/admin`)}
            >
              {t('nav.admin')}
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Right Side: Login and Language */}
      <Flex align="center">
        <HStack gap={3}>
          <Button
            bg="#007f80"
            color="white"
            borderRadius="full"
            px={6}
            py={5}
            fontWeight="bold"
            _hover={{ bg: '#006666' }}
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
            _hover={{ borderColor: '#ccc' }}
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
    </NavContainer>
  );
};
