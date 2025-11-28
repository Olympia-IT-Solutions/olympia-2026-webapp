import { useState, useEffect } from 'react';
import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';

export const Slider = () => {
  const slides = [
    {
      img: 'https://placehold.co/1200x400/2a4365/ffffff?text=Slide+1',
      text: 'Slide 1 Placeholder',
    },
    {
      img: 'https://placehold.co/1200x400/2c5282/ffffff?text=Slide+2',
      text: 'Slide 2 Placeholder',
    },
    {
      img: 'https://placehold.co/1200x400/2b6cb0/ffffff?text=Slide+3',
      text: 'Slide 3 Placeholder',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const setSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Optional: Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="relative"
      width="90%"
      maxW="1200px"
      mx="auto"
      borderRadius="3xl"
      overflow="hidden"
      my={8}
      boxShadow="xl"
    >
      {/* Slides */}
      <Flex
        transition="transform 0.5s ease-in-out"
        transform={`translateX(-${currentSlide * 100}%)`}
        width={`${slides.length * 100}%`}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            width="100%"
            height={{ base: '300px', md: '400px', lg: '500px' }}
            backgroundImage={`url(${slide.img})`}
            backgroundSize="cover"
            backgroundPosition="center"
            position="relative"
          >
            {/* Overlay for text readability */}
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="blackAlpha.400"
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
        aria-label="Previous Slide"
        icon={<FaChevronLeft />}
        position="absolute"
        left="2"
        top="50%"
        transform="translateY(-50%)"
        onClick={prevSlide}
        zIndex={2}
        variant="ghost"
        color="white"
        _hover={{ bg: 'whiteAlpha.300' }}
      />

      {/* Right Arrow */}
      <IconButton
        aria-label="Next Slide"
        icon={<FaChevronRight />}
        position="absolute"
        right="2"
        top="50%"
        transform="translateY(-50%)"
        onClick={nextSlide}
        zIndex={2}
        variant="ghost"
        color="white"
        _hover={{ bg: 'whiteAlpha.300' }}
      />

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
            size="10px"
            color={currentSlide === index ? 'white' : 'whiteAlpha.500'}
            cursor="pointer"
            onClick={() => setSlide(index)}
            transition="color 0.3s"
          />
        ))}
      </Flex>
    </Box>
  );
};
