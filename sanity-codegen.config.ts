import type { SanityCodegenConfig } from '@sanity-codegen/cli'

function generateTypeName(name: string) {
  const normalized = name.replace(/\./g, '_')
  const firstChar = normalized.substring(0, 1).toUpperCase()
  const rest = normalized
    .replace(/(_[A-Z])/gi, (segment) => segment.substring(1).toUpperCase())
    .replace(/(-[A-Z])/gi, (segment) => segment.substring(1).toUpperCase())
    .substring(1)
  return `${firstChar}${rest}`
}

const config: SanityCodegenConfig = {
  schemaPath: './src/sanity/schemaTypes/index.ts',
  schemaTypesOutputPath: './src/types/sanity.generated.d.ts',
  schemaJsonOutputPath: './.sanity/schema-def.json',
  root: '.',
  generateTypeName,
}

export default config
