# ITPilot Deployment Checklist

## Pre-Deployment Verification

This checklist ensures all potential issues are caught before deployment.

---

## ✅ Configuration Files

### next.config.js
- [x] **Static Export**: `output: 'export'` enabled
- [x] **No Rewrites**: Removed (incompatible with static export)
- [x] **No Redirects**: Not using redirects
- [x] **Images Unoptimized**: `unoptimized: true` set
- [x] **BasePath Set**: `/ITPilot` for GitHub Pages
- [x] **No Server Functions**: No `getServerSideProps` or `getStaticProps`
- [x] **Webpack Config**: Only client-side fallbacks

### package.json
- [x] **Valid Packages**: All package names verified
  - `tailwind-merge` (not `tailwindcss-merge`) ✅
- [x] **Compatible Versions**: All packages compatible with Next.js 14
- [x] **No Missing Dependencies**: All imports have corresponding packages

### GitHub Actions Workflow
- [x] **Correct Paths**: All paths point to `frontend/` subdirectory
- [x] **Package Detection**: Updated to check `frontend/package.json`
- [x] **Working Directory**: Set for install and build steps
- [x] **Artifact Path**: Points to `frontend/out`
- [x] **Branch Trigger**: Includes current branch name

---

## ✅ Code Quality Checks

### No Server-Side Code
- [x] **No 'use server'**: No server directives found
- [x] **No SSR Functions**: No getServerSideProps/getStaticProps
- [x] **Client Components**: All interactive components use 'use client'

### No Build-Time API Calls
- [x] **No Top-Level Fetches**: No API calls during module load
- [x] **Client-Side Only**: All API calls wrapped in useEffect or event handlers
- [x] **Error Handling**: All API calls have try/catch blocks

### Component Structure
- [x] **Landing Page**: Works without backend (static content)
- [x] **Navbar**: No API dependencies on mount
- [x] **Footer**: Pure static content
- [x] **Providers**: Only client-side state initialization

---

## ✅ Asset Management

### Images
- [x] **Unoptimized**: Required for static export
- [x] **No External Domains**: Not needed for static site
- [x] **Public Folder**: All static assets in public/

### Fonts
- [x] **Google Fonts**: Using next/font loader (compatible)
- [x] **No Custom Font Files**: Or properly placed in public/

---

## ✅ Routing

### Static Routes Only
- [x] **No Dynamic Routes**: Or properly handled with generateStaticParams
- [x] **No Catch-All Routes**: Not using [...slug]
- [x] **No API Routes**: Would require server

### Links
- [x] **Relative Links**: All internal links use next/link
- [x] **BasePath Aware**: Links work with /ITPilot prefix

---

## ✅ External Dependencies

### Third-Party Services
- [x] **No Required Backend**: Landing page works standalone
- [x] **No WebSocket on Mount**: Only connects after user action
- [x] **Graceful Failures**: All external calls handle errors

### Environment Variables
- [x] **NEXT_PUBLIC_ Prefix**: All client-side env vars properly prefixed
- [x] **Defaults Set**: Fallback values for all env vars
- [x] **No Secrets**: No sensitive data in client code

---

## ✅ Build Process

### Local Test
```bash
cd frontend
npm install
npm run build
npx serve out
```

Expected results:
- [x] Build completes without errors
- [x] No warnings about rewrites/redirects
- [x] Output directory created at `frontend/out`
- [x] Site works when served locally
- [x] All styles load correctly
- [x] All images display
- [x] Navigation works

---

## ✅ GitHub Pages Specific

### Configuration
- [x] **.nojekyll File**: Created in public/
- [x] **BasePath**: Set to repository name
- [x] **404.html**: Optional custom 404 page
- [x] **CNAME**: Optional for custom domain

### Permissions
- [x] **Actions Enabled**: Repository has Actions enabled
- [x] **Pages Enabled**: GitHub Pages configured
- [x] **Workflow Permissions**: Read and write permissions set

---

## 🔍 Common Issues & Solutions

### Issue: "Unable to determine package manager"
**Solution**: ✅ Fixed - workflow checks `frontend/package.json`

### Issue: "No versions available for [package]"
**Solution**: ✅ Fixed - corrected package name to `tailwind-merge`

### Issue: "Invalid rewrite found"
**Solution**: ✅ Fixed - removed rewrites from next.config.js

### Issue: "export-no-custom-routes warning"
**Solution**: ✅ Fixed - removed rewrites/redirects

### Issue: Build fails with module not found
**Solution**: Check all imports and ensure packages are in package.json

### Issue: Blank page after deployment
**Solution**:
- Check basePath is correct
- Check browser console for 404 errors
- Verify output directory structure

### Issue: Styles not loading
**Solution**:
- Ensure Tailwind config is correct
- Check globals.css is imported
- Verify PostCSS config

---

## 📋 Pre-Push Checklist

Before pushing to trigger deployment:

- [x] All files saved
- [x] No console.log statements (or intentional)
- [x] No commented-out code (unless intentional)
- [x] Package.json has correct dependencies
- [x] next.config.js is valid
- [x] Local build test passed
- [x] Git changes committed
- [x] Commit message is clear

---

## 🚀 Deployment Steps

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "Your descriptive message"
   ```

2. **Push to Branch**
   ```bash
   git push origin claude/itpilot-srs-document-016uV7juCJjQKTz42WjCJKuR
   ```

3. **Monitor Workflow**
   - Go to Actions tab
   - Watch build progress
   - Check for errors

4. **Verify Deployment**
   - Wait for green checkmark
   - Visit: https://ayodelemartinsabiwo.github.io/ITPilot/
   - Test all functionality

---

## 🎯 Post-Deployment Verification

After deployment succeeds:

- [ ] Site loads without errors
- [ ] Landing page displays correctly
- [ ] All images load
- [ ] All styles apply
- [ ] Navigation works
- [ ] Links work correctly
- [ ] Mobile responsive
- [ ] Fast loading time
- [ ] No console errors

---

## 📊 Monitoring

### Check Build Logs
If deployment fails:
1. Go to Actions tab
2. Click on failed workflow
3. Click on "build" job
4. Expand failing step
5. Read error message
6. Apply fix from "Common Issues" above

### Performance
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

---

## 🔄 Rollback Plan

If deployment breaks:

1. **Quick Fix**: Revert last commit
   ```bash
   git revert HEAD
   git push
   ```

2. **Full Rollback**: Reset to previous working commit
   ```bash
   git reset --hard <previous-commit-hash>
   git push --force
   ```

3. **Emergency**: Disable GitHub Pages temporarily
   - Settings → Pages → Source → None

---

## 📝 Notes

- GitHub Pages deployment takes 2-5 minutes
- Cache may cause old version to show (hard refresh: Ctrl+Shift+R)
- First deployment may take longer
- Subsequent deployments are faster with caching

---

**Last Updated**: 2025-11-18
**Status**: ✅ All checks passed
**Ready for Deployment**: YES
