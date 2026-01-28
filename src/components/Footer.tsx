import { Box, Container, Flex, Image, Text } from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import logo from '../assets/milano-cortina-2026.gif'
import olympiaLogo from '../assets/olympia_it_solution.png'

export const Footer = () => {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()

  return (
    <Box bg="#005f6b" color="white" py={6} mt="auto">
      <Container maxW="container.xl">
        <Flex align="center" justify={{ base: 'center', md: 'space-between' }} wrap="wrap" gap={6}>

          {/* Logos */}
          <Flex align="center" gap={4}>
            <Image src={logo} alt="Milano Cortina 2026" maxW="120px" filter="brightness(0) invert(1)" />
            <Image src={olympiaLogo} alt="Olympia IT Solutions" maxW="120px" filter="brightness(0) invert(1)" />
          </Flex>

          {/* Links */}
          <Flex gap={{ base: 4, md: 8 }} align="center" wrap="wrap">
            <RouterLink to={`/${lang}/cookie-policy`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text _hover={{ color: 'gray.300' }}>{t('footer.cookiePolicy')}</Text>
            </RouterLink>
            <RouterLink to={`/${lang}/privacy-policy`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text _hover={{ color: 'gray.300' }}>{t('footer.privacyPolicy')}</Text>
            </RouterLink>
            <RouterLink to={`/${lang}/terms-of-service`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text _hover={{ color: 'gray.300' }}>{t('footer.termsOfService')}</Text>
            </RouterLink>
            <RouterLink to={`/${lang}/accessibility`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text _hover={{ color: 'gray.300' }}>{t('footer.accessibility')}</Text>
            </RouterLink>
          </Flex>

          {/* Copyright */}
          <Text fontSize="sm" opacity={0.9}>Copyright 2026. All rights reserved</Text>

        </Flex>
      </Container>
    </Box>
  )
}
