import type { ComponentPropsWithoutRef as ComponentProps } from 'react'
import NextImage from 'next/image'

export const Image = ({
  style,
  ...props
}: ComponentProps<typeof NextImage>) => (
  <NextImage
    style={{ marginTop: '1.25rem', borderRadius: '.5rem', ...style }}
    {...props}
  />
)
