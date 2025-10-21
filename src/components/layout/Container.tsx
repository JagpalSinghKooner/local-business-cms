import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ContainerWidth = 'default' | 'narrow' | 'full'

type ContainerProps = {
  children: ReactNode
  className?: string
  width?: ContainerWidth
  style?: CSSProperties
}

const narrowMaxWidth = '720px'

export default function Container({ children, className, width = 'default', style: inlineStyle }: ContainerProps) {
  const style: CSSProperties = {
    maxWidth: width === 'full' ? '100%' : width === 'narrow' ? narrowMaxWidth : 'var(--layout-container-width)',
    paddingLeft: 'var(--space-gutter)',
    paddingRight: 'var(--space-gutter)',
  }

  return (
    <div className={cn('mx-auto w-full', className)} style={{ ...style, ...inlineStyle }}>
      {children}
    </div>
  )
}
