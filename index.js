const config = require('./env');
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const moment = require('moment');

const helpers = require('./common/helpers');

// https://github.com/chyingp/nodejs-learning-guide/blob/master/%E8%BF%9B%E9%98%B6/debug-log.md
const debug = require('debug');
const appDebug = debug('app');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Store our app's ID and Secret. These we got from Step 1.
// For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to store them securely in environment variables.
const clientId = config.clientId;
const clientSecret = config.clientSecret;

const PORT = process.env.PORT || 3009;

const getDisplayName = function(displayName) {
  return displayName.split('-')[1] ? displayName.split('-')[1].trim() : displayName;
};

const getDate = function(dateStr) {
  return dateStr.replace('+0800', '').replace('T', ' ');
};

const nowDate = function(timestamp = '') {
  if (timestamp) {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
  }
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

const message = (result, commitInfo, repInfo, isBitBucket) => {
  let text = '';
  if (!isBitBucket) {
    text = `commit message ${commitInfo.commit_message}`;
  }
  result.push({
    color: '#36a64f',
    title: `${commitInfo.actor_name} committed to [${repInfo.branch_name} - ${repInfo.repo_name}]`,
    text: `${text}`,
    thumb_url: `${repInfo.logo}`,
    actions: [
      {
        type: 'button',
        text: 'view detail',
        url: `${commitInfo.commit_url}`,
      },
    ],
    footer: `${repInfo.source} | ${commitInfo.commit_date}`,
  });
};

const messageCodingNetAndGitHub = (req, res) => {
  let repInfo = {};
  let commitInfo = {};
  let data = req.body;
  repInfo.source = req.url.substring(1);
  repInfo.branch_name = data.ref;
  repInfo.repo_name = data.repository.name;
  repInfo.logo = data.logo;
  let output = [];

  if (data.commits) {
    data.commits.forEach(commit => {
      commitInfo.commit_date = nowDate(commit.timestamp);
      commitInfo.commit_url = commit.url;
      commitInfo.actor_name = commit.author.name;
      commitInfo.commit_message = commit.message || '';
      message(output, commitInfo, repInfo, false);
    });
  } else {
    let commit = data.head_commit;
    commitInfo.commit_date = nowDate(commit.timestamp);
    commitInfo.commit_url = commit.url;
    commitInfo.actor_name = commit.author.name;
    commitInfo.commit_message = commit.message || '';
    message(output, commitInfo, repInfo, false);
  }
  return output;
};

const messageBitbucket = function(req) {
  let repInfo = {};
  let commitInfo = {};
  repInfo.bitbucket_url = 'http://sh.encootech.com:85/projects/RIOT/repos/';
  let data = req.body;
  if (data.repository.project.type === 'PERSONAL') {
    let project_owner = data.repository.project.owner.name;
    repInfo.bitbucket_url = `http://sh.encootech.com:85/users/${project_owner}/repos/`;
  }
  repInfo.source = req.url.substring(1);
  repInfo.logo = data.logo;
  repInfo.repo_name = data.repository.name;
  commitInfo.commit_date = getDate(data.date);
  commitInfo.actor_name = getDisplayName(data.actor.displayName);
  commitInfo.commit_message = '';
  let result = [];

  if (data.changes.length > 1) {
    data.changes.forEach(change => {
      commitInfo.commit_url = `${repInfo.bitbucket_url}${data.repository.slug}/commits/${
        change.toHash
      }`;
      repInfo.branch_name = change.ref.displayId;
      message(result, commitInfo, repInfo, true);
    });
  } else {
    commitInfo.commit_url = `${repInfo.bitbucket_url}${data.repository.slug}/commits/${
      data.changes[0].toHash
    }`;
    repInfo.branch_name = data.changes[0].ref.displayId;
    message(result, commitInfo, repInfo, true);
  }
  return result;
};

app.listen(PORT, function() {
  appDebug('Slack app listening on port ' + PORT);
});

// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', (req, res) => {
  res.send('it is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', (req, res) => {
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({ Error: "Looks like we're not getting code." });
    appDebug("Looks like we're not getting code.");
  } else {
    // If it's there...

    // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
    request(
      {
        url: 'https://slack.com/api/oauth.access', // URL to hit
        // Query string data
        qs: {
          code: req.query.code,
          client_id: clientId,
          client_secret: clientSecret,
        },
        method: 'GET', // Specify the method
      },
      function(error, response, body) {
        if (error) {
          debug(error);
        } else {
          res.json(body);
        }
      }
    );
  }
});

// Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
app.post('/command', (req, res) => {
  res.send('Your ngrok tunnel is up and running!');
});

// 连接mongo，查询吃啥表，返回一个记录
app.post('/fan', (req, res) => {
  const allDinner = require('./config/common').allDinner;
  const index = Math.floor(Math.random() * allDinner.length);
  res.send(allDinner[index]);
});

app.post('/fan-list', (req, res) => {
  const allDinner = require('./config/common').allDinner;
  res.send(allDinner.join(','));
});

app.post('/coding-net', (req, res) => {
  // coding自动发的测试请求，直接返回成功
  if (req.body.zen) {
    return res.send('success');
  }
  req.body.logo = 'https://source-logo.pek3b.qingstor.com/coding.png';
  const attachments = messageCodingNetAndGitHub(req, res);
  reqConfig(req, res, attachments);
});

// http://sh.shinetechchina.com:85/
app.post('/shinetech-bitbucket', (req, res) => {
  req.body.logo = 'https://source-logo.pek3b.qingstor.com/favicon.ico';
  const attachments = messageBitbucket(req);
  reqConfig(req, res, attachments);
});

app.post('/hexo', (req, res) => {
  const { stdout, stderr } = helpers.execShell('scripts/hexo.sh');
  if (stderr) {
    res.send('error');
  }
  res.send(`[${nowDate()}] success`);
});

app.post('/github', (req, res) => {
  req.body.logo = 'https://source-logo.pek3b.qingstor.com/github3.png';
  const attachments = messageCodingNetAndGitHub(req, res);
  reqConfig(req, res, attachments);
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
