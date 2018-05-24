/**
 *  @author Finley Ma <maf@shinetechsoftware.com>
 */

const exec = require('child_process').exec;

module.exports = {
  execShell,
};

/**
 * 执行 shell 返回 Promise
 */

function execShell(script) {
  return new Promise((resolve, reject) => {
    exec(script, (err, out) => {
      if (err) return reject;
      resolve(out);
    });
  });
}
