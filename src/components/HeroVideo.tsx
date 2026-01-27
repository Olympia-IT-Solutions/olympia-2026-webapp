import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Heading, Button, ButtonGroup } from '@chakra-ui/react'
import { FaChevronDown } from 'react-icons/fa'

const VIDEO_SRC = 'https://img.olympics.com/s1/video/t_o_vod_mc_16-9_dev-auto/emvod/DrLv0dCxtXCMJ9MFoKOW6uOaDV5XegtG'

export const HeroVideo = ({ title }: { title?: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const tryPlay = () => {
      v.play().catch(() => {})
    }

    const onPause = () => tryPlay()
    const onContext = (e: Event) => e.preventDefault()
    const onVisibility = () => {
      if (!document.hidden) tryPlay()
    }

    v.addEventListener('pause', onPause)
    v.addEventListener('contextmenu', onContext)
    document.addEventListener('visibilitychange', onVisibility)

    // Ensure playback starts
    tryPlay()

    return () => {
      v.removeEventListener('pause', onPause)
      v.removeEventListener('contextmenu', onContext)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <Wrapper>
      <Video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
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
          style={{ fontFamily: "'MilanoCortina2026-Bold'", textShadow: '0 6px 18px rgba(0,0,0,0.6)' }}
        >
          {title}
        </Heading>

        <ButtonGroup mt={6}>
          <Button
            onClick={() => document.getElementById('disciplines')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            colorScheme="teal"
            borderRadius="full"
            bg="#007f80"
            color="white"
            _hover={{ bg: '#006666' }}
          >
            <FaChevronDown style={{ marginRight: 8 }} />
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
            <FaChevronDown style={{ marginRight: 8 }} />
            Die Länder
          </Button>
        </ButtonGroup>
      </Overlay>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 90%;
  max-width: 1400px;
  margin: 24px auto;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  height: 520px;

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
  filter: brightness(0.5);
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

  @media (max-width: 768px) {
    padding-left: 1.25rem;
    padding-bottom: 2rem;
  }
`
