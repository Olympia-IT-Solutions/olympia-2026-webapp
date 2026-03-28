import { Box, type BoxProps } from '@chakra-ui/react';

type SurfaceVariant = 'default' | 'muted' | 'inverted';

interface SurfaceProps extends BoxProps {
  surfaceVariant?: SurfaceVariant;
  elevated?: boolean;
}

const surfaceVariantStyles: Record<
  SurfaceVariant,
  Pick<BoxProps, 'bg' | 'color' | 'borderColor'>
> = {
  default: {
    bg: 'surface',
    color: 'text',
    borderColor: 'border',
  },
  muted: {
    bg: 'surface-muted',
    color: 'text',
    borderColor: 'border',
  },
  inverted: {
    bg: 'ice.700',
    color: 'neutral.0',
    borderColor: 'accent',
  },
};

export const Surface = ({
  surfaceVariant = 'default',
  elevated = true,
  ...props
}: SurfaceProps) => {
  const variantStyle = surfaceVariantStyles[surfaceVariant];

  return (
    <Box
      borderWidth="1px"
      borderRadius="3xl"
      boxShadow={elevated ? 'ring-soft' : 'none'}
      transitionProperty="background-color, border-color, box-shadow"
      transitionDuration="var(--motion-interactive)"
      transitionTimingFunction="var(--motion-ease-interactive)"
      {...variantStyle}
      {...props}
    />
  );
};