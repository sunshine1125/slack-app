/**
 *  @author Finley Ma <maf@shinetechsoftware.com>
 */

module.exports = {
  execShell,
};

/**
 * 执行 shell 返回 Promise
 */

async function execShell(scriptPath) {
  const execFile = require('util').promisify(require('child_process').execFile);
  return await execFile('sh', [scriptPath]);
}
