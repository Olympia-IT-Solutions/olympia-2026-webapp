import { Box, Container } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { CountryTable } from '../components/CountryTable'
import { HeaderWithImage } from '../components/HeaderWithImage' 

export function Countries() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()

  const handleCountryClick = (country: string) => {
    navigate(`/${lang}/country/${country}`)
  }

  return (
    <Box p={10}>
      <Container maxW="container.xl">
        <HeaderWithImage imageUrl="https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/scfaxcnropsqb78f6fki" title={t('countries.title')} />
        <Box bg="var(--card-bg)" borderRadius="xl" p={6} color="var(--card-text)" boxShadow="xl">
          <CountryTable onCountryClick={handleCountryClick} />
        </Box> 
      </Container>
    </Box>
  )
}