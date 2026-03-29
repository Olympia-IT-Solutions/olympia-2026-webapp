import { Box, Heading, Link, Text } from '@chakra-ui/react';

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  listStyle?: 'disc' | 'circle' | 'decimal';
  subsections?: LegalSection[];
  links?: { label: string; href: string }[];
};

interface LegalDocumentProps {
  title: string;
  introParagraphs?: string[];
  sections: LegalSection[];
  footerNotes?: string[];
}

const renderSection = (section: LegalSection, key: string, level: 'h2' | 'h3' | 'h4' = 'h2') => {
  const headingSize = level === 'h2' ? 'lg' : level === 'h3' ? 'md' : 'sm';
  const nextLevel: 'h3' | 'h4' = level === 'h2' ? 'h3' : 'h4';

  return (
    <Box key={key}>
      <Heading as={level} size={headingSize} mt={8} mb={4}>{section.heading}</Heading>

      {section.paragraphs?.map((paragraph, paragraphIndex) => (
        <Text key={`${key}-paragraph-${paragraphIndex}`} mb={4}>
          {paragraph}
        </Text>
      ))}

      {section.list && section.list.length > 0 && (
        <Box as="ul" pl={6} mb={6} css={{ listStyleType: section.listStyle ?? 'disc' }}>
          {section.list.map((item, itemIndex) => (
            <Box key={`${key}-list-${itemIndex}`} as="li" mb={2}>
              <Text>{item}</Text>
            </Box>
          ))}
        </Box>
      )}

      {section.links && section.links.length > 0 && (
        <Box as="ul" pl={6} mb={6} css={{ listStyleType: 'disc' }}>
          {section.links.map((linkItem, linkIndex) => (
            <Box key={`${key}-link-${linkIndex}`} as="li" mb={2}>
              <Link href={linkItem.href} target="_blank" rel="noopener noreferrer" color="accent" textDecoration="underline">
                {linkItem.label}
              </Link>
            </Box>
          ))}
        </Box>
      )}

      {section.subsections?.map((subsection, subsectionIndex) =>
        renderSection(subsection, `${key}-subsection-${subsectionIndex}`, nextLevel),
      )}
    </Box>
  );
};

export const LegalDocument = ({ title, introParagraphs, sections, footerNotes }: LegalDocumentProps) => {
  return (
    <Box p={10}>
      <Box maxW="container.xl" mx="auto">
        <Heading as="h1" mb={6}>{title}</Heading>
        <Box bg="var(--card-bg)" borderRadius="xl" p={6} color="var(--card-text)" boxShadow="xl" lineHeight={1.8} fontSize="0.95rem">
          {introParagraphs?.map((paragraph, index) => (
            <Text key={`intro-${index}`} mb={4}>{paragraph}</Text>
          ))}

          {sections.map((section, index) => renderSection(section, `section-${index}`))}

          {footerNotes && footerNotes.length > 0 && (
            <Box mt={8} pt={6} borderTop="1px solid" borderColor="gray.300">
              {footerNotes.map((note, index) => (
                <Text key={`footer-note-${index}`} fontSize="sm" opacity={0.8} mt={index === 0 ? 0 : 2}>
                  {note}
                </Text>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};