import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Heading, Text, Container } from '@chakra-ui/react';
import { SportsTable } from '../components/SportsTable';
import { HeaderWithImage } from '../components/HeaderWithImage';
import { useTranslation } from 'react-i18next';
import { useSportsStore } from '../store/sports';
import { useResultsStore } from '../store/results';

// Dummy data store - in a real app this would come from an API
const sportsData: Record<string, { title: string; imageUrl: string }> = {
  biathlon: {
    title: 'Biathlon',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/li2dbi5btvf36tlxfxxl',
  },
  bobsport: {
    title: 'Bobsport',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/vsczhylqdcucby3b6fa7',
  },
  curling: {
    title: 'Curling',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/e8v1pgmj4awck8lbjm66',
  },
  eishockey: {
    title: 'Eishockey',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/hfkjz7khdzopldgfr1p9',
  },
  eiskunstlauf: {
    title: 'Eiskunstlauf',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/lpmywgwi56i6c1ltnf1o',
  },
  skilanglauf: {
    title: 'Skilanglauf',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/avjcz7wgesxj1wi77oej',
  },
  skispringen: {
    title: 'Skispringen',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/sunaotnj4ykrmdcagmdi',
  }
};

export function SportPage() {
  const { sportId } = useParams<{ sportId: string }>();
  const { t } = useTranslation();
  
  const sports = useSportsStore((state) => state.sports);
  const results = useResultsStore((state) => state.results);
  const loading = useResultsStore((state) => state.loading);
  const fetchResults = useResultsStore((state) => state.fetchResults);

  // Helper function to convert sport name to ID
  const getSportIdFromParam = (param: string | undefined): number | null => {
    if (!param) return null;
    
    // If param is a number, use it directly
    if (/^\d+$/.test(param)) {
      return parseInt(param);
    }
    
    // If param is a string name, find the sport by name
    const foundSport = sports.find(s => 
      s.name.toLowerCase().replace(/\s+/g, '') === param.toLowerCase().replace(/\s+/g, '')
    );
    
    return foundSport ? foundSport.id : null;
  };

  const numericSportId = getSportIdFromParam(sportId);
  
  // Find the sport by ID from the store
  const sport = numericSportId !== null ? sports.find(s => s.id === numericSportId) : null;

  // Fetch results when sportId changes
  useEffect(() => {
    if (numericSportId !== null) {
      fetchResults(numericSportId);
    }
  }, [numericSportId, fetchResults]);
  
  const sportData = sport && sportsData[sport.name.toLowerCase()];
  
  // Get results for this sport from the store
  const sportResults = numericSportId !== null ? results[numericSportId] || [] : [];

  if (!sportData || !sport) {
    return (
      <Box p={10} textAlign="center">
        <Heading>{t('sport.notFoundTitle')}</Heading>
        <Text mt={4}>{t('sport.notFoundText', { sport: sportId })}</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <HeaderWithImage imageUrl={sportData.imageUrl} title={sportData.title} />
      <Box bg="whiteAlpha.200" p={6} borderRadius="lg" boxShadow="lg">
        <SportsTable data={sportResults} loading={loading} />
      </Box>
    </Container>
  );
}
