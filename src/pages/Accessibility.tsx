import { useTranslation } from 'react-i18next';
import { LegalDocument, type LegalSection } from '../components/LegalDocument';

export function Accessibility() {
  const { t } = useTranslation();
  const sections = t('legal.accessibility.sections', { returnObjects: true }) as LegalSection[];
  const introParagraphs = t('legal.accessibility.introParagraphs', { returnObjects: true }) as string[];
  const footerNotes = t('legal.accessibility.footerNotes', { returnObjects: true }) as string[];

  return (
    <LegalDocument
      title={t('footer.accessibility')}
      introParagraphs={introParagraphs}
      sections={sections}
      footerNotes={footerNotes}
    />
  );
}
