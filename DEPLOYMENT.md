# GitHub Pages Deployment Guide

This guide will help you deploy your Real Estate Dashboard to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your local machine
3. Your code pushed to a GitHub repository

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `real-estate-dashboard` (or your preferred name)
3. **Important**: Make it public (GitHub Pages free tier requires public repos) OR upgrade to GitHub Pro for private repos

## Step 2: Push Your Code

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Real Estate Dashboard"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/real-estate-dashboard.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select:
   - **Deploy from a branch**: `gh-pages` (will be created automatically)
   - OR select **GitHub Actions** (recommended - uses the workflow we created)

## Step 4: Configure Base Path (If Needed)

If your repository name is NOT `real-estate-dashboard`, you need to update the base path:

1. Open `next.config.js`
2. Uncomment and update these lines:
```javascript
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name',
```

## Step 5: Wait for Deployment

1. After pushing, GitHub Actions will automatically build and deploy
2. Go to **Actions** tab in your repository to see the deployment progress
3. Once complete, your site will be available at:
   - `https://YOUR_USERNAME.github.io/real-estate-dashboard/`
   - (or `https://YOUR_USERNAME.github.io/your-repo-name/` if different name)

## Step 6: Update GitHub Pages Settings (If Using Actions)

If you chose GitHub Actions:
1. Go to **Settings** → **Pages**
2. Under **Build and deployment**, select **GitHub Actions**
3. The workflow will automatically deploy on every push to `main`

## Troubleshooting

### Build Fails
- Check the **Actions** tab for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### 404 Errors
- Check that `basePath` in `next.config.js` matches your repository name
- Ensure the workflow completed successfully
- Wait a few minutes for DNS propagation

### Assets Not Loading
- Verify `assetPrefix` matches `basePath`
- Check browser console for 404 errors
- Ensure all static assets are in the `public` folder

### API Routes Not Working
- GitHub Pages only serves static files
- API routes have been converted to client-side data generation
- This is expected behavior for static hosting

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the static export
npm run build

# The 'out' folder contains your static site
# You can deploy this folder to any static hosting service
```

## Custom Domain (Optional)

1. Add a `CNAME` file to the `public` folder with your domain name
2. Configure DNS records as per GitHub Pages documentation
3. Update domain in repository settings

## Notes

- The dashboard uses client-side data generation for GitHub Pages compatibility
- All data is generated dynamically in the browser (no backend needed)
- The site is fully static and will work offline after initial load
- GitHub Actions automatically rebuilds on every push to `main`

