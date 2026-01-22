import { Box, Container } from '@chakra-ui/react'
import { CountryTable } from '../components/CountryTable'
import { HeaderWithImage } from '../components/HeaderWithImage' 

export function Countries() {
  return (
    <Box p={10}>
      <Container maxW="container.xl">
        <HeaderWithImage imageUrl="https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/scfaxcnropsqb78f6fki" title="Länderübersicht" />
        <Box bg="white" borderRadius="xl" p={6} color="black" boxShadow="xl">
          <CountryTable />
        </Box>
      </Container>
    </Box>
  )
}