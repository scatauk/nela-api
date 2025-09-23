// ecosystem.config.js
module.exports = {
  apps: [{ name: 'nela-api', script: 'dist/server.js', env: { NODE_ENV: 'production' } }],
  deploy: {
    production: {
      user: 'deploy',
      host: ['prod-app'],
      ref: process.env.DEPLOY_REF || 'origin/main',
      repo: 'https://github.com/scatauk/nela-api.git',
      path: process.env.DEPLOY_PATH,
      ssh_options: ['IdentitiesOnly=yes'],
      'post-deploy':
        process.env.POST_DEPLOY ||
        'npm ci --omit=dev && npm run build && pm2 reload ecosystem.config.js --only nela-api',
    },
  },
};
