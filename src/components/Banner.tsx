import styled from 'styled-components';
import { Text, Button, HStack } from '@chakra-ui/react';
import headerImg from '../assets/mc2026_header.png';

const BannerContainer = styled.div`
  background-color: #00313d;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  font-weight: bold;
  width: 100%;
  z-index: 1000;
`;

const ContentWrapper = styled.div`
  width: 95%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

export const Banner = () => {
  return (
    <>
      <BannerContainer>
        <ContentWrapper>
          <Text fontSize="sm">Olympische Winterspiele™ · 6. bis 22. Februar 2026 | Paralympische Winterspiele™ · 6. bis 15. März 2026</Text>
          <HStack gap={4}>
            <Button 
              size="xs" 
              variant="outline" 
              color="white" 
              borderColor="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            >
              Tickets
            </Button>
            <Button 
              size="xs" 
              variant="outline" 
              color="white" 
              borderColor="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            >
              Shop
            </Button>
          </HStack>
        </ContentWrapper>
      </BannerContainer>

      <HeaderImage role="img" aria-label="MC2026 header image" />
    </>
  );
};

const HeaderImage = styled.div`
  width: 100%;
  height: 220px;
  background-image: url(${headerImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: -120px;
  z-index: 0;
`;
