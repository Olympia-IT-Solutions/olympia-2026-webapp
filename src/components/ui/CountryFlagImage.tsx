import { useEffect, useMemo, useState } from 'react';
import { Box, Image, type BoxProps } from '@chakra-ui/react';
import { resolveCountryFlagCode } from './countryFlagUtils';

const FLAG_CDN_BASE_URL = 'https://flagcdn.com/w40';

interface CountryFlagProps extends Omit<BoxProps, 'children'> {
  countryCode?: string | null;
}

export const CountryFlag = ({ countryCode, style, ...props }: CountryFlagProps) => {
  const resolvedCountryCode = useMemo(() => resolveCountryFlagCode(countryCode), [countryCode]);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [resolvedCountryCode]);

  if (!resolvedCountryCode) {
    return null;
  }

  const fallbackText = resolvedCountryCode.toUpperCase();

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      overflow="hidden"
      borderRadius="sm"
      bg="surface-muted"
      borderWidth="1px"
      borderColor="border"
      style={{ aspectRatio: '4 / 3', ...style }}
      {...props}
    >
      {hasImageError ? (
        <Box as="span" color="text-muted" fontSize="0.55rem" fontWeight="700" lineHeight="1" letterSpacing="0.04em">
          {fallbackText}
        </Box>
      ) : (
        <Image
          src={`${FLAG_CDN_BASE_URL}/${resolvedCountryCode}.png`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          w="100%"
          h="100%"
          objectFit="cover"
          onError={() => setHasImageError(true)}
        />
      )}
    </Box>
  );
};