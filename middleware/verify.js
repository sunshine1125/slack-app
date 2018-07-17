const crypto = require('crypto');
const helpers = require('../common/helpers');

// get secret middleware
const getAgentSecret = (req, res, next) => {
  if (req.headers.hasOwnProperty('user-agent')) {
    req.sourceName = helpers.findAgentName(req.headers['user-agent']);
  } else if (req.headers.hasOwnProperty('x-gitlab-event')) {
    req.sourceName = 'gitlab';
  }
  req.secret = helpers.findAgentByName(req.sourceName).secret;
  next();
};

// hub signature verification middleware
const verifyHubSignature = (req, res, next) => {
  const signature =
    req.headers['x-hub-signature'] ||
    req.headers['x-coding-signature'] ||
    req.headers['x-gitlab-token'];
  if (signature !== undefined) {
    let expectedSignature = '';
    if (req.sourceName === 'bitbucket-server') {
      const hmac = crypto.createHmac('sha256', req.secret);
      hmac.update(JSON.stringify(req.body));
      expectedSignature = 'sha256=' + hmac.digest('hex');
    } else if (req.sourceName === 'gitlab') {
      expectedSignature = req.secret;
    } else {
      const hmac = crypto.createHmac('sha1', req.secret);
      hmac.update(JSON.stringify(req.body));
      expectedSignature = 'sha1=' + hmac.digest('hex');
    }
    if (expectedSignature !== signature) {
      res.status(400).send('Invalid signature');
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = {
  getAgentSecret,
  verifyHubSignature,
};
