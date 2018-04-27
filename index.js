const config = require('./env');
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Store our app's ID and Secret. These we got from Step 1.
// For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to store them securely in environment variables.
const clientId = config.clientId;
const clientSecret = config.clientSecret;

const PORT = process.env.PORT || 3009;

const generateMessage = function(req) {
  let result = '';

  let data = req.body;

  for (let i = 0; i < data.commits.length; i++) {
    let commit = data.commits[i];
    let repo = data.repository;

    result +=
      commit.author.username ||
      commit.author.name +
        '>' +
        ' <' +
        commit.url +
        '|committed:> in <' +
        repo.url +
        '|' +
        repo.name +
        '> :' +
        commit.message;
    result += '\n';
  }

  return result;
};

const getDisplayName = function(displayName) {
  return displayName.split('-')[1] ? displayName.split('-')[1].trim() : displayName;
};

const messageBitbucket = function(req) {
  const BITBUCKET_URL = 'http://sh.shinetechchina.com:85/projects/RIOT/repos/';
  let data = req.body;
  let actor_name = getDisplayName(data.actor.displayName);
  let repo_name = data.repository.name;
  let commit_url = BITBUCKET_URL + data.repository.slug + '/commits/' + data.changes[0].toHash;

  let result = `[新提交 in ${repo_name}] - ${actor_name} <${commit_url}|点击查看细节>`;
  return result;
};

app.listen(PORT, function() {
  console.log('Slack app listening on port ' + PORT);
});

// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
  res.send('it is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({ Error: "Looks like we're not getting code." });
    console.log("Looks like we're not getting code.");
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
          console.log(error);
        } else {
          res.json(body);
        }
      }
    );
  }
});

// Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
app.post('/command', function(req, res) {
  res.send('Your ngrok tunnel is up and running!');
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
      console.log('push message to slack success');
    }
    res.send('');
  });
});
