const config = require('./env');
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');

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

/**
 * 给Slack发送的请求体
 * @returns {{}}
 */
function slackRequestBody(attachments) {
  return {
    attachments: attachments,
  };
}

/**
 * 给钉钉机器人发的请求体
 * https://open-doc.dingtalk.com/microapp/serverapi2/qf2nxq
 * @returns {{}}
 */
function dingRequestBody(text) {
  return {
    msgtype: 'markdown',
    markdown: {
      title: "仓库有新的代码更新",
      text: text
    },
  };
}

/**
 * Build Post Body
 * @param req
 * @param res
 * @param body
 */
const reqConfig = (req, res, body) => {
  const type = req.params.type;
  const project_name = req.params.project_name;
  let requestBody, requestUrl;
  if (type) {
    if (parseInt(type) === 1 || type.toLowerCase() === 'slack') {
      requestUrl = config.projects[project_name].slackChannelUrl;
      requestBody = slackRequestBody(body);
    } else {
      requestUrl = config.projects[project_name].dingRobotUrl;
      requestBody = dingRequestBody(body);
    }
  } else {
    requestUrl = config.projects.defaultSlackChannelUrl;
    requestBody = slackRequestBody(body);
  }

  const options = {
    url: requestUrl,
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: requestBody,
    json: true,
  };

  appDebug('request:');
  appDebug(options);

  request(options, (error, response) => {
    if (!error && response.statusCode === 200) {
      appDebug('push message to success');
    }
    else {
      // appDebug(response);
      appDebug(error);
    }
    res.end('');
  });
};

app.post('/:type?/:project_name?', middlewares, (req, res) => {
  const type = req.params.type;

  // 平台测试请求，直接返回成功
  if (req.body && req.body.zen) {
    return res.send('this is a ping event, return success immediately');
  }
  req.logo = helpers.findAgentByName(req.sourceName).logo;
  // 仓库提供商
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
      reqConfig(req, res, messageCodingNet.getPayload(type));
      break;
    default:
      let messageGitHub = new messageGithub(req);
      reqConfig(req, res, messageGitHub.getPayload(type));
      break;
  }
});
