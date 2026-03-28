import { useEffect, useRef, useState } from 'react'
import { keyframes } from '@emotion/react'
import { Box, ButtonGroup, HStack, Icon, chakra } from '@chakra-ui/react'
import { FaChevronDown } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { CTAButton, SectionHeading } from './ui'

const VIDEO_SRC = 'https://img.olympics.com/s1/video/t_o_vod_mc_16-9_dev-auto/emvod/DrLv0dCxtXCMJ9MFoKOW6uOaDV5XegtG'

const getInitialPrefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const HeroVideo = ({ title }: { title?: string }) => {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialPrefersReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
    }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    if (prefersReducedMotion) {
      v.pause()
    }

    const tryPlay = () => {
      v.play().catch(() => {})
    }

    const onPause = () => tryPlay()
    const onContext = (e: Event) => e.preventDefault()
    const onVisibility = () => {
      if (!document.hidden) tryPlay()
    }

    v.addEventListener('contextmenu', onContext)
    if (!prefersReducedMotion) {
      v.addEventListener('pause', onPause)
      document.addEventListener('visibilitychange', onVisibility)
      // Ensure playback starts only when motion is allowed.
      tryPlay()
    }

    return () => {
      if (!prefersReducedMotion) {
        v.removeEventListener('pause', onPause)
        document.removeEventListener('visibilitychange', onVisibility)
      }
      v.removeEventListener('contextmenu', onContext)
    }
  }, [prefersReducedMotion])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <Box
      w="90%"
      maxW="1400px"
      my={{ base: '12px', md: 'var(--chakra-spacing-section)' }}
      mx="auto"
      borderRadius="3xl"
      overflow="hidden"
      position="relative"
      h={{ base: '360px', md: '800px' }}
      boxShadow="var(--ring-soft), 0 24px 52px rgba(0, 34, 45, 0.24)"
      animation={prefersReducedMotion ? 'none' : `${heroReveal} var(--motion-enter) var(--motion-ease-interactive) both`}
      _after={{
        content: '""',
        position: 'absolute',
        inset: 'auto 0 0 0',
        h: '120px',
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0))',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <chakra.video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay={!prefersReducedMotion}
        muted
        loop
        playsInline
        // disable controls and interaction so user can't stop easily
        controls={false}
        aria-hidden="true"
        position="absolute"
        inset="0"
        w="100%"
        h="100%"
        objectFit="cover"
        filter="brightness(0.55) saturate(1.05)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        inset="0"
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="flex-start"
        pl={{ base: 5, md: 12 }}
        pb={{ base: 8, md: 14 }}
        zIndex={1}
        color="white"
        _before={{
          content: '""',
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          w: '60%',
          h: '70%',
          background: 'radial-gradient(circle, rgba(0, 127, 128, 0.24), rgba(0, 127, 128, 0))',
          animation: prefersReducedMotion
            ? 'none'
            : `${sheenDrift} var(--motion-ornament) var(--motion-ease-gentle) infinite alternate`,
          pointerEvents: 'none',
        }}
      >
        <Box position="relative" zIndex={2}>
          <SectionHeading
            as="h1"
            tone="inverse"
            fontSize={{ base: '3xl', md: '5xl' }}
            maxW={{ base: '20ch', md: '16ch' }}
            style={{ textShadow: '0 6px 18px rgba(0,0,0,0.6)', letterSpacing: '0.01em' }}
          >
            {title}
          </SectionHeading>

          <ButtonGroup mt={{ base: 5, md: 6 }} gap={3} flexWrap="wrap">
            <CTAButton
              onClick={() => scrollToSection('disciplines')}
              h={{ base: '44px', md: '48px' }}
              px={{ base: 4, md: 5 }}
              fontWeight="semibold"
              boxShadow="ring-soft"
              _hover={{ bg: 'accent-strong', transform: 'translateY(-2px)', boxShadow: 'ring-soft' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'accent',
                outlineOffset: '2px',
              }}
            >
              <HStack gap={2}>
                <Icon as={FaChevronDown} boxSize={3.5} />
                <Box as="span">{t('hero.disciplines')}</Box>
              </HStack>
            </CTAButton>

            <CTAButton
              onClick={() => scrollToSection('countries-feature')}
              h={{ base: '44px', md: '48px' }}
              px={{ base: 4, md: 5 }}
              fontWeight="semibold"
              boxShadow="ring-soft"
              _hover={{ bg: 'accent-strong', transform: 'translateY(-2px)', boxShadow: 'ring-soft' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'accent',
                outlineOffset: '2px',
              }}
            >
              <HStack gap={2}>
                <Icon as={FaChevronDown} boxSize={3.5} />
                <Box as="span">{t('hero.countries')}</Box>
              </HStack>
            </CTAButton>
          </ButtonGroup>
        </Box>
      </Box>
    </Box>
  )
}

const heroReveal = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 26px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

const sheenDrift = keyframes`
  0% {
    transform: translateX(-18%);
  }
  100% {
    transform: translateX(18%);
  }
`
