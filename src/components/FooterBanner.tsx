import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import footerImg from '../assets/mc2026_footer.png';
import { SectionHeading } from './ui';

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

export const FooterBanner = () => {
  const { t } = useTranslation();

  return (
    <FooterBannerContainer>
      <SectionHeading
        as="h3"
        fontSize={{ base: '3xl', md: '5xl' }}
        textAlign="center"
        textShadow="0 2px 6px var(--chakra-colors-scrollbar-thumb)"
      >
        {t('footerBanner.tagline')}
      </SectionHeading>
    </FooterBannerContainer>
  );
};
