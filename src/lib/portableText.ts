import type { PortableContent } from '@/types/sanity'

type PortableBlock = {
  children?: Array<{ text?: string }>
}

export function portableTextToPlainText(blocks?: PortableContent): string {
  if (!blocks?.length) return ''

  return blocks
    .map((block) => {
      if (block._type !== 'block') {
        return ''
      }
      const portableBlock = block as PortableBlock
      if (!Array.isArray(portableBlock.children)) {
        return ''
      }
      return portableBlock.children.map((child) => child?.text ?? '').join('')
    })
    .join('\n')
    .trim()
}
