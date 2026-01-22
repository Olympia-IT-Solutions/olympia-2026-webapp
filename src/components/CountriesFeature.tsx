import styled from 'styled-components'
import { Heading } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import featureImg from '../assets/milano-cortina-2026.avif'

const FeatureWrapper = styled.div`
  width: 90%;
  max-width: 1400px;
  margin: 24px auto;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 40px rgba(0,0,0,0.3);
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
  filter: brightness(0.6);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding-left: 6rem;

  @media (max-width: 768px) {
    padding-left: 1.25rem;
  }
`;

export const CountriesFeature = () => {
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()
  const currentLang = lang || 'de'

  return (
    <FeatureWrapper>
      <Card onClick={() => navigate(`/${currentLang}/countries`)} role="link" aria-label="Zur Länderübersicht">
        <Bg />
        <Overlay>
          <Heading
            as="h2"
            size="2xl"
            color="white"
            style={{ fontFamily: "'MilanoCortina2026-Bold'", textShadow: '0 6px 18px rgba(0,0,0,0.6)' }}
          >
            Die Länder bei Milano Cortina in der Übersicht
          </Heading>
        </Overlay>
      </Card>
    </FeatureWrapper>
  )
}
