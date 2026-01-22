import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

interface HeaderWithImageProps {
  imageUrl: string;
  title: string;
}

export const HeaderWithImage: React.FC<HeaderWithImageProps> = ({ imageUrl, title }) => {
  return (
    <Box mb={6}>
      <Box
        borderRadius="lg"
        overflow="hidden"
        mb={4}
        height={{ base: '140px', md: '220px' }}
        position="relative"
        role="img"
        aria-label={title}
      >
        <Box
          width="100%"
          height="100%"
          backgroundImage={`url(${imageUrl})`}
          backgroundSize="cover"
          backgroundPosition="center"
        />

        {/* Left-side overlay for title */}
        <Box
          position="absolute"
          left={0}
          top={0}
          height="100%"
          display="flex"
          alignItems="center"
          pl={{ base: 4, md: 8 }}
          pr={6}
          width={{ base: '100%', md: '60%' }}
          background="linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 100%)"
        >
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '4xl' }}
            color="white"
            fontFamily="'MilanoCortina2026-Bold'"
            textAlign="left"
            textShadow="0 6px 18px rgba(0,0,0,0.6)"
          >
            {title}
          </Heading>
        </Box>
      </Box>
    </Box>
  );
};
