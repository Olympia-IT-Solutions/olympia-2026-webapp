import { Box, Heading } from '@chakra-ui/react'
import { isAdmin } from '../logic/rights'

export function Admin() {
  if (!isAdmin()) {
    return (
      <Box p={10} textAlign="center" color="white">
        <Heading>Zugriff verweigert</Heading>
        <p>Sie haben keine Berechtigung, diese Seite zu betreten.</p>
      </Box>
    )
  }

  return (
    <Box p={10} textAlign="center" color="white">
      <Heading>Admin Page</Heading>
    </Box>
  )
}
