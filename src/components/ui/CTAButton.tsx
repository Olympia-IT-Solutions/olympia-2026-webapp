import { Button, type ButtonProps } from '@chakra-ui/react';

type CTAButtonVariant = 'solid' | 'outline' | 'subtle';

interface CTAButtonProps extends ButtonProps {
  ctaVariant?: CTAButtonVariant;
  href?: string;
}

const getCTAButtonStyles = (ctaVariant: CTAButtonVariant): ButtonProps => {
  switch (ctaVariant) {
    case 'outline':
      return {
        variant: 'outline',
        borderColor: 'currentColor',
        color: 'inherit',
        _hover: {
          bg: 'hover-bg',
          borderColor: 'currentColor',
        },
      };
    case 'subtle':
      return {
        bg: 'button-bg',
        color: 'button-text',
        _hover: {
          bg: 'hover-bg',
        },
      };
    case 'solid':
    default:
      return {
        bg: 'accent',
        color: 'neutral.0',
        _hover: {
          bg: 'accent-strong',
        },
      };
  }
};

export const CTAButton = ({ ctaVariant = 'solid', ...props }: CTAButtonProps) => {
  const ctaStyles = getCTAButtonStyles(ctaVariant);

  return (
    <Button
      borderRadius="full"
      fontWeight="semibold"
      transitionProperty="background-color, border-color, color, transform, box-shadow"
      transitionDuration="var(--motion-interactive)"
      transitionTimingFunction="var(--motion-ease-interactive)"
      {...ctaStyles}
      {...props}
    />
  );
};