import { Image, type ImageProps } from '@chakra-ui/react'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string

interface LoadingSpinnerProps extends Omit<ImageProps, 'src' | 'boxSize'> {
  size?: SpinnerSize
}

const spinnerSizeMap: Record<string, string> = {
  xs: '2rem',
  sm: '2.75rem',
  md: '4.25rem',
  lg: '5.75rem',
  xl: '7rem',
}

const resolveSpinnerSize = (size: SpinnerSize) => {
  if (typeof size === 'number') {
    return `${size}px`
  }

  return spinnerSizeMap[size] ?? size
}

export function LoadingSpinner({ size = 'md', alt = 'Loading', ...imageProps }: LoadingSpinnerProps) {
  return (
    <Image
      src={`${import.meta.env.BASE_URL}spinner.svg`}
      alt={alt}
      boxSize={resolveSpinnerSize(size)}
      objectFit="contain"
      draggable={false}
      {...imageProps}
    />
  )
}