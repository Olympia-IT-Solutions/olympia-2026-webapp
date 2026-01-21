import styled from 'styled-components';
import { Heading } from '@chakra-ui/react';
import footerImg from '../assets/mc2026_footer.png';

const FooterBannerContainer = styled.div`
  width: 100%;
  height: 160px;
  background-image: url(${footerImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

const BannerText = styled(Heading)`
  && {
    color: #003049;
    font-family: 'MilanoCortina2026-Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    font-size: 48px;
    text-align: center;
    text-shadow: 0 2px 6px rgba(0,0,0,0.12);
  }
`;

export const FooterBanner = () => {
  return (
    <FooterBannerContainer>
      <BannerText as="h3">IT's your vibe</BannerText>
    </FooterBannerContainer>
  );
};
