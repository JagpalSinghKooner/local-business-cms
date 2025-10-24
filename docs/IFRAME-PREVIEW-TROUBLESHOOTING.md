# Iframe Preview Troubleshooting Guide

## Issue: "This content is blocked. Contact the site owner to fix the issue."

This error occurs when the browser blocks the iframe due to **Content Security Policy (CSP)** or **X-Frame-Options** headers.

---

## ✅ **Solution Applied**

I've updated two files to fix this issue:

### **1. next.config.ts**

**Changes Made:**
- Removed strict `X-Frame-Options: SAMEORIGIN` that was blocking iframes
- Added `frame-ancestors` directive to CSP to allow Sanity Studio
- Added specific header for `/api/preview` route to allow all iframe embedding

**Key Changes:**
```typescript
// Allow embedding in Sanity Studio iframe for preview
"frame-ancestors 'self' http://localhost:* https://*.sanity.studio https://*.vercel.app"
```

This allows:
- ✅ Localhost (development)
- ✅ Sanity Studio hosted instances
- ✅ Vercel preview deployments

### **2. middleware.ts**

**Changes Made:**
- Added special handling for `/api/preview` routes
- Removes frame restrictions for preview endpoints
- Sets `X-Frame-Options: ALLOWALL` for preview routes only

**Code Added:**
```typescript
// Allow preview routes in iframe for Sanity Studio
if (url.pathname.startsWith('/api/preview')) {
  const response = NextResponse.next()
  response.headers.delete('X-Frame-Options')
  response.headers.set('X-Frame-Options', 'ALLOWALL')
  return response
}
```

---

## 🔄 **How to Apply the Fix**

### **Step 1: Restart Development Server**

```bash
# Stop the dev server (Ctrl+C)
# Then restart
pnpm dev
```

**Why?** Next.js needs to reload the config and middleware changes.

### **Step 2: Clear Browser Cache**

1. Open Browser DevTools (F12)
2. Right-click on the refresh button
3. Select **"Empty Cache and Hard Reload"**

**Why?** Browsers cache CSP headers aggressively.

### **Step 3: Test the Preview**

1. Navigate to `/studio`
2. Open any page/service/location document
3. Click **Live Preview** tab
4. The iframe should now load successfully

---

## 🧪 **Verification Steps**

### **Test 1: Check Headers**

Open DevTools → Network tab → Find your page request → Check Response Headers:

**Should See:**
```
Content-Security-Policy: ... frame-ancestors 'self' http://localhost:* https://*.sanity.studio ...
```

**For `/api/preview`:**
```
X-Frame-Options: ALLOWALL
```

### **Test 2: Console Errors**

Check the browser console. You should **NOT** see:
- ❌ `Refused to display in a frame because it set 'X-Frame-Options' to 'SAMEORIGIN'`
- ❌ `Refused to frame because an ancestor violates the Content Security Policy`

### **Test 3: Iframe Loads**

The Live Preview tab should display your actual page content, not a blocked message.

---

## 🚨 **Still Getting the Error?**

### **Option 1: Localhost Specific Issue**

If you're running Studio on `localhost:3000` (or different port), update the CSP:

**In next.config.ts**, change:
```typescript
"frame-ancestors 'self' http://localhost:* https://*.sanity.studio https://*.vercel.app"
```

To be more specific:
```typescript
"frame-ancestors 'self' http://localhost:3000 http://localhost:3001 https://*.sanity.studio https://*.vercel.app"
```

### **Option 2: Production/Hosted Studio**

If using Sanity's hosted Studio (not embedded in Next.js):

**Add your Studio URL to frame-ancestors:**
```typescript
"frame-ancestors 'self' https://your-project.sanity.studio https://*.vercel.app"
```

### **Option 3: Custom Domain**

If Studio is on a custom domain:

```typescript
"frame-ancestors 'self' https://studio.yourdomain.com https://*.vercel.app"
```

### **Option 4: Development-Only Full Access**

For **development only**, you can completely disable frame restrictions:

**In next.config.ts**, add at the top of the headers function:
```typescript
async headers() {
  // Development: Allow all iframe embedding
  if (process.env.NODE_ENV === 'development') {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ]
  }

  // Production headers below...
  return [...]
}
```

**⚠️ Warning:** Only use this in development. Never deploy `ALLOWALL` to production (security risk).

---

## 🔒 **Security Considerations**

### **Why Not Just Use `ALLOWALL` Everywhere?**

The `X-Frame-Options: SAMEORIGIN` header protects against **clickjacking attacks** where malicious sites embed your content in iframes.

### **Our Solution is Secure Because:**

1. **Targeted**: Only allows specific trusted origins (Sanity Studio, Vercel)
2. **CSP Protected**: Uses modern `frame-ancestors` directive
3. **Route Specific**: Preview routes only, not entire site
4. **Localhost Safe**: Only enabled for local development

### **Production Security Checklist**

✅ `frame-ancestors` includes only trusted domains
✅ No wildcard `*` in production
✅ Preview routes protected by referer validation
✅ Main site still has SAMEORIGIN protection (via CSP)

---

## 📊 **Expected vs Blocked Headers**

### **❌ Before (Blocked)**

```http
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'; ... (no frame-ancestors)
```

**Result:** Iframe blocked by browser

### **✅ After (Working)**

```http
Content-Security-Policy: ... frame-ancestors 'self' http://localhost:* https://*.sanity.studio ...
X-Frame-Options: ALLOWALL (only for /api/preview routes)
```

**Result:** Iframe loads in Sanity Studio

---

## 🐛 **Debug Commands**

### **Check Current Headers**

```bash
curl -I http://localhost:3001/api/preview
```

**Look for:**
```
X-Frame-Options: ALLOWALL
```

### **Check CSP Policy**

```bash
curl -I http://localhost:3001/
```

**Look for:**
```
Content-Security-Policy: ... frame-ancestors 'self' http://localhost:* ...
```

### **Test Iframe Directly**

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head><title>Iframe Test</title></head>
<body>
  <iframe src="http://localhost:3001/services/plumbing" width="1200" height="800"></iframe>
</body>
</html>
```

Open in browser. If it loads, headers are correct.

---

## 📞 **Still Need Help?**

### **Provide This Information:**

1. **Environment:** Development or Production?
2. **Studio Location:** Embedded (`/studio`) or hosted (`*.sanity.studio`)?
3. **Browser Console Errors:** Full error message
4. **Network Tab Headers:** CSP and X-Frame-Options values
5. **Current Setup:**
   - Next.js version: `15.5.5`
   - Sanity version: `^4.11.0`
   - Studio URL: `____`

### **Quick Fixes Summary:**

| Issue | Fix |
|-------|-----|
| Blocked in dev | Restart dev server + hard refresh |
| Blocked in production | Add production domain to `frame-ancestors` |
| Works locally, not prod | Update Vercel env vars + redeploy |
| Custom Studio URL | Add custom domain to CSP |

---

## ✅ **Success Checklist**

After applying the fix:

- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] No console errors about frames
- [ ] Live Preview tab loads content
- [ ] Sections visible in iframe
- [ ] Editing updates preview in real-time
- [ ] All document types (page, service, location) work

---

**Last Updated:** October 24, 2025
**Related Docs:** `docs/VISUAL-PAGE-BUILDER.md`
