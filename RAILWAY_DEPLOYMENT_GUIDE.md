# Railway Deployment Guide - Email Configuration Fix

## 🚨 Problem
Emails work locally but not on Railway deployment because environment variables are missing.

## ✅ Solution: Set Environment Variables in Railway

### Step 1: Access Railway Dashboard
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your wealth creation project
3. Click on your service/deployment

### Step 2: Add Environment Variables
In the Railway dashboard, go to **Variables** tab and add these:

```
EMAIL_USER=solver.peters@gmail.com
EMAIL_PASSWORD=ebfo ycyx qgfj pctr
ADMIN_EMAIL=solver.peters@gmail.com
NODE_ENV=production
```

### Step 3: Important Notes
- **EMAIL_PASSWORD** must be a Gmail App Password (not your regular password)
- The App Password format is: 4 groups of 4 characters (like: `abcd efgh ijkl mnop`)
- Current password in your .env: `ebfo ycyx qgfj pctr` ✅

### Step 4: Verify Gmail App Password Setup
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not already enabled)
3. Go to **App passwords**
4. Generate new password for "Mail"
5. Use this 16-character password as `EMAIL_PASSWORD`

### Step 5: Deploy and Test
1. Save environment variables in Railway
2. Redeploy your application
3. Test form submission on deployed site
4. Check Railway logs for email confirmation

## 🔍 Debugging on Railway

### Check Logs
In Railway dashboard, go to **Deployments** → **View logs**

Look for these messages:
- `[EMAIL] ✅ Email transporter verified and ready` ✅ Good
- `[EMAIL] ❌ Email verification failed:` ❌ Problem
- `[EMAIL] Environment check:` - Shows if variables are set

### Common Issues
1. **Missing Variables**: Variables not set in Railway dashboard
2. **Wrong App Password**: Using regular Gmail password instead of App Password
3. **Gmail Security**: App passwords not enabled or 2FA not setup

## 🚀 Alternative Email Services (If Gmail Issues)

### Option 1: SendGrid (Recommended for production)
```
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your-verified-sender@yourdomain.com
```

### Option 2: Mailgun
```
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
EMAIL_FROM=your-verified-sender@yourdomain.com
```

## 📋 Environment Variables Checklist
- [ ] EMAIL_USER set in Railway
- [ ] EMAIL_PASSWORD set in Railway (16-char App Password)
- [ ] ADMIN_EMAIL set in Railway
- [ ] NODE_ENV=production set in Railway
- [ ] Gmail 2FA enabled
- [ ] Gmail App Password generated
- [ ] Railway deployment restarted after adding variables

## 🧪 Testing
1. Submit form on deployed Railway URL
2. Check participant gets confirmation email
3. Check admin gets notification email
4. Verify Railway logs show email success messages

---
*This guide ensures your email notifications work correctly on Railway deployment.*