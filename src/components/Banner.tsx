import styled, { keyframes } from 'styled-components';
import { Text, Button, HStack, Link } from '@chakra-ui/react';
import headerImg from '../assets/mc2026_header.png';
import { NavBar } from './NavBar';

const shimmer = keyframes`
  from {
    transform: translateX(-22%);
  }
  to {
    transform: translateX(22%);
  }
`;

const BannerContainer = styled.div`
  background: linear-gradient(90deg, #00313d 0%, #004a59 52%, #00313d 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  font-weight: bold;
  width: 100%;
  z-index: 1000;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.16) 50%, rgba(255, 255, 255, 0) 80%);
    animation: ${shimmer} 10s ease-in-out infinite alternate;
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  width: 95%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 0 20px;

  @media (max-width: 768px) {
    justify-content: flex-start;
    align-items: flex-start;
    padding: 8px 14px;
    gap: 8px;
  }
`;

export const Banner = () => {
  return (
    <>
      <BannerContainer>
        <ContentWrapper>
          <Text fontSize="sm" lineHeight="1.35" flex="1 1 520px" minW={0}>
            Olympische Winterspiele™ · 6. bis 22. Februar 2026 | Paralympische Winterspiele™ · 6. bis 15. März 2026
          </Text>
          <HStack gap={3} flex="0 1 auto" flexWrap="wrap" justify="flex-start">
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
  margin-bottom: 10px;
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
  position: relative;
  width: 100%;
  height: 160px;
  background-image: url(${headerImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 20px;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
    pointer-events: none;
  }
`;
