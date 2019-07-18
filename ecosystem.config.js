module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'slack-app-3009',
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
    development: {
      host: ['cloud'],
      user: 'ubuntu',
      ref: 'origin/develop',
      repo: 'https://github.com/sunshine1125/slack-app.git',
      path: '/var/www/slack-app',
      // "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      'post-setup': 'chmod u+x scripts/*.sh',
      'post-deploy': 'npm install && pm2 startOrReload ecosystem.config.js --env production',
    },
  },
};
