import { Box, Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

export const NotFound = () => {
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()
  const currentLang = lang || 'de'

  return (
    <Box p={10} textAlign="center">
      <Heading mb={4}>{t('notfound.title')}</Heading>
      <Text mb={6}>{t('notfound.text')}</Text>
      <Button colorScheme="teal" onClick={() => navigate(`/${currentLang}`)} mr={3}>{t('notfound.home')}</Button>
      <Button variant="outline" onClick={() => navigate(`/${currentLang}/countries`)}>{t('notfound.countries')}</Button>
    </Box>
  )
}
