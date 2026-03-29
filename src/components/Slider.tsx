import { useState, useEffect } from 'react';
import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';

export const Slider = () => {
  const { t } = useTranslation();

  const slides = [
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/qtsazotmahptlkashww7',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/qkxoxyrkn7xx3wsfnhvd',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/avf6qhulfjovaoetfvoh',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/gbpfuabneuviirakyy8p',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/seheidquxgezpftax7zp',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/wvbz1k2qvhgjrp42jmdf',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/l9bhajwtsejpgsriwdbw',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/gqilopdm6xl27qzbhfdv',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/dwynqbdiuwfsmb8h5dvb',
      text: '',
    },
    {
      img: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/ak92l9nzr5qke99tkltm',
      text: '',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const setSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  // Auto-slide is disabled when users prefer reduced motion.
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, slides.length]);

  return (
    <Box
      position="relative"
      width="90%"
      maxW="1400px"
      maxH="800px"
      mx="auto"
      borderRadius="3xl"
      overflow="hidden"
      my={8}
      boxShadow="var(--ring-soft), 0 24px 54px rgba(0, 34, 45, 0.26)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.35)"
      style={{ animation: 'fadeUpIn var(--motion-slow) var(--motion-ease)' }}
    >
      {/* Slides */}
      <Flex
        transition="transform var(--motion-slow) var(--motion-ease)"
        transform={`translateX(-${currentSlide * 100}%)`}
        width="100%"
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            width="100%"
            flex="0 0 100%"
            height={{ base: '300px', md: '400px', lg: '800px' }}
            backgroundImage={`url(${slide.img})`}
            backgroundSize="cover"
            backgroundPosition="center"
            position="relative"
            transition="transform var(--motion-slow) var(--motion-ease), filter var(--motion-slow) var(--motion-ease)"
            transform={currentSlide === index ? 'scale(1)' : 'scale(0.98)'}
            filter={currentSlide === index ? 'saturate(1.06)' : 'saturate(0.9)'}
          >
            {/* Overlay for text readability */}
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="linear-gradient(180deg, rgba(0, 22, 30, 0.2), rgba(0, 22, 30, 0.5))"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color="white"
                fontSize={{ base: '2xl', md: '4xl' }}
                fontWeight="bold"
                textAlign="center"
                px={4}
              >
                {slide.text}
              </Text>
            </Box>
          </Box>
        ))}
      </Flex>

      {/* Left Arrow */}
      <IconButton
        aria-label={t('slider.previous')}
        position="absolute"
        left="2"
        top="50%"
        transform="translateY(-50%)"
        onClick={prevSlide}
        zIndex={2}
        variant="ghost"
        color="white"
        bg="rgba(0, 0, 0, 0.18)"
        borderRadius="full"
        _hover={{ bg: 'whiteAlpha.300', transform: 'translateY(-50%) scale(1.04)' }}
        transition="all var(--motion-fast) var(--motion-ease)"
      >
        <FaChevronLeft />
      </IconButton>

      {/* Right Arrow */}
      <IconButton
        aria-label={t('slider.next')}
        position="absolute"
        right="2"
        top="50%"
        transform="translateY(-50%)"
        onClick={nextSlide}
        zIndex={2}
        variant="ghost"
        color="white"
        bg="rgba(0, 0, 0, 0.18)"
        borderRadius="full"
        _hover={{ bg: 'whiteAlpha.300', transform: 'translateY(-50%) scale(1.04)' }}
        transition="all var(--motion-fast) var(--motion-ease)"
      >
        <FaChevronRight />
      </IconButton>

      {/* Dots */}
      <Flex
        position="absolute"
        bottom="4"
        left="50%"
        transform="translateX(-50%)"
        gap={2}
        zIndex={2}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            as={FaCircle}
            boxSize="10px"
            color={currentSlide === index ? 'white' : 'whiteAlpha.500'}
            cursor="pointer"
            onClick={() => setSlide(index)}
            transition="all var(--motion-fast) var(--motion-ease)"
            transform={currentSlide === index ? 'scale(1.15)' : 'scale(1)'}
          />
        ))}
      </Flex>
    </Box>
  );
};
