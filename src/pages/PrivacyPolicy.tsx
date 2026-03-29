import { useTranslation } from 'react-i18next';
import { LegalDocument, type LegalSection } from '../components/LegalDocument';

export function PrivacyPolicy() {
  const { t } = useTranslation();
  const sections = t('legal.privacyPolicy.sections', { returnObjects: true }) as LegalSection[];
  const introParagraphs = t('legal.privacyPolicy.introParagraphs', { returnObjects: true }) as string[];
  const footerNotes = t('legal.privacyPolicy.footerNotes', { returnObjects: true }) as string[];

  return (
    <LegalDocument
      title={t('footer.privacyPolicy')}
      introParagraphs={introParagraphs}
      sections={sections}
      footerNotes={footerNotes}
    />
  );
}
