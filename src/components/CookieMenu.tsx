import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Text, Button, Stack, Container } from '@chakra-ui/react';

export const CookieMenu: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = sessionStorage.getItem('cookie-consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch (e) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (type: 'accept' | 'decline') => {
    try {
      sessionStorage.setItem('cookie-consent', type);
    } catch (e) {
      console.error('Session storage error:', e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="#00313d"
      color="white"
      py={5}
      zIndex={9999}
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.3)"
    >
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={4}
        >
          <Box flex="1">
            <Text fontSize="sm">
              {t('cookieBanner.message')}
            </Text>
          </Box>
          <Stack direction="row" gap={4}>
            <Button
              size="sm"
              variant="outline"
              borderColor="white"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              onClick={() => handleConsent('decline')}
            >
              {t('cookieBanner.decline')}
            </Button>
            <Button
              size="sm"
              bg="white"
              color="#00313d"
              _hover={{ bg: 'gray.100' }}
              onClick={() => handleConsent('accept')}
            >
              {t('cookieBanner.accept')}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
