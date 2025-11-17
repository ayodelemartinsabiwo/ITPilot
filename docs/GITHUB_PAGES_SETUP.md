# GitHub Pages Setup Guide

## Quick Preview Deployment

This guide will help you deploy the ITPilot landing page to GitHub Pages for a quick preview.

## Prerequisites

- GitHub account
- Repository pushed to GitHub
- GitHub Pages enabled in repository settings

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/ayodelemartinsabiwo/ITPilot`
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - Source: **GitHub Actions** (recommended)
   - Or: Branch: `main` and folder: `/ (root)`

### 2. Configure Repository Settings

The workflow file `.github/workflows/deploy-pages.yml` is already configured and will:
- Automatically build the Next.js app on every push to main/master
- Export it as static HTML
- Deploy to GitHub Pages

### 3. Trigger Deployment

**Option A: Push to Main Branch**
```bash
git checkout main
git merge claude/itpilot-srs-document-016uV7juCJjQKTz42WjCJKuR
git push origin main
```

**Option B: Manual Trigger**
1. Go to **Actions** tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

### 4. Access Your Site

Once deployed, your site will be available at:
```
https://ayodelemartinsabiwo.github.io/ITPilot/
```

## What Gets Deployed

The GitHub Pages deployment includes:
- ✅ Landing page with hero section
- ✅ Features showcase
- ✅ Statistics display
- ✅ Orange/Black/White theme
- ✅ Responsive design
- ✅ Animations

**Note**: This is a **static preview only**. The full application with backend requires proper hosting.

## Limitations of GitHub Pages

GitHub Pages is great for previews but has limitations:
- ❌ No backend/API support
- ❌ No WebSocket connections
- ❌ No server-side rendering
- ❌ No database
- ✅ Perfect for landing pages and documentation

## Alternative Deployment Options

### For Full Application Preview:

1. **Vercel (Recommended for Next.js)**
   - Free tier available
   - Automatic deployments
   - Serverless functions support
   - [Deploy to Vercel](https://vercel.com/new)

2. **Netlify**
   - Free tier available
   - Form handling
   - [Deploy to Netlify](https://app.netlify.com/start)

3. **Railway.app**
   - Free tier with backend support
   - Can host PostgreSQL
   - [Deploy to Railway](https://railway.app)

4. **Render**
   - Free tier with backend
   - PostgreSQL included
   - [Deploy to Render](https://render.com)

## Deploy Full App to Vercel (Free)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy frontend:
```bash
cd frontend
vercel
```

3. Follow prompts to connect your GitHub account

4. Your app will be live at: `https://your-app.vercel.app`

## Environment Variables for Production

When deploying to any platform, set these environment variables:

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
NEXT_PUBLIC_WS_URL=wss://your-backend-url.com/ws
```

**Backend:**
```
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SECRET_KEY=your-secret-key
# ... (see backend/.env.example for full list)
```

## Troubleshooting

### Build Fails
- Check Node.js version (should be 20+)
- Verify all dependencies are in package.json
- Check GitHub Actions logs

### 404 Error
- Ensure `.nojekyll` file exists in public folder
- Check basePath in next.config.js
- Verify GitHub Pages is enabled

### Styling Issues
- Clear browser cache
- Check browser console for errors
- Verify Tailwind CSS is building correctly

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to `frontend/public/`:
```
your-domain.com
```

2. In GitHub Settings > Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS"

3. Configure DNS:
   - Add CNAME record pointing to: `ayodelemartinsabiwo.github.io`

## Monitoring

Check deployment status:
- **Actions Tab**: See build logs
- **Deployments**: View deployment history
- **Pages Settings**: See published URL

---

## Quick Commands

```bash
# Build static export locally
cd frontend
npm run build

# Test static export
npx serve out

# Deploy to Vercel
cd frontend
vercel --prod

# Check GitHub Pages status
gh workflow view "Deploy to GitHub Pages"
```

---

**Your preview site will showcase the beautiful Orange/Black/White design and give visitors a great first impression!** 🚀
