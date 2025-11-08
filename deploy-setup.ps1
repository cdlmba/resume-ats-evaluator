# Resume ATS Evaluator - Deployment Setup Script
# This script helps you push to GitHub and deploy to Vercel

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Resume ATS Evaluator - Deployment Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if remote exists
$remoteExists = git remote -v
if (-not $remoteExists) {
    Write-Host "Step 1: Setting up GitHub remote..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create a new repository on GitHub first:" -ForegroundColor White
    Write-Host "1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: resume-ats-evaluator" -ForegroundColor White
    Write-Host "3. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
    Write-Host "4. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/resume-ats-evaluator.git)"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "✓ Remote added successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ No URL provided. Please run this script again after creating the repository." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ Remote already configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to push to GitHub. Please check your credentials and try again." -ForegroundColor Red
    Write-Host "You may need to:" -ForegroundColor Yellow
    Write-Host "  - Set up SSH keys, or" -ForegroundColor Yellow
    Write-Host "  - Use a personal access token" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 3: Vercel Deployment" -ForegroundColor Yellow
Write-Host ""
Write-Host "To deploy to Vercel:" -ForegroundColor White
Write-Host "1. Install Vercel CLI: npm install -g vercel" -ForegroundColor White
Write-Host "2. Run: vercel" -ForegroundColor White
Write-Host "3. Follow the prompts to deploy" -ForegroundColor White
Write-Host ""
Write-Host "OR deploy via the web:" -ForegroundColor White
Write-Host "1. Go to https://vercel.com/new" -ForegroundColor White
Write-Host "2. Import your GitHub repository" -ForegroundColor White
Write-Host "3. Vercel will auto-detect Next.js and deploy!" -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

