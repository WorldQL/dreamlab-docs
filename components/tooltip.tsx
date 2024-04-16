import { ComponentPropsWithoutRef as ComponentProps } from 'react'

export const Tooltip = ({
  children,
  style,
  ...props
}: ComponentProps<'span'> & { readonly title: string }) => (
  <span
    style={{ ...style, borderBottom: '1px dotted currentColor' }}
    {...props}
  >
    {children}
  </span>
)
