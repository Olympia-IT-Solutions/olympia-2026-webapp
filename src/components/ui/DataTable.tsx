import type { ReactNode } from 'react';
import { Box, Text, type BoxProps } from '@chakra-ui/react';

interface DataTableSurfaceProps extends BoxProps {
  children: ReactNode;
  elevated?: boolean;
}

interface DataTableStateProps extends BoxProps {
  message: string;
  helperText?: string;
  tone?: 'default' | 'danger';
}

export const DataTableSurface = ({
  children,
  className,
  style,
  elevated = true,
  ...props
}: DataTableSurfaceProps) => {
  const classes = className
    ? `responsive-data-table ${className}`
    : 'responsive-data-table';

  return (
    <Box
      className={classes}
      width="100%"
      overflow="hidden"
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="3xl"
      boxShadow={elevated ? 'ring-soft' : 'none'}
      p={2}
      transitionProperty="background-color, border-color, box-shadow"
      transitionDuration="var(--motion-fast)"
      transitionTimingFunction="var(--motion-ease)"
      _focusWithin={{ borderColor: 'border-hover' }}
      sx={{
        '& table': {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
        '& table tbody tr:last-of-type td': {
          borderBottomWidth: 0,
        },
        '& table tbody tr:last-of-type td:first-of-type': {
          borderBottomLeftRadius: 'var(--chakra-radii-3xl)',
        },
        '& table tbody tr:last-of-type td:last-of-type': {
          borderBottomRightRadius: 'var(--chakra-radii-3xl)',
        },
      }}
      style={{
        animation: 'fadeUpIn var(--motion-base) var(--motion-ease)',
        ...style,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export const DataTableState = ({
  message,
  helperText,
  tone = 'default',
  ...props
}: DataTableStateProps) => {
  const textColor = tone === 'danger' ? 'red.500' : 'text-muted';

  return (
    <Box
      p={6}
      textAlign="center"
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="3xl"
      boxShadow="ring-soft"
      {...props}
    >
      <Text color={textColor} fontWeight="medium">{message}</Text>
      {helperText && (
        <Text fontSize="sm" mt={2} color={textColor}>
          {helperText}
        </Text>
      )}
    </Box>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- Shared row interaction helper for data table components.
export const getDataTableRowStyles = (interactive = false) => ({
  transition: 'background-color var(--motion-fast) var(--motion-ease)',
  _hover: {
    '& > td': {
      bg: 'hover-bg',
    },
    ...(interactive ? { cursor: 'pointer' } : {}),
  },
  _focusWithin: {
    '& > td': {
      bg: 'hover-bg',
    },
  },
});