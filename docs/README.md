# Documentation Portal

This folder contains two interactive documentation portals for the Local Business CMS Platform.

## Quick Start

### 1. Start the HTTP Server

**IMPORTANT:** Must be run from the project ROOT (not from docs folder) to access agent files.

```bash
# Navigate to project root
cd /Users/jagpalkooner/Desktop/Local\ Business\ CMS

# Start server
python3 -m http.server 8080
```

### 2. Open a Portal in Your Browser

**For Non-Technical Users (Content Editors, Managers, Stakeholders):**

```
http://localhost:8080/docs/index.html
```

- Beautiful, friendly interface
- No technical jargon
- Role-based documentation

**For Developers & Technical Teams:**

```
http://localhost:8080/docs/audit-report.html
```

- Technical dashboard with dark mode
- All audits, architecture docs, AI agents
- Syntax highlighting, search, export

## File Structure

```
docs/
├── index.html                    # Human-friendly portal
├── audit-report.html             # Technical dashboard
├── MARKDOWN-FILE-GOVERNANCE.md   # File organization rules
│
├── md-files/                     # Planning & audit docs (10 files)
│   ├── audit-*.md               # Code quality, performance, bundle, schema, verification
│   ├── prd-framework.md         # Product requirements
│   ├── roadmap-*.md             # CMS modernization roadmap
│   ├── schema-*.md              # Multi-tenant architecture
│   ├── seo-*.md                 # SEO & GROQ optimization
│   └── studio-ux-*.md           # Studio UX guides
│
└── (operational guides)          # Day-to-day reference docs
    ├── authoring-guide.md
    ├── multi-tenant-shared-vs-isolated.md
    ├── monitoring-guide.md
    ├── TESTING-GUIDE.md
    ├── PORT-CONFIGURATION.md
    ├── cross-site-references-guide.md
    └── rollback-playbook.md
```

## Why Serve from Project Root?

The dashboards reference AI agent documentation stored in `.claude/agents/` at the project root level. Serving from the project root allows access to:

- `/docs/` - All documentation
- `/.claude/agents/` - AI agent capabilities (17 files)
- Root files like `CLAUDE.md` and `README.md`

## Troubleshooting

### "fetch failed" errors when opening HTML files directly

- **Cause:** Browsers block `file://` protocol fetches for security
- **Solution:** Serve via HTTP as shown above

### Agent files not loading

- **Cause:** HTTP server started from `/docs` instead of project root
- **Solution:** Start server from `/Users/jagpalkooner/Desktop/Local\ Business\ CMS`

### Port 8080 already in use

```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9

# Then restart the server
python3 -m http.server 8080
```

## Alternative HTTP Servers

If you don't have Python:

```bash
# Node.js http-server
npx http-server -p 8080

# VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# PHP
php -S localhost:8080
```

## Documentation

- **Markdown Governance:** See `MARKDOWN-FILE-GOVERNANCE.md` for file organization rules
- **Validation:** Run `pnpm check:md-governance` from project root

## Support

For issues or questions:

1. Check if HTTP server is running from project root
2. Verify port 8080 is not in use
3. Review browser console for specific errors
4. See MARKDOWN-FILE-GOVERNANCE.md for file path rules
