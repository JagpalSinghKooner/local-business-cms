## Deployment Monitoring Guide

**Last Updated:** October 23, 2025

## Overview

The monitoring system provides real-time visibility into the health and performance of all deployed sites in the multi-tenant platform.

---

## Monitoring Tools

### 1. CLI Monitoring Script

Monitor sites from command line or CI/CD:

```bash
# Check all sites
pnpm monitor --all

# Check specific site
pnpm monitor --site=budds

# Continuous monitoring (every 60 seconds)
pnpm monitor --all --continuous --interval=60

# Save report to file
pnpm monitor --all --output=status-report.json

# Verbose mode (show all checks)
pnpm monitor --all --verbose
```

### 2. Health Check API

Simple endpoint for uptime monitors:

```bash
# Check if site is healthy
curl https://your-site.com/api/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-10-23T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Healthy
- `503` - Degraded
- `500` - Error

### 3. Monitoring API

Detailed status information:

```bash
# Get full status
curl https://your-site.com/api/monitor

# Response:
{
  "status": "healthy",
  "timestamp": "2025-10-23T10:00:00.000Z",
  "site": {
    "site": "Budds Plumbing",
    "dataset": "site-budds",
    "status": "healthy",
    "checks": {
      "database": true,
      "cms": true,
      "build": true
    },
    "metadata": {
      "buildDate": "2025-10-23T09:30:00.000Z",
      "version": "0.1.0",
      "environment": "production"
    }
  },
  "uptime": 3600
}
```

---

## Integration with External Services

### UptimeRobot

1. Go to UptimeRobot dashboard
2. Add New Monitor
3. Monitor Type: HTTP(s)
4. URL: `https://your-site.com/api/health`
5. Monitoring Interval: 5 minutes
6. Alert Contacts: your-email@example.com

### Pingdom

1. Go to Pingdom dashboard
2. Add New Check
3. Check Type: HTTP
4. URL: `https://your-site.com/api/health`
5. Check Interval: 1 minute

### Vercel Built-in Monitoring

Vercel provides built-in monitoring:

```bash
# View logs
vercel logs --follow

# View deployment status
vercel list

# View analytics
# Go to dashboard: https://vercel.com/dashboard
```

---

## Monitoring Dashboard (Optional)

For centralized monitoring, you can build a simple dashboard:

### Option 1: Simple HTML Dashboard

Create `monitoring-dashboard.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Site Monitoring Dashboard</title>
  <script>
    async function loadStatus() {
      const sites = [
        'https://site1.com/api/monitor',
        'https://site2.com/api/monitor',
      ];

      for (const url of sites) {
        const response = await fetch(url);
        const data = await response.json();
        // Display data
      }
    }

    setInterval(loadStatus, 60000); // Refresh every minute
    loadStatus();
  </script>
</head>
<body>
  <h1>Deployment Status</h1>
  <div id="status"></div>
</body>
</html>
```

### Option 2: Grafana + Prometheus

For enterprise monitoring, integrate with Grafana:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'websites'
    metrics_path: '/api/monitor'
    static_configs:
      - targets:
        - 'site1.com'
        - 'site2.com'
```

### Option 3: Vercel Analytics

Use Vercel's built-in analytics:

```typescript
// Add to layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## Automated Monitoring in CI/CD

Add monitoring to your deployment pipeline:

```yaml
# .github/workflows/deploy.yml
- name: Monitor Deployment
  run: |
    pnpm monitor --all --output=deployment-status.json

- name: Upload Status Report
  uses: actions/upload-artifact@v3
  with:
    name: deployment-status
    path: deployment-status.json
```

---

## Alerts and Notifications

### Slack Notifications

Create a webhook script:

```bash
#!/bin/bash
# notify-slack.sh

STATUS=$(pnpm monitor --all | grep "Down: " | awk '{print $3}')

if [ "$STATUS" != "0" ]; then
  curl -X POST -H 'Content-type: application/json' \
    --data '{"text":"🚨 Site(s) are down!"}' \
    YOUR_SLACK_WEBHOOK_URL
fi
```

Run via cron:

```bash
# Check every 5 minutes
*/5 * * * * /path/to/notify-slack.sh
```

### Email Alerts

Use a service like UptimeRobot or configure:

```typescript
// src/lib/notify.ts
export async function sendAlert(message: string) {
  // Send via SendGrid, AWS SES, etc.
}
```

---

## Monitoring Best Practices

### ✅ DO

1. Monitor from multiple locations
2. Set up alerts for critical issues
3. Track response times
4. Monitor SSL certificate expiration
5. Check all sites after deployment
6. Keep monitoring logs

### ❌ DON'T

1. Over-monitor (< 1 min intervals can trigger rate limits)
2. Ignore degraded status
3. Skip monitoring in staging
4. Forget to test alert system
5. Monitor only one site

---

## Metrics to Track

### Availability
- Uptime percentage (target: > 99.9%)
- Response time (target: < 1s)
- HTTP status codes

### Performance
- Page load time
- Core Web Vitals (LCP, FID, CLS)
- API response times

### Errors
- 4xx errors (client errors)
- 5xx errors (server errors)
- Failed deployments

---

## Troubleshooting

### Site Shows as Down

1. Check if site is actually down: `curl https://site.com`
2. Check Vercel deployment status
3. Check DNS configuration
4. Check SSL certificate
5. Review error logs: `vercel logs`

### Degraded Status

1. Check response times
2. Check error rates
3. Review recent deployments
4. Check database/CMS connectivity
5. Consider rollback

### False Positives

1. Increase monitoring interval
2. Add retry logic
3. Check monitor's network
4. Verify SSL certificate
5. Update monitor configuration

---

## Monitoring Report Format

```json
{
  "timestamp": "2025-10-23T10:00:00.000Z",
  "totalSites": 3,
  "healthySites": 2,
  "degradedSites": 1,
  "downSites": 0,
  "sites": [
    {
      "site": "Budds Plumbing",
      "url": "https://buddsplumbing.com",
      "status": "healthy",
      "responseTime": 234,
      "statusCode": 200,
      "timestamp": "2025-10-23T10:00:00.000Z",
      "errors": [],
      "checks": {
        "reachable": true,
        "ssl": true,
        "fastResponse": true,
        "validHtml": true
      }
    }
  ]
}
```

---

## Setting Up Monitoring for New Site

1. Add site to `SITES` array in `scripts/monitor-deployments.ts`:

```typescript
const SITES: SiteConfig[] = [
  {
    id: 'new-site',
    name: 'New Business',
    url: 'https://new-site.com',
    dataset: 'site-new',
  },
  // ... other sites
]
```

2. Add to external monitors (UptimeRobot, Pingdom, etc.)
3. Test monitoring:

```bash
pnpm monitor --site=new-site
```

4. Verify alerts work
5. Document in runbook

---

## Monitoring Checklist

After each deployment:

- [ ] Run health check: `curl https://site.com/api/health`
- [ ] Run full monitor: `pnpm monitor --all`
- [ ] Check response times are < 2s
- [ ] Verify SSL certificate valid
- [ ] Check error rates in logs
- [ ] Test alert system (if first deployment)
- [ ] Document any issues

---

## Advanced Monitoring

### Custom Health Checks

Extend the monitoring API:

```typescript
// src/app/api/monitor/route.ts
async function performAdvancedChecks() {
  return {
    database: await checkDatabase(),
    cache: await checkCache(),
    api: await checkExternalAPI(),
    features: await checkFeatureFlags(),
  }
}
```

### Performance Monitoring

Integrate with Lighthouse CI:

```bash
# Run Lighthouse checks
pnpm lhci:autorun

# In CI/CD pipeline
- name: Lighthouse CI
  run: pnpm lhci:autorun
```

### Real User Monitoring (RUM)

Use Vercel Speed Insights or Web Vitals:

```typescript
import { sendToVercelAnalytics } from '@vercel/analytics'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(sendToVercelAnalytics)
getFID(sendToVercelAnalytics)
getLCP(sendToVercelAnalytics)
```

---

## Monitoring Costs

**Free Tiers:**
- UptimeRobot: 50 monitors
- Pingdom: 1 monitor
- Vercel Analytics: Included
- Health Check API: Free (on your infrastructure)

**Paid Options:**
- UptimeRobot Pro: $7/month (50 monitors, 1-min intervals)
- Pingdom Starter: $10/month (10 monitors)
- Grafana Cloud: $49/month
- Datadog: $15/host/month

---

## Support

For monitoring issues:

1. Check this guide
2. Verify site is actually up
3. Test API endpoints manually
4. Check service status pages
5. Contact monitoring service support

---

**Remember:** Good monitoring prevents bad deployments from affecting users. Monitor early, monitor often, and act on alerts quickly.
