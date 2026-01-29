import React from 'react';
import { Box, Text, VStack, HStack, Icon, Spinner, SimpleGrid } from '@chakra-ui/react';
import { FaMedal } from 'react-icons/fa';
import type { Medal } from '../services/medals';

interface MedalDisplayProps {
  medals: Medal[];
  loading?: boolean;
  country?: string;
}

const getMedalColor = (medalType: 'GOLD' | 'SILVER' | 'BRONZE') => {
  const colors: Record<string, { bg: string; color: string; borderColor: string }> = {
    GOLD: { bg: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', borderColor: '#FFB700' },
    SILVER: { bg: 'rgba(192, 192, 192, 0.1)', color: '#C0C0C0', borderColor: '#A9A9A9' },
    BRONZE: { bg: 'rgba(205, 127, 50, 0.1)', color: '#CD7F32', borderColor: '#B87333' },
  };
  return colors[medalType];
};

const MedalCard: React.FC<{ medal: Medal }> = ({ medal }) => {
  const medalColor = getMedalColor(medal.medalType);

  return (
    <Box
      bg={medalColor.bg}
      border="2px solid"
      borderColor={medalColor.borderColor}
      borderRadius="lg"
      p={6}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: `0 12px 24px ${medalColor.color}40`,
      }}
      cursor="pointer"
    >
      <VStack gap={4} align="start" h="100%">
        {/* Medal Icon */}
        <HStack gap={3}>
          <Icon as={FaMedal} color={medalColor.color} boxSize={8} />
          <Box>
            <Text fontWeight="bold" fontSize="sm" color={medalColor.color} textTransform="uppercase">
              {medal.medalType}
            </Text>
          </Box>
        </HStack>

        {/* Athlete Name */}
        <Box flex="1">
          <Text fontSize="lg" fontWeight="bold" color="var(--card-text)">
            {medal.athleteName}
          </Text>
        </Box>

        {/* Sport */}
        <Box w="100%">
          <Text fontSize="sm" color="var(--card-text)" opacity={0.7}>
            Sport
          </Text>
          <Text fontSize="md" fontWeight="600" color="var(--card-text)">
            {medal.sportName}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export const MedalDisplay: React.FC<MedalDisplayProps> = ({ medals, loading = false, country }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" colorPalette="teal" />
      </Box>
    );
  }

  if (!medals || medals.length === 0) {
    return (
      <Box
        bg="var(--card-bg)"
        borderRadius="lg"
        p={12}
        textAlign="center"
        color="var(--card-text)"
      >
        <Icon as={FaMedal} boxSize={12} opacity={0.3} mb={4} />
        <Text fontSize="lg" fontWeight="600">
          {country ? `Keine Medaillen für ${country} gefunden.` : 'Keine Medaillen verfügbar.'}
        </Text>
      </Box>
    );
  }

  // Separate medals by type and count
  const goldMedals = medals.filter(m => m.medalType === 'GOLD');
  const silverMedals = medals.filter(m => m.medalType === 'SILVER');
  const bronzeMedals = medals.filter(m => m.medalType === 'BRONZE');

  return (
    <VStack gap={8} align="stretch">
      {/* Medal Summary */}
      <HStack gap={6} justify="center" wrap="wrap">
        {goldMedals.length > 0 && (
          <Box textAlign="center" p={4} bg="rgba(255, 215, 0, 0.1)" borderRadius="lg">
            <Icon as={FaMedal} color="#FFD700" boxSize={8} mb={2} />
            <Text fontWeight="bold" fontSize="2xl" color="#FFD700">
              {goldMedals.length}
            </Text>
            <Text fontSize="sm" color="var(--card-text)">
              Gold
            </Text>
          </Box>
        )}
        {silverMedals.length > 0 && (
          <Box textAlign="center" p={4} bg="rgba(192, 192, 192, 0.1)" borderRadius="lg">
            <Icon as={FaMedal} color="#C0C0C0" boxSize={8} mb={2} />
            <Text fontWeight="bold" fontSize="2xl" color="#C0C0C0">
              {silverMedals.length}
            </Text>
            <Text fontSize="sm" color="var(--card-text)">
              Silber
            </Text>
          </Box>
        )}
        {bronzeMedals.length > 0 && (
          <Box textAlign="center" p={4} bg="rgba(205, 127, 50, 0.1)" borderRadius="lg">
            <Icon as={FaMedal} color="#CD7F32" boxSize={8} mb={2} />
            <Text fontWeight="bold" fontSize="2xl" color="#CD7F32">
              {bronzeMedals.length}
            </Text>
            <Text fontSize="sm" color="var(--card-text)">
              Bronze
            </Text>
          </Box>
        )}
      </HStack>

      {/* Medal Cards Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {medals.map((medal) => (
          <MedalCard key={`${medal.athleteId}-${medal.sportName}`} medal={medal} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};
