import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Heading, Button, ButtonGroup } from '@chakra-ui/react'
import { FaChevronDown } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

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
    <Wrapper>
      <Video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay={!prefersReducedMotion}
        muted
        loop
        playsInline
        // disable controls and interaction so user can't stop easily
        controls={false}
        aria-hidden="true"
      />

      <Overlay>
        <Heading
          as="h1"
          size="4xl"
          color="white"
          style={{ fontFamily: "'MilanoCortina2026-Bold'", textShadow: '0 6px 18px rgba(0,0,0,0.6)', letterSpacing: '0.01em' }}
        >
          {title}
        </Heading>

        <ButtonGroup mt={6}>
          <CtaButton
            onClick={() => scrollToSection('disciplines')}
            colorScheme="teal"
            borderRadius="full"
            bg="#007f80"
            color="white"
            _hover={{ bg: '#006666' }}
          >
            <FaChevronDown style={{ marginRight: 8 }} />
            {t('hero.disciplines')}
          </CtaButton>

          <CtaButton
            onClick={() => scrollToSection('countries-feature')}
            colorScheme="teal"
            borderRadius="full"
            bg="#007f80"
            color="white"
            _hover={{ bg: '#006666' }}
          >
            <FaChevronDown style={{ marginRight: 8 }} />
            {t('hero.countries')}
          </CtaButton>
        </ButtonGroup>
      </Overlay>
    </Wrapper>
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

const Wrapper = styled.div`
  width: 90%;
  max-width: 1400px;
  margin: 24px auto;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  height: 800px;
  box-shadow: var(--ring-soft), 0 24px 52px rgba(0, 34, 45, 0.24);
  animation: ${heroReveal} var(--motion-slow) var(--motion-ease) both;

  &::after {
    content: '';
    position: absolute;
    inset: auto 0 0 0;
    height: 120px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0));
    z-index: 1;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    height: 360px;
    margin-top: 12px;
    margin-bottom: 12px;
  }
`

const Video = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.55) saturate(1.05);
  pointer-events: none; /* disable click -> pause */
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding-left: 3rem;
  padding-bottom: 3.5rem;
  z-index: 1;
  color: white;

  &::before {
    content: '';
    position: absolute;
    top: -15%;
    left: -10%;
    width: 60%;
    height: 70%;
    background: radial-gradient(circle, rgba(0, 127, 128, 0.24), rgba(0, 127, 128, 0));
    animation: ${sheenDrift} 7s ease-in-out infinite alternate;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    padding-left: 1.25rem;
    padding-bottom: 2rem;
  }
`

const CtaButton = styled(Button)`
  transition: transform var(--motion-fast) var(--motion-ease), box-shadow var(--motion-fast) var(--motion-ease), background-color var(--motion-fast) var(--motion-ease);
  box-shadow: 0 8px 20px rgba(0, 127, 128, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(0, 102, 102, 0.38);
  }
`
