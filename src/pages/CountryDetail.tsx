import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, Container, Heading, Button, HStack, Icon } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useMedalStore } from '../store/medals';
import { MedalDisplay } from '../components/MedalDisplay';
import { fetchAllCountries } from '../services/countries';

export function CountryDetail() {
  const { country, lang } = useParams<{ country: string; lang: string }>();
  const navigate = useNavigate();
  const [countryId, setCountryId] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  
  const medals = useMedalStore((state) => state.medals);
  const loading = useMedalStore((state) => state.loading);
  const fetchMedals = useMedalStore((state) => state.fetchMedals);

  useEffect(() => {
    let isActive = true;

    const resolveCountry = async () => {
      if (!country) {
        setCountryId(null);
        setCountryName(null);
        return;
      }

      try {
        const countries = await fetchAllCountries();
        const normalizedCountry = country.trim().toLowerCase();
        const matchedCountry = countries.find((entry) => {
          const idMatch = String(entry.id) === country;
          const codeMatch = entry.code?.toLowerCase() === normalizedCountry;
          const nameMatch = entry.name.toLowerCase() === normalizedCountry;
          return idMatch || codeMatch || nameMatch;
        });

        const resolvedId = matchedCountry ? String(matchedCountry.id) : country;
        const resolvedName = matchedCountry?.name ?? country.toUpperCase();

        if (!isActive) {
          return;
        }

        setCountryId(resolvedId);
        setCountryName(resolvedName);
        fetchMedals(resolvedId);
      } catch {
        if (!isActive) {
          return;
        }

        setCountryId(country);
        setCountryName(country.toUpperCase());
        fetchMedals(country);
      }
    };

    void resolveCountry();

    return () => {
      isActive = false;
    };
  }, [country, fetchMedals]);

  const countryMedals = countryId ? medals[countryId] || [] : [];

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
            {countryName ?? country?.toUpperCase() ?? ''} - Medaillen
          </Heading>
        </HStack>

        {/* Medal Display */}
        <Box bg="var(--card-bg)" borderRadius="xl" p={8} boxShadow="xl">
          <MedalDisplay medals={countryMedals} loading={loading} country={countryName ?? country} />
        </Box>
      </Container>
    </Box>
  );
}
