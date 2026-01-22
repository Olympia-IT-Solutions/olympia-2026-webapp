import { useParams } from 'react-router';
import { Box, Heading, Text, Container } from '@chakra-ui/react';
import { SportsTable } from '../components/SportsTable';
import type { SportResult } from '../components/SportsTable';
import { HeaderWithImage } from '../components/HeaderWithImage';
import { useTranslation } from 'react-i18next';

// Dummy data store - in a real app this would come from an API
const sportsData: Record<string, { title: string; imageUrl: string; results: SportResult[] }> = {
  biathlon: {
    title: 'Biathlon',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/li2dbi5btvf36tlxfxxl',
    results: [
      { id: 1, name: 'Johannes Thingnes Bø', country: 'Norwegen', result: '23:12.5', medal: 'gold' },
      { id: 2, name: 'Quentin Fillon Maillet', country: 'Frankreich', result: '23:30.1', medal: 'silver' },
      { id: 3, name: 'Tarjei Bø', country: 'Norwegen', result: '23:45.8', medal: 'bronze' },
      { id: 4, name: 'Sturla Holm Lægreid', country: 'Norwegen', result: '24:01.2' },
      { id: 5, name: 'Benedikt Doll', country: 'Deutschland', result: '24:15.5' },
    ]
  },
  bobsport: {
    title: 'Bobsport',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/vsczhylqdcucby3b6fa7',
    results: [
      { id: 1, name: 'Francesco Friedrich', country: 'Deutschland', result: '3:56.89', medal: 'gold' },
      { id: 2, name: 'Johannes Lochner', country: 'Deutschland', result: '3:57.10', medal: 'silver' },
      { id: 3, name: 'Justin Kripps', country: 'Kanada', result: '3:57.50', medal: 'bronze' },
    ]
  },
  curling: {
    title: 'Curling',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/e8v1pgmj4awck8lbjm66',
    results: [
      { id: 1, name: 'Team Schweden', country: 'Schweden', result: 'Final 5-4', medal: 'gold' },
      { id: 2, name: 'Team Großbritannien', country: 'Großbritannien', result: 'Final 4-5', medal: 'silver' },
      { id: 3, name: 'Team Kanada', country: 'Kanada', result: 'Bronze 8-5', medal: 'bronze' },
    ]
  },
  eishockey: {
    title: 'Eishockey',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/hfkjz7khdzopldgfr1p9',
    results: [
      { id: 1, name: 'Finnland', country: 'Finnland', result: 'Final 2-1', medal: 'gold' },
      { id: 2, name: 'ROC', country: 'ROC', result: 'Final 1-2', medal: 'silver' },
      { id: 3, name: 'Slowakei', country: 'Slowakei', result: 'Bronze 4-0', medal: 'bronze' },
    ]
  },
  eiskunstlauf: {
    title: 'Eiskunstlauf',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/lpmywgwi56i6c1ltnf1o',
    results: [
      { id: 1, name: 'Nathan Chen', country: 'USA', result: '332.60', medal: 'gold' },
      { id: 2, name: 'Yuma Kagiyama', country: 'Japan', result: '310.05', medal: 'silver' },
      { id: 3, name: 'Shoma Uno', country: 'Japan', result: '293.00', medal: 'bronze' },
    ]
  },
  skilanglauf: {
    title: 'Skilanglauf',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/avjcz7wgesxj1wi77oej',
    results: [
      { id: 1, name: 'Alexander Bolshunov', country: 'ROC', result: '1:11:32.7', medal: 'gold' },
      { id: 2, name: 'Denis Spitsov', country: 'ROC', result: '1:12:43.7', medal: 'silver' },
      { id: 3, name: 'Iivo Niskanen', country: 'Finnland', result: '1:13:32.7', medal: 'bronze' },
    ]
  },
  skispringen: {
    title: 'Skispringen',
    imageUrl: 'https://img.olympics.com/images/image/private/t_16-9_760/f_auto/primary/sunaotnj4ykrmdcagmdi',
    results: [
      { id: 1, name: 'Marius Lindvik', country: 'Norwegen', result: '296.1', medal: 'gold' },
      { id: 2, name: 'Ryoyu Kobayashi', country: 'Japan', result: '292.8', medal: 'silver' },
      { id: 3, name: 'Karl Geiger', country: 'Deutschland', result: '281.3', medal: 'bronze' },
    ]
  }
};

export function SportPage() {
  const { sportId } = useParams<{ sportId: string }>();
  const { } = useTranslation();

  // Normalize sportId to lowercase to match keys
  const sportKey = sportId?.toLowerCase();
  const sportData = sportKey ? sportsData[sportKey] : undefined;

  if (!sportData) {
    return (
      <Box p={10} textAlign="center">
        <Heading>Sportart nicht gefunden</Heading>
        <Text mt={4}>Die gesuchte Sportart "{sportId}" existiert nicht oder es liegen keine Daten vor.</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <HeaderWithImage imageUrl={sportData.imageUrl} title={sportData.title} />
      <Box bg="whiteAlpha.200" p={6} borderRadius="lg" boxShadow="lg">
        <SportsTable data={sportData.results} />
      </Box>
    </Container>
  );
}
