import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, Container, Heading, Button, HStack, Icon } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useMedalStore } from '../store/medals';
import { MedalDisplay } from '../components/MedalDisplay';

export function CountryDetail() {
  const { country, lang } = useParams<{ country: string; lang: string }>();
  const navigate = useNavigate();
  
  const medals = useMedalStore((state) => state.medals);
  const loading = useMedalStore((state) => state.loading);
  const fetchMedals = useMedalStore((state) => state.fetchMedals);

  useEffect(() => {
    if (country) {
      fetchMedals(country);
    }
  }, [country, fetchMedals]);

  const countryMedals = country ? medals[country] || [] : [];

  return (
    <Box minH="100vh" bg="var(--bg)">
      <Container maxW="container.xl" py={10}>
        {/* Header with Back Button */}
        <HStack mb={8} gap={4}>
          <Button
            onClick={() => navigate(`/${lang}/countries`)}
            variant="outline"
            colorPalette="teal"
          >
            <Icon as={FaArrowLeft} mr={2} />
            Zurück
          </Button>
          <Heading as="h1" size="2xl" color="var(--card-text)">
            {country?.toUpperCase()} - Medaillen
          </Heading>
        </HStack>

        {/* Medal Display */}
        <Box bg="var(--card-bg)" borderRadius="xl" p={8} boxShadow="xl">
          <MedalDisplay medals={countryMedals} loading={loading} country={country} />
        </Box>
      </Container>
    </Box>
  );
}
