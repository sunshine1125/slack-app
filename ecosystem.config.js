module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'slack-app',
      script: 'index.js',
      env: {
        // the common env
        PORT: 3009,
      },
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    master: {
      host: ['match-node-test', 'match-node-live'],
      user: 'ubuntu',
      ref: 'origin/master',
      repo: 'git@github.com:liangtongzhuo/slack-app.git',
      path: '/home/ubuntu/slack-app',
      // "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      'post-deploy': 'npm install && pm2 startOrReload ecosystem.config.js --env production',
    },
  },
};
