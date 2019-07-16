const config = require('./env');
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const moment = require('moment');

const helpers = require('./common/helpers');
const middlewares = require('./middlewares/index');
const slackAppRouter = require('./routers/slackApp');

// https://github.com/chyingp/nodejs-learning-guide/blob/master/%E8%BF%9B%E9%98%B6/debug-log.md
const debug = require('debug');
const appDebug = debug('app');

const messageGithub = require('./SlackMessage/messageGithub');
const messageBitbucketServer = require('./SlackMessage/messageBitbucketServer');
const messageBitbucketCloud = require('./SlackMessage/messageBitbucketCloud');
const messageGitLab = require('./SlackMessage/messageGitLab');
const messageCoding = require('./SlackMessage/messageCoding');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/slack', slackAppRouter);

const PORT = process.env.PORT || 3009;

app.listen(PORT, function() {
  appDebug('Slack APP listening on port ' + PORT);
});

app.get('/', (req, res) => {
  res.send('it is working! Path Hit: ' + req.url);
});

const reqConfig = (req, res, attachments) => {
  const headers = {
    'Content-type': 'application/json',
  };
  const options = {
    url: config.channelUrl,
    method: 'POST',
    headers: headers,
    body: {
      attachments: attachments,
    },
    json: true,
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      appDebug('push message to slack success');
    }
    res.send('');
  });
};

app.post('/', middlewares, (req, res) => {
  // 平台测试请求，直接返回成功
  if (req.body.zen) {
    return res.send('success');
  }
  req.logo = helpers.findAgentByName(req.sourceName).logo;
  switch (req.sourceName) {
    case 'bitbucket-server':
      req.bitbucket_url = helpers.findAgentByName(req.sourceName).bitbucket_url;
      req.repo_url = helpers.findAgentByName(req.sourceName).repo_url;
      let messageBucketServer = new messageBitbucketServer(req);
      reqConfig(req, res, messageBucketServer.getMessage());
      break;
    case 'bitbucket-cloud':
      let messageBucketCloud = new messageBitbucketCloud(req);
      reqConfig(req, res, messageBucketCloud.getMessage());
      break;
    case 'gitlab':
      let messageGitlab = new messageGitLab(req);
      reqConfig(req, res, messageGitlab.getMessage());
      break;
    case 'Coding.net':
      let messageCodingNet = new messageCoding(req);
      reqConfig(req, res, messageCodingNet.getMessage());
      break;
    default:
      let messageGitHub = new messageGithub(req);
      reqConfig(req, res, messageGitHub.getMessage());
      break;
  }
});
