module.exports = {
  // TypeScript and JavaScript files - allow warnings in test files
  '*.{ts,tsx,js,jsx}': (filenames) => {
    const nonTestFiles = filenames.filter((file) => !file.includes('tests/'))
    const testFiles = filenames.filter((file) => file.includes('tests/'))

    const commands = []

    if (nonTestFiles.length > 0) {
      commands.push(`eslint --fix --max-warnings 0 ${nonTestFiles.join(' ')}`)
      commands.push(`prettier --write ${nonTestFiles.join(' ')}`)
    }

    if (testFiles.length > 0) {
      commands.push(`eslint --fix ${testFiles.join(' ')}`)
      commands.push(`prettier --write ${testFiles.join(' ')}`)
    }

    return commands
  },

  // JSON, Markdown, and other files
  '*.{json,md,mdx,css,html,yml,yaml}': ['prettier --write'],
}
