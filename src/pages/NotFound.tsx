import { Box, Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'

export const NotFound = () => {
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()
  const currentLang = lang || 'de'

  return (
    <Box p={10} textAlign="center">
      <Heading mb={4}>Seite nicht gefunden</Heading>
      <Text mb={6}>Die von dir gesuchte Seite existiert nicht oder wurde verschoben.</Text>
      <Button colorScheme="teal" onClick={() => navigate(`/${currentLang}`)} mr={3}>Startseite</Button>
      <Button variant="outline" onClick={() => navigate(`/${currentLang}/countries`)}>Länderübersicht</Button>
    </Box>
  )
}
