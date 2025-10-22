module.exports = {
  // TypeScript and JavaScript files - allow warnings in test files
  '*.{ts,tsx,js,jsx}': (filenames) => {
    const nonTestFiles = filenames.filter((file) => !file.includes('tests/'))
    const testFiles = filenames.filter((file) => file.includes('tests/'))

    const commands = []

    if (nonTestFiles.length > 0) {
      commands.push(`eslint --fix --max-warnings 0 ${nonTestFiles.map((f) => `"${f}"`).join(' ')}`)
      commands.push(`prettier --write ${nonTestFiles.map((f) => `"${f}"`).join(' ')}`)
    }

    if (testFiles.length > 0) {
      commands.push(`eslint --fix ${testFiles.map((f) => `"${f}"`).join(' ')}`)
      commands.push(`prettier --write ${testFiles.map((f) => `"${f}"`).join(' ')}`)
    }

    return commands
  },

  // JSON, Markdown, and other files
  '*.{json,md,mdx,css,html,yml,yaml}': ['prettier --write'],
}
