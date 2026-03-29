import { useTranslation } from 'react-i18next';
import { LegalDocument, type LegalSection } from '../components/LegalDocument';

export function TermsOfService() {
  const { t } = useTranslation();
  const sections = t('legal.termsOfService.sections', { returnObjects: true }) as LegalSection[];
  const introParagraphs = t('legal.termsOfService.introParagraphs', { returnObjects: true }) as string[];
  const footerNotes = t('legal.termsOfService.footerNotes', { returnObjects: true }) as string[];

  return (
    <LegalDocument
      title={t('footer.termsOfService')}
      introParagraphs={introParagraphs}
      sections={sections}
      footerNotes={footerNotes}
    />
  );
}
