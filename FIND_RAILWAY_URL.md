# How to Find Your Railway URL

## Method 1: From Networking Settings

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard

2. **Select Your Backend Service**
   - Click on the service where you deployed ITPilot backend

3. **Go to Settings Tab**
   - Look at the top navigation
   - Click **"Settings"**

4. **Find Public Networking Section**
   - Scroll down to **"Networking"**
   - Look for **"Public Networking"**

5. **Copy the Domain**
   - You should see a URL like:
     ```
     https://itpilot-production.up.railway.app
     ```
   - **Click the copy icon** next to it
   - That's your Railway backend URL!

## Method 2: From Deployments Tab

1. Go to **Deployments** tab
2. Click on the latest **Active** deployment
3. Look for **"Domains"** section
4. Copy the URL shown there

## Method 3: Quick Check

Your Railway URL will be in one of these formats:
- `https://[your-service-name].up.railway.app`
- `https://[your-service-name]-production.up.railway.app`
- `https://[random-name].railway.app`

## ✅ Verify Your URL Works

Once you have the URL, test it:

**Test 1: Admin Page**
```
https://YOUR-RAILWAY-URL.up.railway.app/admin/
```
You should see Django admin login page

**Test 2: API Docs**
```
https://YOUR-RAILWAY-URL.up.railway.app/api/docs/
```
You should see Swagger API documentation

**Test 3: Health Check**
```
https://YOUR-RAILWAY-URL.up.railway.app/api/v1/auth/register/
```
Should return a 405 error (Method Not Allowed) - this is good!
It means the endpoint exists but needs POST request.

## 🔧 What to Do With the URL

### For Vercel:

Add these environment variables in Vercel:

```
NEXT_PUBLIC_API_URL = https://YOUR-RAILWAY-URL.up.railway.app/api/v1
NEXT_PUBLIC_BACKEND_URL = https://YOUR-RAILWAY-URL.up.railway.app
```

**Replace `YOUR-RAILWAY-URL.up.railway.app` with your actual URL!**

### For Railway (CORS):

Add this environment variable in Railway:

```
CORS_ALLOWED_ORIGINS = https://your-vercel-app.vercel.app,http://localhost:3000
```

**Replace `your-vercel-app.vercel.app` with your actual Vercel URL!**

## 📌 Example

If your Railway URL is: `https://itpilot-prod.up.railway.app`

Then in Vercel, set:
```
NEXT_PUBLIC_API_URL = https://itpilot-prod.up.railway.app/api/v1
NEXT_PUBLIC_BACKEND_URL = https://itpilot-prod.up.railway.app
```

Notice:
- ✅ Include `https://`
- ✅ Add `/api/v1` for API_URL
- ✅ No trailing slash on BACKEND_URL

## ❓ Don't See the Domain?

If you don't see a domain in Railway:

1. **Check Service is Deployed**
   - Deployments tab → Should show "Active"

2. **Regenerate Domain**
   - Settings → Networking → Public Networking
   - Click "Generate Domain"
   - **Leave port field BLANK**
   - Click Generate

3. **Wait 30 seconds**
   - Domain provisioning takes a moment
   - Refresh the page
   - URL should appear

## 🚨 Port Configuration

When generating domain, Railway asks: "Where is your app listening?"

**LEAVE THIS BLANK** or let Railway auto-detect!

Your app uses `$PORT` environment variable (dynamic).
Railway handles all port mapping automatically.

---

**Next:** Once you have the URL, follow QUICK_START.md Step 3
