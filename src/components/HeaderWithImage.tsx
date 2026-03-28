import React from 'react';
import { Box } from '@chakra-ui/react';
import { SectionHeading, Surface } from './ui';

interface HeaderWithImageProps {
  imageUrl: string;
  title: string;
}

export const HeaderWithImage: React.FC<HeaderWithImageProps> = ({ imageUrl, title }) => {
  return (
    <Box mb={{ base: 6, md: 8 }}>
      <Surface
        elevated
        borderRadius={{ base: '2xl', md: '3xl' }}
        overflow="hidden"
        role="img"
        aria-label={title}
      >
        <Box
          height={{ base: '150px', md: '240px' }}
          position="relative"
          backgroundImage={`url(${imageUrl})`}
          backgroundSize="cover"
          backgroundPosition="center"
        >
          <Box
            position="absolute"
            left={0}
            top={0}
            height="100%"
            display="flex"
            alignItems="center"
            pl={{ base: 5, md: 8 }}
            pr={{ base: 5, md: 7 }}
            width={{ base: '100%', md: '62%' }}
            background="linear-gradient(90deg, rgba(0, 48, 73, 0.82) 0%, rgba(0, 48, 73, 0.38) 46%, rgba(0, 48, 73, 0) 100%)"
          >
            <SectionHeading
              as="h1"
              tone="inverse"
              fontSize={{ base: '2xl', md: '4xl' }}
              textAlign="left"
              textShadow="0 6px 18px rgba(0,0,0,0.5)"
            >
              {title}
            </SectionHeading>
          </Box>
        </Box>
      </Surface>
    </Box>
  );
};
