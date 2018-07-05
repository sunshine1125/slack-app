const moment = require('moment');
class slackParentMessage {
  constructor(fields) {
    this.fields = fields;
  }
  getSourceName() {
    return this.fields.sourceName;
  }
  getRepoLogo() {
    return this.fields.logo;
  }
  nowDate(timestamp) {
    if (timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    }
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
  getDisplayName(displayName) {
    return displayName.split('-')[1] ? displayName.split('-')[1].trim() : displayName;
  }
  getBitbucketRepoUrl() {
    return this.fields.repo_url;
  }
  getBitbucketUrl() {
    return this.fields.bitbucket_url;
  }
  build() {
    return {
      color: '#36a64f',
      author_icon: `${this.getRepoLogo()}`,
      footer: `${this.getSourceName()}`,
    };
  }
  output() {
    let output = [];
    output.push(this.build());
    return output;
  }
}

module.exports = slackParentMessage;
