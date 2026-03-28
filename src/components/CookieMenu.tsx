import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Text, Stack, Container, Link } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router';
import { CTAButton, Surface } from './ui';

export const CookieMenu: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = sessionStorage.getItem('cookie-consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
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
    <Surface
      as="section"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      surfaceVariant="inverted"
      py={5}
      borderBottomWidth="0"
      borderRadius="3xl 3xl 0 0"
      zIndex={9999}
      boxShadow="ring-soft"
    >
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={4}
        >
          <Box flex="1" minW={0}>
            <Text fontSize="sm" lineHeight="1.5" whiteSpace={{ base: 'normal', lg: 'nowrap' }}>
              <Trans
                i18nKey="cookieBanner.messageWithPolicy"
                components={[
                  <Link
                    key="cookie-policy-link"
                    as={RouterLink}
                    to={`/${lang ?? 'de'}/cookie-policy`}
                    color="accent"
                    fontWeight="semibold"
                    _hover={{ color: 'accent-strong', textDecoration: 'underline' }}
                    _focusVisible={{ outline: '2px solid', outlineColor: 'accent', outlineOffset: '2px' }}
                  />,
                ]}
              />
            </Text>
          </Box>
          <Stack direction="row" gap={4}>
            <CTAButton
              size="sm"
              ctaVariant="outline"
              onClick={() => handleConsent('decline')}
            >
              {t('cookieBanner.decline')}
            </CTAButton>
            <CTAButton
              size="sm"
              ctaVariant="subtle"
              onClick={() => handleConsent('accept')}
            >
              {t('cookieBanner.accept')}
            </CTAButton>
          </Stack>
        </Stack>
      </Container>
    </Surface>
  );
};
