import styled from 'styled-components';
import { Text, Button, HStack, Link } from '@chakra-ui/react';
import headerImg from '../assets/mc2026_header.png';
import { NavBar } from './NavBar';

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
            <Link 
              href="https://tickets.milanocortina2026.org"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: 'none' }}
            >
              <Button 
                size="xs" 
                variant="outline" 
                color="white" 
                borderColor="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              >
                Tickets
              </Button>
            </Link>
            <Link 
              href="https://shop.olympics.com/milano-cortina-2026"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: 'none' }}
            >
              <Button 
                size="xs" 
                variant="outline" 
                color="white" 
                borderColor="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              >
                Shop
              </Button>
            </Link>
          </HStack>
        </ContentWrapper>
      </BannerContainer>

      <HeaderWrapper>
        <HeaderImage role="img" aria-label="MC2026 header image" />
        <NavOverlay>
          <NavBar />
        </NavOverlay>
      </HeaderWrapper>
    </>
  );
};

const HeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  overflow: visible;
`;

const NavOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  z-index: 200;
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
`;

const HeaderImage = styled.div`
  width: 100%;
  height: 160px;
  background-image: url(${headerImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 20px;
  z-index: 0;
`;
