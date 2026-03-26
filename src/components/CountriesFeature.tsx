import styled, { keyframes } from 'styled-components'
import { Heading } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import featureImg from '../assets/milano-cortina-2026.avif'

const drift = keyframes`
  from {
    transform: translate3d(-2%, 0, 0) scale(1.02);
  }
  to {
    transform: translate3d(2%, -1%, 0) scale(1.06);
  }
`;

const FeatureWrapper = styled.div`
  width: 90%;
  max-width: 1400px;
  margin: 24px auto;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 800px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--ring-soft), 0 18px 40px rgba(0, 28, 41, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.44);
  cursor: pointer;
  transition: transform var(--motion-fast) var(--motion-ease), box-shadow var(--motion-fast) var(--motion-ease);
  animation: fadeUpIn var(--motion-slow) var(--motion-ease) both;

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--ring-soft), 0 26px 50px rgba(0, 28, 41, 0.28);
  }

  @media (max-width: 768px) {
    height: 220px;
  }
`;

const Bg = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${featureImg});
  background-size: cover;
  background-position: center;
  filter: brightness(0.62) saturate(1.04);
  transform-origin: center;
  animation: ${drift} 9s ease-in-out infinite alternate;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding-left: 6rem;
  padding-bottom: 3rem;
  background:
    linear-gradient(to top, rgba(0, 20, 30, 0.46), rgba(0, 20, 30, 0.06)),
    radial-gradient(circle at 20% 90%, rgba(0, 127, 128, 0.22), transparent 46%);

  @media (max-width: 768px) {
    padding-left: 1.25rem;
    padding-bottom: 1rem;
  }
`;

export const CountriesFeature = ({ id }: { id?: string }) => {
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()
  const currentLang = lang || 'de'

  return (
    <FeatureWrapper>
      <Card id={id} onClick={() => navigate(`/${currentLang}/countries`)} role="link" aria-label={t('countries.featureAria')}>
        <Bg />
        <Overlay>
          <Heading
            as="h2"
            size="3xl"
            color="white"
            fontSize={{ base: '0.75rem', md: '1.75rem', lg: '2.5rem' }}
            mb="0.25rem"
            style={{ fontFamily: "'MilanoCortina2026-Bold'", textShadow: '0 6px 18px rgba(0,0,0,0.6)' }}
          >
            {t('countries.featureHeading')}
          </Heading>
        </Overlay>
      </Card>
    </FeatureWrapper>
  )
}
