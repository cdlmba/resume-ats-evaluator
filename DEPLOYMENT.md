# Deployment Guide

## Step 1: Push to GitHub

### Option A: Using GitHub Web Interface (Recommended)

1. Go to https://github.com/new
2. Repository name: `resume-ats-evaluator`
3. Description: "Web app to evaluate resumes against job descriptions using ATS best practices"
4. Choose Public or Private
5. **DO NOT** check "Initialize this repository with a README" (we already have one)
6. Click "Create repository"

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create resume-ats-evaluator --public --source=. --remote=origin --push
```

### Step 2: Add Remote and Push

After creating the repository, run these commands (replace YOUR_USERNAME with your GitHub username):

```bash
cd C:\Users\Test\resume-ats-evaluator
git remote add origin https://github.com/YOUR_USERNAME/resume-ats-evaluator.git
git branch -M main
git push -u origin main
```

If you're using SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/resume-ats-evaluator.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Web Interface (Easiest)

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Click "Import Project"
4. Select your `resume-ats-evaluator` repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"
7. Wait for deployment to complete (usually 1-2 minutes)
8. Your app will be live at `https://resume-ats-evaluator.vercel.app`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd C:\Users\Test\resume-ats-evaluator
   vercel
   ```

3. Follow the prompts:
   - Login to your Vercel account
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

## What Happens After Deployment?

- Your app will be live on a Vercel URL
- Every push to the main branch will trigger automatic deployments
- You can set up custom domains in Vercel dashboard
- All API routes will work automatically

## Troubleshooting

### If push fails:
- Make sure you're authenticated with GitHub
- Check if you need to set up SSH keys or use a personal access token
- Verify the repository URL is correct

### If Vercel deployment fails:
- Check that all dependencies are in package.json
- Verify the build command works locally: `npm run build`
- Check Vercel logs for specific errors

## Next Steps

After deployment:
1. Test your live app
2. Share the URL with others
3. Set up a custom domain (optional)
4. Configure environment variables if needed (none required for this app)

