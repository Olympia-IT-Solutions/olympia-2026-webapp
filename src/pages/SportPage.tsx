import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { Box, Heading, Text, Container } from '@chakra-ui/react';
import { SportsTable } from '../components/SportsTable';
import { HeaderWithImage } from '../components/HeaderWithImage';
import { useTranslation } from 'react-i18next';
import { getCurrentUser } from '../logic/rights';
import { useSportsStore } from '../store/sports';
import { useResultsStore } from '../store/results';
import { getSportTranslationKey, type SportTranslationKey } from '../services/sports';

// Dummy data store - in a real app this would come from an API
const sportsData: Record<SportTranslationKey, { imageUrl: string }> = {
  biathlon: {
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/li2dbi5btvf36tlxfxxl',
  },
  bobsport: {
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/vsczhylqdcucby3b6fa7',
  },
  curling: {
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/e8v1pgmj4awck8lbjm66',
  },
  eishockey: {
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/hfkjz7khdzopldgfr1p9',
  },
  eiskunstlauf: {
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/lpmywgwi56i6c1ltnf1o',
  },
  skilanglauf: {
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/avjcz7wgesxj1wi77oej',
  },
  skispringen: {
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/sunaotnj4ykrmdcagmdi',
  }
};

const sportMeasurementTypes: Record<SportTranslationKey, 'time' | 'score' | 'points'> = {
  biathlon: 'time',
  bobsport: 'time',
  curling: 'score',
  eishockey: 'score',
  eiskunstlauf: 'points',
  skilanglauf: 'time',
  skispringen: 'points',
};

export function SportPage() {
  const { sportId } = useParams<{ sportId: string }>();
  const { t } = useTranslation();
  const currentUser = getCurrentUser();
  
  const sports = useSportsStore((state) => state.sports);
  const results = useResultsStore((state) => state.results);
  const loading = useResultsStore((state) => state.loading);
  const error = useResultsStore((state) => state.error);
  const fetchResults = useResultsStore((state) => state.fetchResults);
  const canSeePendingResults = currentUser?.role === 'admin' || currentUser?.role === 'referee';

  const normalizeLegacySportName = (value: string) => value.toLowerCase().replace(/\s+/g, '');

  const resolveSportFromParam = (param: string | undefined) => {
    if (!param) {
      return null;
    }

    const canonicalParamKey = getSportTranslationKey(param);
    if (canonicalParamKey) {
      const sportByCanonicalKey = sports.find((entry) => getSportTranslationKey({ id: entry.id, name: entry.name }) === canonicalParamKey);
      if (sportByCanonicalKey) {
        return sportByCanonicalKey;
      }
    }

    if (/^\d+$/.test(param)) {
      const numericId = Number(param);
      return sports.find((entry) => entry.id === numericId) ?? null;
    }

    const normalizedParam = normalizeLegacySportName(param);
    return sports.find((entry) => normalizeLegacySportName(entry.name) === normalizedParam) ?? null;
  };

  const sport = resolveSportFromParam(sportId);
  const numericSportId = sport?.id ?? null;

  // Fetch results when sportId changes
  useEffect(() => {
    if (numericSportId !== null) {
      fetchResults(numericSportId);
    }
  }, [numericSportId, fetchResults]);
  
  const sportKey = sport ? getSportTranslationKey({ id: sport.id, name: sport.name }) : null;
  const sportData = sportKey ? sportsData[sportKey] : null;
  const sportMeasurementType = sportKey ? sportMeasurementTypes[sportKey] : null;
  const sportTitle = sportKey ? t(`sports.names.${sportKey}`) : sport?.name ?? String(sportId ?? '');
  
  // Get results for this sport from the store
  const sportResults = useMemo(() => {
    const allResults = numericSportId !== null ? results[numericSportId] || [] : [];

    if (canSeePendingResults) {
      return allResults;
    }

    return allResults.filter((result) => result.status.toUpperCase() !== 'PENDING');
  }, [canSeePendingResults, numericSportId, results]);

  if (!sportData || !sport) {
    return (
      <Box p={10} textAlign="center">
        <Heading>{t('sport.notFoundTitle')}</Heading>
        <Text mt={4}>{t('sport.notFoundText', { sport: sportId })}</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={{ base: 4, md: 10 }} className="responsive-page-shell">
      <HeaderWithImage imageUrl={sportData.imageUrl} title={sportTitle} />
      <Box bg="whiteAlpha.200" p={{ base: 3, md: 6 }} borderRadius="lg" boxShadow="lg" className="responsive-card-shell">
        <SportsTable
          data={sportResults}
          loading={loading}
          error={error}
          resultLabel={t('dashboard.labels.result')}
          resultUnitLabel={sportMeasurementType ? t(`sport.measurements.${sportMeasurementType}`) : undefined}
        />
      </Box>
    </Container>
  );
}
