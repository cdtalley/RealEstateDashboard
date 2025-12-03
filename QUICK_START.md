# Quick Start Guide

## Local Development

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## Build for Static Export

```bash
npm run build
```

The `out` folder contains your static site ready for deployment.

## Common Issues

### Issue: Dashboard shows loading forever
**Solution**: Check browser console for errors. The data should load automatically via static data generation.

### Issue: Charts not rendering
**Solution**: Ensure all dependencies are installed: `npm install`

### Issue: GitHub Pages deployment fails
**Solution**: 
1. Check that `output: 'export'` is in `next.config.js`
2. Verify GitHub Actions workflow file exists at `.github/workflows/deploy.yml`
3. Check Actions tab in GitHub for error messages

### Issue: Data not loading on GitHub Pages
**Solution**: The dashboard automatically falls back to client-side data generation. This is expected behavior.

## Testing Static Export Locally

```bash
# Build
npm run build

# Serve the static files (install serve globally first: npm install -g serve)
npx serve out
```

Visit: http://localhost:3000

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Repository is public (or you have GitHub Pro)
- [ ] GitHub Pages enabled in Settings
- [ ] Source set to "GitHub Actions"
- [ ] Workflow file exists at `.github/workflows/deploy.yml`
- [ ] Build completes successfully in Actions tab

