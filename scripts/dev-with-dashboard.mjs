#!/usr/bin/env node
/**
 * Development server launcher with documentation dashboard
 *
 * Runs:
 * 1. Next.js dev server on port 3001
 * 2. HTTP server for docs dashboard on port 8080
 * 3. Opens both in browser automatically
 */

import { spawn } from 'child_process'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
}

const log = (color, prefix, message) => {
  console.log(`${color}${colors.bright}[${prefix}]${colors.reset} ${message}`)
}

// Track server statuses
const servers = {
  nextjs: { ready: false, url: 'http://localhost:3001' },
  docs: { ready: false, url: 'http://localhost:8080/docs/audit-report.html' },
}

let hasOpenedBrowser = false

/**
 * Open URLs in default browser (cross-platform)
 */
function openInBrowser(url) {
  const platform = process.platform
  let command

  if (platform === 'darwin') {
    command = 'open'
  } else if (platform === 'win32') {
    command = 'start'
  } else {
    command = 'xdg-open'
  }

  spawn(command, [url], { stdio: 'ignore', detached: true }).unref()
}

/**
 * Open both URLs when both servers are ready
 */
function tryOpenBrowsers() {
  if (hasOpenedBrowser) return
  if (servers.nextjs.ready && servers.docs.ready) {
    hasOpenedBrowser = true
    log(colors.green, '🚀 READY', 'All servers running!')
    console.log('')
    log(colors.cyan, '🌐 APP', servers.nextjs.url)
    log(colors.magenta, '📚 DOCS', servers.docs.url)
    console.log('')
    log(colors.yellow, '✨ TIP', 'Press Ctrl+C to stop all servers')
    console.log('')

    // Open both in browser
    setTimeout(() => {
      openInBrowser(servers.nextjs.url)
      setTimeout(() => openInBrowser(servers.docs.url), 500)
    }, 1000)
  }
}

/**
 * Start Next.js dev server
 */
function startNextServer() {
  log(colors.cyan, 'NEXT', 'Starting Next.js dev server on port 3001...')

  const nextProcess = spawn('pnpm', ['next', 'dev', '-p', '3001'], {
    cwd: projectRoot,
    stdio: 'pipe',
    shell: true,
  })

  nextProcess.stdout.on('data', (data) => {
    const output = data.toString()
    process.stdout.write(`${colors.cyan}[NEXT]${colors.reset} ${output}`)

    // Detect when Next.js is ready
    if (output.includes('Local:') || output.includes('Ready in')) {
      servers.nextjs.ready = true
      tryOpenBrowsers()
    }
  })

  nextProcess.stderr.on('data', (data) => {
    process.stderr.write(`${colors.cyan}[NEXT]${colors.reset} ${data}`)
  })

  nextProcess.on('error', (error) => {
    log(colors.cyan, 'NEXT', `Error: ${error.message}`)
  })

  nextProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      log(colors.cyan, 'NEXT', `Process exited with code ${code}`)
    }
  })

  return nextProcess
}

/**
 * Start HTTP server for documentation dashboard
 */
function startDocsServer() {
  log(colors.magenta, 'DOCS', 'Starting documentation server on port 8080...')

  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.md': 'text/markdown',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  }

  const server = http.createServer((req, res) => {
    // Normalize URL
    let filePath = '.' + req.url
    if (filePath === './') {
      filePath = './docs/audit-report.html'
    }

    // Security: prevent directory traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '')
    const fullPath = path.join(projectRoot, safePath)

    // Check if file exists
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
          })
          res.end(`404 Not Found: ${safePath}`)
        } else {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
          })
          res.end('500 Internal Server Error')
        }
      } else {
        // Determine content type
        const ext = path.extname(fullPath).toLowerCase()
        const contentType = mimeTypes[ext] || 'application/octet-stream'

        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        })
        res.end(data)
      }
    })
  })

  server.listen(8080, () => {
    log(colors.magenta, 'DOCS', 'Documentation server ready!')
    servers.docs.ready = true
    tryOpenBrowsers()
  })

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      log(colors.magenta, 'DOCS', 'Port 8080 already in use. Trying to kill existing process...')

      // Try to kill process on port 8080
      const killProcess = spawn('lsof', ['-ti:8080'], { shell: true })
      let pid = ''

      killProcess.stdout.on('data', (data) => {
        pid = data.toString().trim()
      })

      killProcess.on('close', () => {
        if (pid) {
          spawn('kill', ['-9', pid], { shell: true }).on('close', () => {
            log(colors.magenta, 'DOCS', 'Killed existing process. Retrying...')
            setTimeout(() => startDocsServer(), 1000)
          })
        } else {
          log(colors.magenta, 'DOCS', 'Could not find process to kill. Please manually free port 8080.')
          process.exit(1)
        }
      })
    } else {
      log(colors.magenta, 'DOCS', `Error: ${error.message}`)
    }
  })

  return server
}

/**
 * Handle graceful shutdown
 */
function setupShutdownHandlers(nextProcess, docsServer) {
  const shutdown = (signal) => {
    console.log('')
    log(colors.yellow, 'SHUTDOWN', `Received ${signal}, stopping servers...`)

    // Kill Next.js process
    if (nextProcess && !nextProcess.killed) {
      nextProcess.kill('SIGTERM')
      log(colors.cyan, 'NEXT', 'Stopped')
    }

    // Close docs server
    if (docsServer) {
      docsServer.close(() => {
        log(colors.magenta, 'DOCS', 'Stopped')
        process.exit(0)
      })
    } else {
      process.exit(0)
    }
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('exit', () => {
    log(colors.green, '👋', 'Goodbye!')
  })
}

/**
 * Main execution
 */
function main() {
  console.clear()
  console.log('')
  console.log(`${colors.bright}${colors.green}╔════════════════════════════════════════════╗${colors.reset}`)
  console.log(`${colors.bright}${colors.green}║   Local Business CMS - Dev Environment    ║${colors.reset}`)
  console.log(`${colors.bright}${colors.green}╚════════════════════════════════════════════╝${colors.reset}`)
  console.log('')

  const nextProcess = startNextServer()
  const docsServer = startDocsServer()

  setupShutdownHandlers(nextProcess, docsServer)
}

// Run
main()
