import { Box, SimpleGrid, Text, Image, Flex, Heading } from '@chakra-ui/react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { SportTranslationKey } from '../services/sports';

type DisciplineEntry = {
  id: SportTranslationKey;
  img: string;
};

const disciplineEntries: DisciplineEntry[] = [
  { id: 'biathlon', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/BTH.svg' },
  { id: 'bobsport', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/BOB.svg' },
  { id: 'curling', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/CUR.svg' },
  { id: 'eishockey', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/IHO.svg' },
  { id: 'eiskunstlauf', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/FSK.svg' },
  { id: 'skilanglauf', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/CCS.svg' },
  { id: 'skispringen', img: 'https://gstatic.olympics.com/s3/mc2026/pictograms/oly/light/big/SJP.svg' },
];

export const DisciplinesSection = () => {
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation()
  const currentLang = lang || 'de';

  return (
    <Box
      width="90%"
      maxW="1200px"
      mx="auto"
      my={12}
      p={{ base: 4, md: 6 }}
      borderRadius="2xl"
      bg="var(--card-bg)"
      border="1px solid"
      borderColor="var(--border-color)"
      boxShadow="var(--ring-soft)"
      style={{ animation: 'fadeUpIn var(--motion-slow) var(--motion-ease)' }}
    >
      <Heading as="h2" size="xl" mb={6} textAlign="left" color="#007f80">
        {t('hero.disciplines')}
      </Heading>
      
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
        {disciplineEntries.map((sport, index) => (
          <Link key={sport.id} to={`/${currentLang}/sports/${sport.id}`} style={{ textDecoration: 'none' }}>
            <Box 
              role="group"
              bg="var(--card-bg)" 
              borderRadius="xl" 
              overflow="hidden" 
              border="1px solid"
              borderColor="var(--border-color)"
              boxShadow="sm" 
              transition="transform var(--motion-fast) var(--motion-ease), box-shadow var(--motion-fast) var(--motion-ease), border-color var(--motion-fast) var(--motion-ease)"
              _hover={{ transform: 'translateY(-6px)', boxShadow: 'xl', borderColor: '#007f80' }}
              style={{ animation: `fadeUpIn var(--motion-base) var(--motion-ease) both`, animationDelay: `${index * 55}ms` }}
            >
              <Box
                height="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="var(--muted-bg)"
                backgroundImage="radial-gradient(circle at 50% 35%, rgba(0, 127, 128, 0.12), transparent 60%)"
              >
                <Image
                  src={sport.img}
                  alt={t(`sports.names.${sport.id}`)}
                  objectFit="contain"
                  width="100%"
                  height="100%"
                  objectPosition="center"
                  transition="transform var(--motion-base) var(--motion-ease)"
                  _groupHover={{ transform: 'scale(1.05)' }}
                />
              </Box>

              <Flex align="center" p={4}>
                <Text fontWeight="bold" fontSize="lg" color="var(--card-text)">
                  {t(`sports.names.${sport.id}`)}
                </Text>
              </Flex>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};
