// Temporary config to exclude API routes from build
// This is a workaround for static export with API routes

module.exports = {
  ...require('./next.config.js'),
  // API routes will be skipped automatically with output: 'export'
}

