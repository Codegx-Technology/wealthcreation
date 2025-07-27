# Deployment Checklist for Wealth Creation Registration App

## 1. Local Development
- [ ] All features tested and working locally
- [ ] Stripe integration works in test and/or live mode as intended
- [ ] No secrets (API keys, .env) are committed to the repository
- [ ] `.env` is listed in `.gitignore`

## 2. Preparing for GitHub Push
- [ ] Stage only code and config files (not `.env`)
- [ ] Run `git status` to confirm `.env` is not staged
- [ ] Commit changes with a clear message
- [ ] Push to the correct branch (e.g., `railway-deploy`)
- [ ] Confirm push succeeded and appears on GitHub

## 3. GitHub Repository
- [ ] Confirm latest commit is visible on the correct branch
- [ ] No secrets are present in any commit
- [ ] GitHub push protection is not blocking the push

## 4. Railway Setup
- [ ] Railway project is connected to the correct GitHub repository
- [ ] Deploy branch is set to `railway-deploy` (or your chosen branch)
- [ ] Root directory is `/` (or blank, if deploying from repo root)
- [ ] Start command is `npm run start`
- [ ] Environment variables (Stripe keys, etc.) are set in Railway dashboard
- [ ] Auto-deploy is enabled

## 5. Deployment
- [ ] Trigger a deploy (by push or manual redeploy)
- [ ] Monitor Railway build logs for errors
- [ ] Wait for deployment to complete successfully

## 6. Post-Deployment Verification
- [ ] Visit the live Railway URL
- [ ] Hard refresh browser (`Ctrl+F5` or `Cmd+Shift+R`)
- [ ] Confirm all new features/changes are visible
- [ ] Test Stripe payment (in test mode if possible)
- [ ] Check Railway logs for any runtime errors

## 7. Stripe Safety
- [ ] Use `sk_test_...` for testing, `sk_live_...` for production
- [ ] Never commit Stripe secret keys to GitHub
- [ ] Confirm correct key is set in Railway environment variables
- [ ] Test with Stripe test cards in test mode

## 8. Troubleshooting
- [ ] If changes are not visible, check:
    - [ ] GitHub branch and commit
    - [ ] Railway deploy branch and logs
    - [ ] Browser cache (hard refresh)
    - [ ] Environment variables in Railway
- [ ] If push is blocked, unstage `.env` and recommit
- [ ] If Railway is not deploying, reconnect repo and set correct branch

---
**Tip:** Keep this checklist updated as your deployment process evolves! 