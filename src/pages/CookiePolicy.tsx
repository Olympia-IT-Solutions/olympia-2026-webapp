import { useTranslation } from 'react-i18next';
import { LegalDocument, type LegalSection } from '../components/LegalDocument';

export function CookiePolicy() {
  const { t } = useTranslation();
  const sections = t('legal.cookiePolicy.sections', { returnObjects: true }) as LegalSection[];
  const introParagraphs = t('legal.cookiePolicy.introParagraphs', { returnObjects: true }) as string[];
  const footerNotes = t('legal.cookiePolicy.footerNotes', { returnObjects: true }) as string[];

  return (
    <LegalDocument
      title={t('footer.cookiePolicy')}
      introParagraphs={introParagraphs}
      sections={sections}
      footerNotes={footerNotes}
    />
  );
}
