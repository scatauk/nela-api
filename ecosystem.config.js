module.exports = {
  apps: [
    {
      name: 'nela-api',
      script: 'src/index.js',
      env: { NODE_ENV: 'production' },
    },
  ],

  deploy: {
    production: {
      ssh_options: ['IdentitiesOnly=yes'],
      user: process.env.DEPLOY_USER || 'deploy',
      host: [process.env.DEPLOY_HOST].filter(Boolean),
      ref: process.env.DEPLOY_REF || 'origin/main',
      repo: 'https://github.com/scatauk/nela-api.git',
      path: process.env.DEPLOY_PATH, // from secrets
      'post-deploy':
        process.env.POST_DEPLOY ||
        'npm ci --omit=dev && npm run build && pm2 reload ecosystem.config.js --only nela-api',
    },
  },
};
