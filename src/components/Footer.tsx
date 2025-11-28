import { Box, Container, SimpleGrid, Stack, Text, Link, Image, Flex, Heading, Icon } from '@chakra-ui/react'
import { FaGooglePlay, FaApple } from 'react-icons/fa'
import logo from '../assets/milano-cortina-2026.gif'

export const Footer = () => {
  return (
    <Box bg="#005f6b" color="white" py={10} mt="auto">
        {/* Partner Logos Section */}
        <Container maxW="container.xl" mb={10}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={8} opacity={0.9}>
                 <Heading size="md">Deloitte.</Heading>
                 <Heading size="md">OMEGA</Heading>
                 <Heading size="md">P&G</Heading>
                 <Heading size="md">SAMSUNG</Heading>
                 <Heading size="md">TCL</Heading>
                 <Heading size="md">VISA</Heading>
            </Flex>
        </Container>

        <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} gap={8}>
                {/* Logo and App Links */}
                <Stack gap={6}>
                    <Box>
                         <Image src={logo} alt="Milano Cortina 2026" maxW="120px" filter="brightness(0) invert(1)" />
                    </Box>
                    <Link href="#" _hover={{ textDecoration: 'none', color: 'gray.300' }}>
                        Switch to Paralympic Games →
                    </Link>
                    <Box>
                        <Text mb={2} fontSize="sm">Download the Official App</Text>
                        <Flex gap={2}>
                            <Link href="#" bg="black" p={2} borderRadius="md" alignItems="center" gap={2} border="1px solid white" _hover={{ bg: 'gray.800', textDecoration: 'none' }} display="flex">
                                <Icon as={FaGooglePlay} boxSize={5} />
                                <Box lineHeight="1">
                                    <Text fontSize="xs">GET IT ON</Text>
                                    <Text fontSize="sm" fontWeight="bold">Google Play</Text>
                                </Box>
                            </Link>
                            <Link href="#" bg="black" p={2} borderRadius="md" alignItems="center" gap={2} border="1px solid white" _hover={{ bg: 'gray.800', textDecoration: 'none' }} display="flex">
                                <Icon as={FaApple} boxSize={5} />
                                <Box lineHeight="1">
                                    <Text fontSize="xs">Download on the</Text>
                                    <Text fontSize="sm" fontWeight="bold">App Store</Text>
                                </Box>
                            </Link>
                        </Flex>
                    </Box>
                </Stack>

                {/* Columns */}
                <Stack align={'flex-start'} fontSize="sm">
                    <Heading as="h4" size="sm" mb={2}>The Games</Heading>
                    <Link href={'#'}>Schedule</Link>
                    <Link href={'#'}>Sports</Link>
                    <Link href={'#'}>Territories</Link>
                    <Link href={'#'}>Venues</Link>
                    <Link href={'#'}>Road to 2026</Link>
                    <Link href={'#'}>Olympic Torch Relay</Link>
                </Stack>

                <Stack align={'flex-start'} fontSize="sm">
                    <Heading as="h4" size="sm" mb={2}>Join the Games</Heading>
                    <Link href={'#'}>Fan26</Link>
                    <Link href={'#'}>Italia dei Giochi</Link>
                    <Link href={'#'}>Become a Partner</Link>
                    <Link href={'#'}>Become an Impact Provider</Link>
                    <Link href={'#'}>Become a Licensee</Link>
                </Stack>

                <Stack align={'flex-start'} fontSize="sm">
                    <Heading as="h4" size="sm" mb={2}>About us</Heading>
                    <Link href={'#'}>About Milano Cortina 2026</Link>
                    <Link href={'#'}>Board of Directors</Link>
                    <Link href={'#'}>Athletes' Commission CAT26</Link>
                    <Link href={'#'}>The Italian Spirit</Link>
                    <Link href={'#'}>Mascots</Link>
                    <Link href={'#'}>The Look of the Games</Link>
                    <Link href={'#'}>The Medals</Link>
                </Stack>

                 <Stack align={'flex-start'} fontSize="sm">
                    <Heading as="h4" size="sm" mb={2}>Our Projects</Heading>
                    <Link href={'#'}>Explore Projects</Link>
                    <Link href={'#'}>Label Gen26</Link>
                    <Link href={'#'}>Overview</Link>
                </Stack>
            </SimpleGrid>
        </Container>
    </Box>
  )
}
