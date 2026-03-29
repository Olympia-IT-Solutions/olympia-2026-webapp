import { Box, Container, Flex, Image, Link, Text } from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import logo from '../assets/milano-cortina-2026.gif'
import olympiaLogo from '../assets/olympia_it_solution.png'

const footerLinkStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  px: 2,
  py: 1,
  borderRadius: 'md',
  color: 'neutral.0',
  fontSize: 'sm',
  fontWeight: 'medium',
  lineHeight: '1.35',
  textDecoration: 'none',
  transition: 'all var(--motion-fast) var(--motion-ease)',
  _hover: {
    color: 'accent',
    bg: 'hover-bg',
    textDecoration: 'none',
  },
  _focusVisible: {
    outline: '2px solid',
    outlineColor: 'accent',
    outlineOffset: '2px',
  },
}

export const Footer = () => {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()

  return (
    <Box
      as="footer"
      bg="ice.700"
      color="neutral.0"
      py={{ base: 8, md: 10 }}
      mt="auto"
      borderTop="1px solid"
      borderColor="accent"
    >
      <Container maxW="container.xl">
        <Flex align="center" justify={{ base: 'center', md: 'space-between' }} wrap="wrap" gap={{ base: 5, md: 7 }}>

          {/* Logos */}
          <Flex align="center" gap={4}>
            <Image src={logo} alt={t('footer.milanoLogoAlt')} maxW="120px" filter="brightness(0) invert(1)" />
            <Image src={olympiaLogo} alt={t('footer.olympiaLogoAlt')} maxW="120px" filter="brightness(0) invert(1)" />
          </Flex>

          {/* Links */}
          <Flex gap={{ base: 2, md: 4 }} align="center" wrap="wrap">
            <Link
              {...footerLinkStyles}
              asChild
            >
              <RouterLink to={`/${lang}/cookie-policy`}>{t('footer.cookiePolicy')}</RouterLink>
            </Link>
            <Link
              {...footerLinkStyles}
              asChild
            >
              <RouterLink to={`/${lang}/privacy-policy`}>{t('footer.privacyPolicy')}</RouterLink>
            </Link>
            <Link
              {...footerLinkStyles}
              asChild
            >
              <RouterLink to={`/${lang}/terms-of-service`}>{t('footer.termsOfService')}</RouterLink>
            </Link>
            <Link
              {...footerLinkStyles}
              asChild
            >
              <RouterLink to={`/${lang}/accessibility`}>{t('footer.accessibility')}</RouterLink>
            </Link>
          </Flex>

          {/* Copyright */}
          <Text fontSize="sm" color="text-muted">{t('footer.copyright')}</Text>

        </Flex>
      </Container>
    </Box>
  )
}
