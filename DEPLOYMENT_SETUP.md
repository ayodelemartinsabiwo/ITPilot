# ITPilot Deployment Setup Guide

## Railway Backend Setup

### 1. Add PostgreSQL Database
In Railway dashboard:
1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Wait for provisioning
3. Railway will automatically add `DATABASE_URL` to your backend service

### 2. Required Environment Variables

Add these in Railway → Your Backend Service → Variables:

```bash
# Django Settings
DEBUG=False
SECRET_KEY=your-secret-key-here-min-50-chars
ALLOWED_HOSTS=your-backend.up.railway.app,your-backend.railway.app

# CORS Settings (Add your Vercel domain)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000

# Database (Auto-added by Railway PostgreSQL)
DATABASE_URL=postgres://...

# JWT Settings (Optional - defaults will work)
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=7
JWT_SECRET_KEY=your-jwt-secret-key

# Email Settings (Optional - registration works without this)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@itpilot.com

# Encryption (Optional - for sensitive data encryption)
AES_ENCRYPTION_KEY=your-32-char-encryption-key-here
```

### 3. Get Your Railway Backend URL
1. Go to your backend service → Settings
2. Under "Networking" → Click "Generate Domain"
3. Copy the URL (e.g., `https://your-app.up.railway.app`)

---

## Vercel Frontend Setup

### 1. Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api/v1
NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
```

**Important:** Select all environments (Production, Preview, Development)

### 2. Redeploy
1. Go to Deployments tab
2. Click "..." on latest deployment → "Redeploy"

---

## Testing the Connection

### 1. Check Backend Health
Visit: `https://your-backend.up.railway.app/admin/`
- You should see Django admin login page

### 2. Check API
Visit: `https://your-backend.up.railway.app/api/docs/`
- You should see Swagger API documentation

### 3. Test Registration
1. Go to your Vercel frontend URL
2. Click "Sign Up"
3. Fill in the registration form
4. Submit

### 4. Check Browser Console
1. Open DevTools (F12)
2. Go to Network tab
3. Look for the registration request
4. Check:
   - Request URL should point to Railway backend
   - Status should be 201 (Created)
   - Response should have `"success": true`

---

## Troubleshooting

### Registration Still Failing?

**Check 1: Database Connection**
```bash
# In Railway backend logs, look for:
"Database connected successfully"
```

**Check 2: CORS Issues**
In browser console, if you see:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

Solution: Add your Vercel domain to `CORS_ALLOWED_ORIGINS` on Railway

**Check 3: API URL**
In browser console → Network tab:
- Registration request should go to `https://your-backend.up.railway.app/api/v1/auth/register/`
- NOT `http://localhost:8000/...`

**Check 4: Database Migrations**
In Railway logs, ensure you see:
```
Running migrations:
  Applying authentication.0001_initial... OK
  Applying authentication.0002_...  OK
```

---

## Common Errors & Solutions

### Error: "Failed to create account"

**Solution 1:** Check Railway logs for actual error
1. Railway Dashboard → Your Service → Deployments
2. Click on latest deployment
3. View Logs

**Solution 2:** Ensure PostgreSQL is added and connected
1. Check if DATABASE_URL exists in environment variables
2. Verify database shows "Active" status

### Error: "Network Error" in frontend

**Solution:** Frontend can't reach backend
1. Verify `NEXT_PUBLIC_API_URL` in Vercel env vars
2. Ensure Railway backend is deployed and healthy
3. Check CORS settings on backend

### Error: "Invalid credentials" after registration

This is expected! Email verification is optional. Try:
1. Go to Django admin: `https://your-backend.up.railway.app/admin/`
2. Login with Railway superuser (create if needed)
3. Find your user account
4. Check "Email verified" checkbox
5. Save

---

## Creating Django Superuser

To access Django admin:

```bash
# In Railway dashboard:
1. Go to your backend service
2. Click "Settings" → "Deploy"
3. In "Custom Start Command" (temporary):
   cd backend && /app/venv/bin/python manage.py createsuperuser

4. Watch logs for prompts
5. Enter email, password when prompted
6. Remove the custom command after creation
7. Redeploy with normal start command
```

---

## Quick Reference

**Backend URL Pattern:**
```
https://your-app.up.railway.app/api/v1/[endpoint]
```

**Frontend ENV Format:**
```
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api/v1
```

**Test Endpoints:**
- Health: `/admin/`
- API Docs: `/api/docs/`
- Register: `/api/v1/auth/register/`
- Login: `/api/v1/auth/login/`
- Profile: `/api/v1/auth/profile/`
