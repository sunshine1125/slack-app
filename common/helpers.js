/**
 *  @author Finley Ma <maf@shinetechsoftware.com>
 */

/**
 * 执行 shell 返回 Promise
 */

async function execShell(scriptPath) {
  const execFile = require('util').promisify(require('child_process').execFile);
  return await execFile('sh', [scriptPath]);
}

const findAgentName = userAgent => {
  let name = '';
  if (userAgent.split('-')[0]) {
    name = userAgent.split('-')[0];
    if (name === 'Bitbucket') {
      name = 'bitbucket-cloud';
      return name;
    }
  }
  if (name.indexOf('.') > 0 && name.indexOf('/') < 0) {
    name = name.split(' ')[0];
  }
  if (name.indexOf('/') > 0) {
    name = name.split('/')[1].trim();
    if (name === 'Bitbucket') {
      name = 'bitbucket-server';
    }
  }
  return name;
};

const config = require('../env');
const hosts = config.hosts;

const findAgentByName = hostName => {
  return hosts.find(host => {
    return host.name === hostName.toLowerCase();
  });
};

module.exports = {
  execShell,
  findAgentName,
  findAgentByName,
};
