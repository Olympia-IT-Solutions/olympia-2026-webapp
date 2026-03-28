import { Heading, type HeadingProps } from '@chakra-ui/react';

type SectionHeadingTone = 'default' | 'muted' | 'inverse';

interface SectionHeadingProps extends HeadingProps {
  tone?: SectionHeadingTone;
}

const sectionHeadingToneStyles: Record<
  SectionHeadingTone,
  Pick<HeadingProps, 'color'>
> = {
  default: {
    color: 'text',
  },
  muted: {
    color: 'text-muted',
  },
  inverse: {
    color: 'neutral.0',
  },
};

export const SectionHeading = ({
  tone = 'default',
  as = 'h2',
  ...props
}: SectionHeadingProps) => {
  const toneStyle = sectionHeadingToneStyles[tone];

  return (
    <Heading
      as={as}
      fontFamily="heading"
      fontWeight="bold"
      letterSpacing="-0.02em"
      lineHeight="1.05"
      {...toneStyle}
      {...props}
    />
  );
};