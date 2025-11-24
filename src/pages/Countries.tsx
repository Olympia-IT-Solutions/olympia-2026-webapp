import { Box, Heading, Container } from '@chakra-ui/react'
import { CountryTable } from '../components/CountryTable'

export function Countries() {
  return (
    <Box p={10} color="white">
      <Container maxW="container.xl">
        <Heading mb={6} textAlign="center">Countries</Heading>
        <Box bg="white" borderRadius="xl" p={6} color="black" boxShadow="xl">
          <CountryTable />
        </Box>
      </Container>
    </Box>
  )
}