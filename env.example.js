module.exports = {
  port: 3009,
  clientId: '1',
  clientSecret: '1',
  bitbucketUrl: '',
  channels: [
    {
      id: 1,
      name: 'xxx',
      url: 'https://hooks.slack.com/services/xxxx',
    },
    {
      id: 2,
      name: 'xxx',
      url: 'https://hooks.slack.com/services/xxxx',
    },
  ],
  defaultChannelUrl: 'https://hooks.slack.com/services/XXX',
  hosts: [
    {
      name: 'github',
      secret: '',
      logo: 'https://source-logo.pek3b.qingstor.com/github.png',
    },
    {
      name: 'coding.net',
      secret: '',
      logo: 'xxx',
    },
    {
      name: 'bitbucket-server',
      secret: 'xxx',
      bucket_url: 'xxx',
      repo_url: 'xxx',
      logo: 'xxx',
    },
    {
      name: 'bitbucket-cloud',
      secret: '',
      logo: 'xxx',
    },
    {
      name: 'gitlab',
      secret: 'xxx',
      logo: 'xxx',
    },
    {
      name: 'gitee',
      secret: 'xxx',
      logo: 'xxx',
    },
  ],
};
