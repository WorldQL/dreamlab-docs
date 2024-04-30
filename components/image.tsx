import type { ComponentPropsWithoutRef as ComponentProps } from 'react'
import NextImage from 'next/image'

export const Image = ({
  style,
  ...props
}: ComponentProps<typeof NextImage>) => (
  <NextImage
    style={{ padding: '2rem', borderRadius: '1rem', ...style }}
    {...props}
  />
)
