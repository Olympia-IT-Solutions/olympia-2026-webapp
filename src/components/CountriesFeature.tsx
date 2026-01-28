import styled from 'styled-components'
import { Heading } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import featureImg from '../assets/milano-cortina-2026.avif'

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
  align-items: flex-end;
  padding-left: 6rem;
  padding-bottom: 3rem;

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
