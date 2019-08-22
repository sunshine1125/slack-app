const crypto = require('crypto');
const helpers = require('../common/helpers');
const appDebug = require('debug')('app');
const config = require('../env');

// get secret middleware
const getAgentSecret = (req, res, next) => {
  const project_name = req.params.project_name;
  if (req.headers.hasOwnProperty('user-agent')) {
    req.sourceName = helpers.findAgentName(req.headers['user-agent']);
  } else if (req.headers.hasOwnProperty('x-gitlab-event')) {
    req.sourceName = 'gitlab';
  }
  if (project_name) {
    req.secret = config.projects[project_name].secret;
  } else if (req.params.id) {
    req.secret = config.projects[req.params.id].secret;
  } else {
    req.secret = config.projects.defaultSecret;
  }
  next();
};

// hub signature verification middleware
const verifyHubSignature = (req, res, next) => {
  const signature =
    req.headers['x-hub-signature'] ||
    req.headers['x-coding-signature'] ||
    req.headers['x-gitlab-token'] ||
    req.headers['x-gitee-token'];
  if (signature !== undefined && signature !== '') {
    let expectedSignature = '';
    if (req.sourceName === 'bitbucket-server') {
      const hmac = crypto.createHmac('sha256', req.secret);
      hmac.update(JSON.stringify(req.body));
      expectedSignature = 'sha256=' + hmac.digest('hex');
    } else if (req.sourceName === 'gitlab' || req.sourceName === 'gitee') {
      expectedSignature = req.secret;
    } else {
      const hmac = crypto.createHmac('sha1', req.secret);
      hmac.update(new Buffer(JSON.stringify(req.body)));
      expectedSignature = 'sha1=' + hmac.digest('hex');
    }
    if (expectedSignature !== signature) {
      res.status(400).send('Invalid signature');
      appDebug('reqSignature:', req.secret);
      appDebug('expectedSignature:', expectedSignature);
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = [getAgentSecret, verifyHubSignature];
