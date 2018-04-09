module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name           : 'slack-app',
            script         : 'index.js',
            env: {
                NODE_ENV: 'production',
                PORT: 3009,
            },
            env_development: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            }
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        master : {
            user         : 'ubuntu',
            host         : 'cloud',
            ref          : 'origin/master',
            repo         : 'git@gitee.com:finley/pm2-demo.git',
            path         : '/home/ubuntu/node/slack-app',
            // "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
            'post-deploy': 'npm install && pm2 startOrReload ecosystem.config.js --env production'
        }
    }
};
