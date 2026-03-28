import { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import {
  HStack,
  Button,
  Text,
  Image,
  Box,
  Flex,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaChevronDown,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaGlobe,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaTrophy,
  FaSnowflake,
} from 'react-icons/fa';
import logo from '../assets/milano-cortina-2026.gif';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router';
import { getCurrentUser, logout, Role } from '../logic/rights';
import { useTheme } from '../logic/theme';
import { CTAButton } from './ui';

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

const focusVisibleRing = {
  outline: '2px solid',
  outlineColor: 'accent',
  outlineOffset: '2px',
};

const desktopActionButtonProps = {
  ctaVariant: 'solid' as const,
  h: '44px',
  px: 5,
  fontSize: 'sm',
  fontWeight: 'semibold',
  letterSpacing: '0.01em',
  transition: 'all var(--motion-interactive) var(--motion-ease-interactive)',
  _hover: {
    bg: 'accent-strong',
    transform: 'translateY(-2px)',
    boxShadow: 'ring-soft',
  },
  _focusVisible: focusVisibleRing,
};

const listItemButtonProps = {
  variant: 'ghost' as const,
  justifyContent: 'flex-start',
  w: '100%',
  minH: '48px',
  borderRadius: 'xl',
  px: 3,
  color: 'text',
  transition: 'all var(--motion-interactive) var(--motion-ease-interactive)',
  _hover: {
    bg: 'hover-bg',
    color: 'accent',
  },
  _focusVisible: focusVisibleRing,
};

const mobileSectionLabelProps = {
  fontSize: 'xs',
  fontWeight: 'semibold',
  textTransform: 'uppercase',
  color: 'text-muted',
  letterSpacing: '0.08em',
  mb: 2,
};

export const NavBar = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [isSportsOpen, setIsSportsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const { theme, toggleTheme } = useTheme();
  const { open: isMobileOpen, onOpen: onMobileOpen, onClose: onMobileClose } = useDisclosure();
  const location = useLocation();

  const languages: Record<string, string> = {
    de: 'Deutsch',
    en: 'English',
    fr: 'Français',
    it: 'Italiano',
  };

  const supportedLanguageCodes = Object.keys(languages);
  const detectedLang = lang || i18n.resolvedLanguage || i18n.language || 'de';
  const normalizedDetectedLang = detectedLang.split('-')[0];
  const safeLang = supportedLanguageCodes.includes(normalizedDetectedLang)
    ? normalizedDetectedLang
    : 'de';

  useEffect(() => {
    // Aktualisiere den User-Status bei Änderungen (z.B. nach Login/Logout)
    const handleStorageChange = () => setCurrentUser(getCurrentUser());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const handleEscapeClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onMobileClose();
      }
    };

    window.addEventListener('keydown', handleEscapeClose);
    return () => window.removeEventListener('keydown', handleEscapeClose);
  }, [isMobileOpen, onMobileClose]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    onMobileClose();
    navigate(`/${safeLang}/login`);
  };

  const currentLang = safeLang;

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
    <Box
      as="nav"
      bg="nav-bg"
      borderRadius={{ base: '16px', md: '50px' }}
      py={{ base: 2, md: '10px' }}
      px={{ base: 3, md: 5 }}
      boxShadow="var(--ring-soft), 0 10px 30px rgba(0, 28, 41, 0.14)"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      w={{ base: '100%', md: '95%' }}
      maxW="1400px"
      mx="auto"
      backdropFilter="blur(12px)"
      border="1px solid"
      borderColor="border"
      position="relative"
      zIndex={100}
      animation={`${navIn} var(--motion-enter) var(--motion-ease-interactive) both`}
      transition="transform var(--motion-interactive) var(--motion-ease-interactive), box-shadow var(--motion-interactive) var(--motion-ease-interactive)"
      _hover={{
        transform: 'translateY(-1px)',
        boxShadow: 'var(--ring-soft), 0 14px 36px rgba(0, 28, 41, 0.18)',
      }}
    >
      {/* Left Side: Logo + Mobile Burger */}
      <Flex align="center">
        <Button
          variant="ghost"
          onClick={() => navigate(`/${currentLang}`)}
          aria-label="Go to homepage"
          p={0}
          minW="unset"
          h="auto"
          mr={4}
          borderRadius="md"
          transition="transform var(--motion-interactive) var(--motion-ease-interactive)"
          _hover={{ transform: 'scale(1.03)', bg: 'transparent' }}
          _focusVisible={focusVisibleRing}
        >
          <Image
            src={logo}
            alt="Milano Cortina 2026"
            height="60px"
            objectFit="contain"
          />
        </Button>

        {/* Mobile burger button (visible on small screens) */}
        <Button
          aria-label={t('nav.openMenu')}
          display={{ base: 'inline-flex', md: 'none' }}
          onClick={onMobileOpen}
          size="md"
          ml={2}
          variant="ghost"
          minW="44px"
          minH="44px"
          borderRadius="full"
          color="text"
          transition="background-color var(--motion-interactive) var(--motion-ease-interactive), color var(--motion-interactive) var(--motion-ease-interactive)"
          _hover={{ bg: 'hover-bg' }}
          _focusVisible={focusVisibleRing}
        >
          <Icon as={FaBars} boxSize={4} />
        </Button>
      </Flex>

      {/* Center: Countries and Sports (hidden on small screens) */}
      <Flex align="center" display={{ base: 'none', md: 'flex' }}>
        <HStack gap={3}>
          <CTAButton {...desktopActionButtonProps} onClick={() => navigate(`/${currentLang}/countries`)}>
            {t('nav.countries')}
          </CTAButton>

          <Box position="relative">
            <CTAButton
              {...desktopActionButtonProps}
              px={4}
              aria-expanded={isSportsOpen}
              aria-haspopup="menu"
              onClick={() => setIsSportsOpen(!isSportsOpen)}
            >
              <HStack gap={2}>
                <Text fontWeight="semibold" fontSize="sm">
                  {t('nav.sports')}
                </Text>
                <Icon as={FaChevronDown} boxSize={2.5} />
              </HStack>
            </CTAButton>
            
            {isSportsOpen && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                mt={2}
                bg="surface"
                borderRadius="xl"
                boxShadow="lg"
                py={2}
                minW="160px"
                zIndex={200}
                overflow="hidden"
                border="1px solid"
                borderColor="border"
                style={{ animation: 'fadeUpIn var(--motion-enter) var(--motion-ease-interactive)' }}
              >
                {Object.entries(sports).map(([key, label]) => (
                  <Button
                    key={key}
                    {...listItemButtonProps}
                    minH="40px"
                    borderRadius="none"
                    onClick={() => {
                      navigate(`/${currentLang}/sports/${key}`);
                      setIsSportsOpen(false);
                    }}
                  >
                    <Text fontSize="sm" fontWeight="medium">
                      {label}
                    </Text>
                  </Button>
                ))}
              </Box>
            )} 
          </Box>

          {currentUser && (
            <CTAButton {...desktopActionButtonProps} onClick={() => navigate(`/${currentLang}/dashboard`)}>
              {t('nav.dashboard')}
            </CTAButton>
          )}

          {currentUser?.role === Role.Admin && (
            <CTAButton {...desktopActionButtonProps} onClick={() => navigate(`/${currentLang}/admin`)}>
              {t('nav.admin')}
            </CTAButton>
          )}
        </HStack>
      </Flex>

      {/* Right Side: Desktop only */}
      <Flex align="center" display={{ base: 'none', md: 'flex' }}>
        <HStack gap={3}>
          <CTAButton
            {...desktopActionButtonProps}
            onClick={currentUser ? handleLogout : () => navigate(`/${currentLang}/login`)}
          >
            {currentUser ? t('nav.logout') : t('nav.login')}
          </CTAButton>

          <CTAButton
            ctaVariant="subtle"
            aria-label={theme === 'light' ? t('nav.darkMode') : t('nav.lightMode')}
            h="44px"
            px={3.5}
            border="1px solid"
            borderColor="border"
            color="text"
            _hover={{ bg: 'hover-bg', borderColor: 'border-hover', transform: 'translateY(-2px)' }}
            _focusVisible={focusVisibleRing}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Icon as={FaMoon} boxSize={4} /> : <Icon as={FaSun} boxSize={4} />}
          </CTAButton>

          <Box position="relative">
            <Button
              bg="surface"
              color="text"
              borderRadius="full"
              px={4}
              h="44px"
              cursor="pointer"
              border="1px solid"
              borderColor="border"
              boxShadow="sm"
              transition="all var(--motion-interactive) var(--motion-ease-interactive)"
              _hover={{ borderColor: 'border-hover', bg: 'hover-bg' }}
              _focusVisible={focusVisibleRing}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <HStack gap={2}>
                <Text fontWeight="semibold" fontSize="sm" color="text">
                  {languages[currentLang] || 'Deutsch'}
                </Text>
                <Icon as={FaChevronDown} boxSize={2.5} />
              </HStack>
            </Button>
            
            {isOpen && (
              <Box
                position="absolute"
                top="100%"
                right="0"
                mt={2}
                bg="surface"
                borderRadius="xl"
                boxShadow="lg"
                py={2}
                minW="160px"
                zIndex={200}
                overflow="hidden"
                border="1px solid"
                borderColor="border"
                style={{ animation: 'fadeUpIn var(--motion-enter) var(--motion-ease-interactive)' }}
              >
                {Object.entries(languages).map(([code, label]) => (
                  <Button
                    key={code}
                    {...listItemButtonProps}
                    minH="40px"
                    borderRadius="none"
                    onClick={() => handleLanguageChange(code)}
                  >
                    <Text fontSize="sm" fontWeight={currentLang === code ? 'semibold' : 'normal'}>
                      {label}
                    </Text>
                  </Button>
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
          bg="blackAlpha.500"
          backdropFilter="blur(3px)"
          zIndex={12000}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {isMobileOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          h="100vh"
          w={{ base: '100vw', md: '72%' }}
          maxW={{ base: 'none', md: '360px' }}
          bg="surface"
          zIndex={12001}
          boxShadow="2xl"
          px={5}
          pt="calc(1.25rem + env(safe-area-inset-top, 0px))"
          pb="calc(1.25rem + env(safe-area-inset-bottom, 0px))"
          overflowY="auto"
          borderTopRightRadius={{ base: '0', md: '3xl' }}
          borderBottomRightRadius={{ base: '0', md: '3xl' }}
          borderRight="1px solid"
          borderColor="border"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
          style={{
            height: '100dvh',
            animation: 'fadeUpIn var(--motion-enter) var(--motion-ease-interactive)',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Flex
            justify="space-between"
            align="center"
            mb={5}
            position="sticky"
            top="0"
            bg="surface"
            zIndex={1}
            py={2}
          >
            <HStack>
              <Image src={logo} alt="logo" height="40px" objectFit="contain" />
              <Text id="mobile-nav-title" fontWeight="bold" fontSize="lg" color="text">
                {t('nav.menuTitle')}
              </Text>
            </HStack>
            <Button
              variant="ghost"
              onClick={onMobileClose}
              aria-label={t('nav.closeMenu')}
              borderRadius="full"
              minW="44px"
              minH="44px"
              transition="background-color var(--motion-interactive) var(--motion-ease-interactive), color var(--motion-interactive) var(--motion-ease-interactive)"
              _hover={{ bg: 'hover-bg' }}
              _focusVisible={focusVisibleRing}
            >
              <Icon as={FaTimes} boxSize={4} />
            </Button>
          </Flex>

          <Box mb={4}>
            <Text {...mobileSectionLabelProps}>
              {t('nav.countries')}
            </Text>
            <Button
              {...listItemButtonProps}
              onClick={() => {
                navigate(`/${currentLang}/countries`);
                onMobileClose();
              }}
            >
              <HStack gap={3}>
                <Icon as={FaGlobe} boxSize={4} />
                <Text>{t('nav.countries')}</Text>
              </HStack>
            </Button>
          </Box>

          <Box mb={4}>
            <Text {...mobileSectionLabelProps}>
              {t('nav.sports')}
            </Text>
            <Box>
              {Object.entries(sports).map(([key, label]) => (
                <Button
                  key={key}
                  {...listItemButtonProps}
                  onClick={() => {
                    navigate(`/${currentLang}/sports/${key}`);
                    onMobileClose();
                  }}
                >
                  <HStack gap={3}>
                    <Icon as={FaSnowflake} boxSize={4} />
                    <Text>{label}</Text>
                  </HStack>
                </Button>
              ))}
            </Box>
          </Box>

          <Box borderTop="1px solid" borderColor="border" pt={4} mb={4}>
            {currentUser ? (
              <Button {...listItemButtonProps} onClick={handleLogout}>
                <HStack gap={3}><Icon as={FaSignOutAlt} boxSize={4} /><Text>{t('nav.logout')}</Text></HStack>
              </Button>
            ) : (
              <Button
                {...listItemButtonProps}
                onClick={() => {
                  navigate(`/${currentLang}/login`);
                  onMobileClose();
                }}
              >
                <HStack gap={3}><Icon as={FaSignInAlt} boxSize={4} /><Text>{t('nav.login')}</Text></HStack>
              </Button>
            )}

            {currentUser && (
              <Button
                {...listItemButtonProps}
                onClick={() => {
                  navigate(`/${currentLang}/dashboard`);
                  onMobileClose();
                }}
              >
                <HStack gap={3}><Icon as={FaUser} boxSize={4} /><Text>{t('nav.dashboard')}</Text></HStack>
              </Button>
            )}

            {currentUser?.role === Role.Admin && (
              <Button
                {...listItemButtonProps}
                onClick={() => {
                  navigate(`/${currentLang}/admin`);
                  onMobileClose();
                }}
              >
                <HStack gap={3}><Icon as={FaTrophy} boxSize={4} /><Text>{t('nav.admin')}</Text></HStack>
              </Button>
            )}
          </Box>

          <Box borderTop="1px solid" borderColor="border" pt={4}>
            <Button
              {...listItemButtonProps}
              onClick={() => {
                toggleTheme();
              }}
            >
              <HStack gap={3}>
                {theme === 'light' ? <Icon as={FaMoon} boxSize={4} /> : <Icon as={FaSun} boxSize={4} />}
                <Text>{theme === 'light' ? t('nav.darkMode') : t('nav.lightMode')}</Text>
              </HStack>
            </Button>

            <Box mt={3}>
              <Text {...mobileSectionLabelProps}>
                {t('nav.language')}
              </Text>
              {Object.entries(languages).map(([code, label]) => (
                <Button
                  key={code}
                  variant={currentLang === code ? 'solid' : 'ghost'}
                  bg={currentLang === code ? 'accent' : 'transparent'}
                  color={currentLang === code ? 'neutral.0' : 'text'}
                  w="100%"
                  mb={1}
                  minH="46px"
                  borderRadius="xl"
                  justifyContent="space-between"
                  transition="all var(--motion-interactive) var(--motion-ease-interactive)"
                  _hover={
                    currentLang === code
                      ? { bg: 'accent-strong' }
                      : { bg: 'hover-bg', color: 'accent' }
                  }
                  _focusVisible={focusVisibleRing}
                  onClick={() => handleLanguageChange(code)}
                >
                  <Text>{label}</Text>
                  {currentLang === code ? <Icon as={FaChevronDown} boxSize={3} /> : null}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
