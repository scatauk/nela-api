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
      ssh_options: 'IdentitiesOnly=yes -i ~/.ssh/pm2_deploy ForwardAgent=yes',
      user: process.env.DEPLOY_USER || 'deploy',
      host: [process.env.DEPLOY_HOST],
      ref: process.env.DEPLOY_REF || 'origin/main',
      repo: 'git@github.com:scatauk/nela-api.git',
      path: process.env.DEPLOY_PATH, // from secrets
      'post-deploy':
        process.env.POST_DEPLOY ||
        'npm ci --omit=dev && npm run build && pm2 reload ecosystem.config.js --only nela-api',
    },
  },
};
