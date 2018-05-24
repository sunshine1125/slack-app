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

const messageCodingNet = (req, res) => {
  let data = req.body;
  let branch_name = data.ref;
  let repo_name = data.repository.name;

  let output = [];

  data.commits.forEach(commit => {
    let commit_date = moment(commit.timestamp).format('YYYY-MM-DD HH:mm:ss');
    let commit_url = commit.url;
    let actor_name = commit.author.name;
    let commit_message = commit.message || '';
    output.push(
      `[${commit_date}] ${actor_name} committed ${commit_message} to [${branch_name} - ${repo_name}] - <${commit_url}|click to see details>`
    );
  });

  return output;
};

const messageBitbucket = function(req) {
  let bitbucket_url = 'http://sh.encootech.com:85/projects/RIOT/repos/';
  let data = req.body;
  if (data.repository.project.type === 'PERSONAL') {
    let project_owner = data.repository.project.owner.name;
    bitbucket_url = `http://sh.encootech.com:85/users/${project_owner}/repos/`;
  }
  let commit_date = getDate(data.date);
  let actor_name = getDisplayName(data.actor.displayName);
  let repo_name = data.repository.name;
  // TODO 有可能一次提交包含多个changes
  let commit_url = bitbucket_url + data.repository.slug + '/commits/' + data.changes[0].toHash;
  let branch_name = data.changes[0].ref.displayId;
  let result = `[${commit_date}] ${actor_name} committed to [${branch_name} - ${repo_name}] - <${commit_url}|click to see more>`;
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
  const headers = {
    'Content-type': 'application/json',
  };
  // coding自动发的测试请求，直接返回成功
  if (req.body.zen) {
    return res.send('success');
  }
  const text = messageCodingNet(req, res);
  const options = {
    url: config.channelUrl,
    method: 'POST',
    headers: headers,
    // build message
    // https://api.slack.com/docs/message-guidelines
    body: {
      text: text instanceof Array ? text.join('\r\n') : text,
    },
    json: true,
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      appDebug('push message to slack success');
    }
    res.send('');
  });
});

// http://sh.shinetechchina.com:85/
app.post('/shinetech-bitbucket', (req, res) => {
  const headers = {
    'Content-type': 'application/json',
  };

  const text = messageBitbucket(req);
  const options = {
    url: config.channelUrl,
    method: 'POST',
    headers: headers,
    // build message
    // https://api.slack.com/docs/message-guidelines
    body: {
      text: text,
    },
    json: true,
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      appDebug('push message to slack success');
    }
    res.send('');
  });
});

app.post('/hexo', (req, res) => {
  const { stdout, stderr } = helpers.execShell('scripts/hexo.sh');
  if (stderr) {
    res.send('error');
  }
  res.send('success');
});
