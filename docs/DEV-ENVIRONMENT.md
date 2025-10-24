# Development Environment Setup

## Quick Start

The default development command now launches **two servers** and opens **two browser tabs** automatically:

```bash
pnpm dev
```

This will:
1. ✅ Start Next.js dev server on **port 3001**
2. ✅ Start documentation dashboard on **port 8080**
3. ✅ Automatically open both URLs in your browser
4. ✅ Display colored logs for each service

---

## What Opens Automatically

| Service | URL | Purpose |
|---------|-----|---------|
| **App** | http://localhost:3001 | Next.js frontend with live reload |
| **Docs** | http://localhost:8080/docs/audit-report.html | Technical documentation dashboard |

---

## Commands

```bash
# Start both servers (default)
pnpm dev

# Start ONLY Next.js (no dashboard)
pnpm dev:next

# Stop all servers
# Press Ctrl+C in the terminal
```

---

## How It Works

The `pnpm dev` command runs `scripts/dev-with-dashboard.mjs`, which:

1. **Spawns Next.js** as a child process on port 3001
2. **Creates HTTP server** for docs on port 8080 (serves from project root)
3. **Monitors both processes** and opens browsers when ready
4. **Handles graceful shutdown** when you press Ctrl+C

---

## Troubleshooting

### Port Already in Use

If you see `EADDRINUSE` errors:

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Then restart
pnpm dev
```

### Browser Doesn't Open

The script uses platform-specific commands:
- **macOS**: `open`
- **Windows**: `start`
- **Linux**: `xdg-open`

If auto-open fails, manually navigate to:
- http://localhost:3001
- http://localhost:8080/docs/audit-report.html

### "Cannot find module" Error

Make sure you're running from the project root:

```bash
cd /Users/jagpalkooner/Desktop/Local\ Business\ CMS
pnpm dev
```

### Docs Dashboard Shows 404

The HTTP server serves from the **project root**, not from `/docs`. This allows access to:
- `/docs/` - Documentation files
- `/.claude/agents/` - AI agent docs
- Root files like `CLAUDE.md`

If you see 404s, verify you're running from the correct directory.

---

## Colored Logs

The dev script outputs colored logs for easy identification:

- **[NEXT]** - Cyan - Next.js dev server logs
- **[DOCS]** - Magenta - Documentation server logs
- **[🚀 READY]** - Green - All servers running
- **[✨ TIP]** - Yellow - Helpful tips
- **[SHUTDOWN]** - Yellow - Graceful shutdown messages

---

## Customization

To modify ports or behavior, edit:

```
scripts/dev-with-dashboard.mjs
```

**Current configuration**:
- Next.js: `localhost:3001`
- Docs: `localhost:8080`
- Browser delay: 1000ms (to ensure servers are ready)

---

## Why Port 3001?

Port 3001 is used instead of Next.js's default 3000 to avoid conflicts with:
- Other local projects
- Sanity Studio (often runs on 3000)
- Common development servers

---

## Alternative: Run Services Separately

If you prefer to run services separately:

```bash
# Terminal 1: Next.js only
pnpm dev:next

# Terminal 2: Documentation server only
python3 -m http.server 8080
```

---

## Documentation Dashboard Features

The dashboard at http://localhost:8080/docs/audit-report.html includes:

- **Audits**: Code quality, performance, bundle size, schema
- **Architecture**: Multi-tenant guides, testing, monitoring
- **Planning**: Roadmaps, PRDs, migration guides
- **AI Agents**: 17 specialized agent capability docs
- **Search**: Full-text search across all documentation
- **Export**: Download any doc as PDF

For non-technical users, visit:
- http://localhost:8080/docs/index.html (User-friendly portal)

---

## Related Documentation

- **Port Configuration**: `docs/PORT-CONFIGURATION.md`
- **Testing Guide**: `docs/TESTING-GUIDE.md`
- **Monitoring Guide**: `docs/monitoring-guide.md`
- **CLAUDE.md**: Main development guide (root)

---

## Support

If you encounter issues:

1. Check that ports 3001 and 8080 are free
2. Verify you're in the project root directory
3. Kill any zombie processes: `pkill -f "next dev"`
4. Check logs for specific error messages
5. Try running services separately to isolate the issue
