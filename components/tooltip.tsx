import { ComponentPropsWithoutRef as ComponentProps } from 'react'

export const Tooltip = ({
  children,
  ...props
}: ComponentProps<'span'> & { readonly title: string }) => (
  <span {...props}>{children}</span>
)
