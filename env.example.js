module.exports = {
  port: 3009,
  clientId: '1',
  clientSecret: '1',
  bitbucketUrl: '',
  projects: {
    xxx: {
      secret: '',
      slackChannelUrl: 'xxx',
      dingRobotUrl: 'xxx',
    },
    defaultSecret: '',
    defaultSlackChannelUrl: 'xxx',
    defaultDingRobotUrl: 'xxx',
  },
  hosts: [
    {
      name: 'github',
      logo: 'https://source-logo.pek3b.qingstor.com/github.png',
    },
    {
      name: 'coding.net',
      logo: 'xxx',
    },
    {
      name: 'bitbucket-server',
      bucket_url: 'xxx',
      repo_url: 'xxx',
      logo: 'xxx',
    },
    {
      name: 'bitbucket-cloud',
      logo: 'xxx',
    },
    {
      name: 'gitlab',
      logo: 'xxx',
    },
    {
      name: 'gitee',
      logo: 'xxx',
    },
  ],
};
