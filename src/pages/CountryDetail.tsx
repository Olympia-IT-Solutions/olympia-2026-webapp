import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, Container, Heading, Button, HStack, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import { useMedalStore } from '../store/medals';
import { MedalDisplay } from '../components/MedalDisplay';
import { CountryFlag, DataTableState } from '../components/ui';
import { fetchAllCountries } from '../services/countries';

export function CountryDetail() {
  const { country, lang } = useParams<{ country: string; lang: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [countryId, setCountryId] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryLookupFailed, setCountryLookupFailed] = useState(false);
  
  const medals = useMedalStore((state) => state.medals);
  const loading = useMedalStore((state) => state.loading);
  const error = useMedalStore((state) => state.error);
  const fetchMedals = useMedalStore((state) => state.fetchMedals);

  useEffect(() => {
    let isActive = true;

    const resolveCountry = async () => {
      if (!country) {
        setCountryId(null);
        setCountryName(null);
        setCountryCode(null);
        setCountryLookupFailed(false);
        return;
      }

      setCountryLookupFailed(false);

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
        const resolvedCode = matchedCountry?.code ?? country;

        if (!isActive) {
          return;
        }

        setCountryId(resolvedId);
        setCountryName(resolvedName);
        setCountryCode(resolvedCode);
        fetchMedals(resolvedId);
      } catch {
        if (!isActive) {
          return;
        }

        setCountryId(null);
        setCountryName(null);
        setCountryCode(country);
        setCountryLookupFailed(true);
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
        <HStack mb={8} gap={4} align="center" wrap="wrap">
          <Button
            onClick={() => navigate(`/${lang}/countries`)}
            variant="outline"
            colorPalette="teal"
          >
            <Icon as={FaArrowLeft} mr={2} />
            {t('countryDetail.back')}
          </Button>
          <HStack gap={3} align="center" wrap="wrap">
            <CountryFlag countryCode={countryCode} w="1.75rem" />
            <Heading as="h1" size="2xl" color="var(--card-text)">
              {t('countryDetail.medalsTitle', { country: countryName ?? country?.toUpperCase() ?? '' })}
            </Heading>
          </HStack>
        </HStack>

        {/* Medal Display */}
        <Box bg="var(--card-bg)" borderRadius="xl" p={8} boxShadow="xl">
          {countryLookupFailed ? (
            <DataTableState
              tone="danger"
              message={t('countryDetail.countryLookupError')}
            />
          ) : (
            <MedalDisplay medals={countryMedals} loading={loading} error={error} country={countryName ?? country} />
          )}
        </Box>
      </Container>
    </Box>
  );
}
