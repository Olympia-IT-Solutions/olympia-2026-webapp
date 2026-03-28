import React from 'react';
import { Box, Text, VStack, HStack, Icon, Spinner, SimpleGrid, Button } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router';
import { FaMedal } from 'react-icons/fa';
import type { Medal } from '../services/medals';

interface MedalDisplayProps {
  medals: Medal[];
  loading?: boolean;
  country?: string;
}

const medalVisuals: Record<Medal['medalType'], { accentColor: string; label: string }> = {
  GOLD: { accentColor: 'medal-gold', label: 'Gold' },
  SILVER: { accentColor: 'medal-silver', label: 'Silber' },
  BRONZE: { accentColor: 'medal-bronze', label: 'Bronze' },
};

const interactiveTextButtonProps = {
  variant: 'ghost' as const,
  p: 0,
  minH: 'unset',
  h: 'auto',
  justifyContent: 'flex-start',
  textAlign: 'left' as const,
  color: 'text',
  transition: 'color var(--motion-fast) var(--motion-ease)',
  _hover: { textDecoration: 'underline', color: 'accent', bg: 'transparent' },
  _focusVisible: {
    outline: '2px solid',
    outlineColor: 'accent',
    outlineOffset: '2px',
    borderRadius: 'sm',
  },
};

const MedalCard: React.FC<{ medal: Medal; index: number }> = ({ medal, index }) => {
  const medalVisual = medalVisuals[medal.medalType];
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();

  // helper to generate path to sport page using either name or id-like slug
  const sportPath = `/${lang || 'de'}/sports/${medal.sportName
    .toLowerCase()
    .replace(/\s+/g, '')}`;

  const handleClick = () => {
    navigate(sportPath);
  };

  return (
    <Box
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="2xl"
      p={6}
      boxShadow="ring-soft"
      position="relative"
      overflow="hidden"
      transition="transform var(--motion-fast) var(--motion-ease), box-shadow var(--motion-fast) var(--motion-ease), border-color var(--motion-fast) var(--motion-ease)"
      _hover={{ transform: 'translateY(-4px)', borderColor: 'border-hover' }}
      _before={{
        content: '""',
        position: 'absolute',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        bg: medalVisual.accentColor,
      }}
      style={{ animation: 'fadeUpIn var(--motion-base) var(--motion-ease) both', animationDelay: `${index * 45}ms` }}
    >
      <VStack gap={4} align="start" h="100%">
        <HStack gap={3}>
          <Icon as={FaMedal} color={medalVisual.accentColor} boxSize={8} />
          <Box>
            <Text fontWeight="bold" fontSize="sm" color={medalVisual.accentColor} textTransform="uppercase" letterSpacing="0.06em">
              {medal.medalType}
            </Text>
          </Box>
        </HStack>

        <Box flex="1">
          <Button
            {...interactiveTextButtonProps}
            onClick={handleClick}
            fontWeight="bold"
            fontSize="lg"
            aria-label={`Show ${medal.sportName} details`}
          >
            {medal.athleteName}
          </Button>
        </Box>

        <Box w="100%">
          <Text fontSize="sm" color="text-muted">
            Sport
          </Text>
          <Button
            {...interactiveTextButtonProps}
            onClick={handleClick}
            fontWeight="600"
            fontSize="md"
            aria-label={`Show ${medal.sportName} details`}
          >
            {medal.sportName}
          </Button>
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
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        boxShadow="ring-soft"
        borderRadius="3xl"
        p={12}
        textAlign="center"
        color="text"
      >
        <Icon as={FaMedal} boxSize={12} color="text-muted" mb={4} />
        <Text fontSize="lg" fontWeight="600">
          {country ? `Keine Medaillen für ${country} gefunden.` : 'Keine Medaillen verfügbar.'}
        </Text>
      </Box>
    );
  }

  const medalTypeOrder: Medal['medalType'][] = ['GOLD', 'SILVER', 'BRONZE'];
  const medalCounts = medalTypeOrder.map((medalType) => ({
    medalType,
    count: medals.filter((medal) => medal.medalType === medalType).length,
  }));

  return (
    <VStack gap={8} align="stretch">
      <HStack gap={6} justify="center" wrap="wrap">
        {medalCounts
          .filter(({ count }) => count > 0)
          .map(({ medalType, count }) => {
            const medalVisual = medalVisuals[medalType];

            return (
              <Box
                key={medalType}
                textAlign="center"
                p={4}
                bg="surface-muted"
                borderWidth="1px"
                borderColor="border"
                borderRadius="2xl"
                boxShadow="ring-soft"
                position="relative"
                overflow="hidden"
                transition="transform var(--motion-fast) var(--motion-ease), border-color var(--motion-fast) var(--motion-ease)"
                _hover={{ transform: 'translateY(-3px)', borderColor: 'border-hover' }}
                _before={{
                  content: '""',
                  position: 'absolute',
                  insetInlineStart: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  bg: medalVisual.accentColor,
                }}
              >
                <Icon as={FaMedal} color={medalVisual.accentColor} boxSize={8} mb={2} />
                <Text fontWeight="bold" fontSize="2xl" color={medalVisual.accentColor}>
                  {count}
                </Text>
                <Text fontSize="sm" color="text-muted">
                  {medalVisual.label}
                </Text>
              </Box>
            );
          })}
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {medals.map((medal, index) => (
          <MedalCard key={`${medal.athleteId}-${medal.sportName}`} medal={medal} index={index} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};
