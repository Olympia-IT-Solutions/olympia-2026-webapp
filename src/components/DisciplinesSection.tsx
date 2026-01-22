import { Box, SimpleGrid, Text, Image, Flex, Heading } from '@chakra-ui/react';
import { Link, useParams } from 'react-router';

const disciplines = [
  { id: 'biathlon', name: 'Biathlon', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/BTH.svg' },
  { id: 'bobsport', name: 'Bob', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/BOB.svg' },
  { id: 'curling', name: 'Curling', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/CUR.svg' },
  { id: 'eishockey', name: 'Eishockey', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/IHO.svg' },
  { id: 'eiskunstlauf', name: 'Eiskunstlauf', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/FSK.svg' },
  { id: 'skilanglauf', name: 'Skilanglauf', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/CCS.svg' },
  { id: 'skispringen', name: 'Skispringen', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/SJP.svg' },
];

export const DisciplinesSection = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'de';

  return (
    <Box width="90%" maxW="1200px" mx="auto" my={12}>
      <Heading as="h2" size="xl" mb={6} textAlign="left" color="teal.800">
        Die Disziplinen
      </Heading>
      
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
        {disciplines.map((sport) => (
          <Link key={sport.id} to={`/${currentLang}/sports/${sport.id}`} style={{ textDecoration: 'none' }}>
            <Box 
              bg="white" 
              borderRadius="xl" 
              overflow="hidden" 
              boxShadow="md" 
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
            >
              <Box height="200px" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
                <Image
                  src={sport.img}
                  alt={sport.name}
                  objectFit="contain"
                  width="100%"
                  height="100%"
                  objectPosition="center"
                />
              </Box>

              <Flex align="center" p={4}>
                <Text fontWeight="bold" fontSize="lg" color="gray.800">
                  {sport.name}
                </Text>
              </Flex>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};
