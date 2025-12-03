# GitHub Pages Setup Instructions

## Current Configuration

Your repository name is: **RealEstateDashboard**

## GitHub Pages URL

Your site will be available at:
```
https://cdtalley.github.io/RealEstateDashboard/
```

**NOT** `https://cdtalley.github.io/real-estate-dashboard/estate-dashboard/`

## Steps to Deploy

1. **Update basePath** (if needed):
   - If your repo is named `RealEstateDashboard`, the basePath should be `/RealEstateDashboard`
   - If you renamed it to `real-estate-dashboard`, change basePath to `/real-estate-dashboard`
   - Check `next.config.js` to verify

2. **Push your code**:
   ```bash
   git add .
   git commit -m "Fix build and configure GitHub Pages"
   git push
   ```

3. **Enable GitHub Pages**:
   - Go to: https://github.com/cdtalley/RealEstateDashboard/settings/pages
   - Under **Source**, select **"GitHub Actions"** (NOT "Deploy from a branch")
   - Save

4. **Check Deployment**:
   - Go to: https://github.com/cdtalley/RealEstateDashboard/actions
   - Wait for "Deploy to GitHub Pages" workflow to complete
   - Check for any errors

5. **Access Your Site**:
   - After deployment completes, visit: `https://cdtalley.github.io/RealEstateDashboard/`
   - It may take 1-2 minutes for DNS to propagate

## Troubleshooting

### If you get 404:
- Verify the repository name matches the basePath in `next.config.js`
- Check that GitHub Actions workflow completed successfully
- Ensure Pages source is set to "GitHub Actions"

### If build fails:
- Check the Actions tab for error messages
- Verify all dependencies are in `package.json`
- Make sure `output: 'export'` is in `next.config.js`

### If assets don't load:
- Verify `basePath` and `assetPrefix` match your repo name
- Check browser console for 404 errors
- Ensure `trailingSlash: true` is set

