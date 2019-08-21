const slackParentMessage = require('./parentMessageClass');

class messageBitbucketCloud extends slackParentMessage {
  constructor(fields) {
    super(fields);
    this.data = fields.body;
    this.commitInfo = {};
  }
  getRepoName() {
    return this.data.repository.name;
  }
  getRepoUrl() {
    return this.data.repository.links.html.href;
  }
  getBranchName() {
    return this.data.push.changes[0].new.name;
  }
  getMessage() {
    let output = [];
    this.data.push.changes[0].commits.forEach(commit => {
      let commit_date = super.nowDate(commit.date);
      let commit_url = commit.links.html.href;
      let actor_name = commit.author.user.username;
      let commit_message = commit.summary.raw;
      this.build(output, commit_date, commit_url, actor_name, commit_message);
    });
    return output;
  }
  build(output, commit_date, commit_url, actor_name, commit_message) {
    output.push({
      color: '#36a64f',
      author_name: `${this.getRepoName()}`,
      author_link: `${this.getRepoUrl()}`,
      author_icon: `${super.getRepoLogo()}`,
      title: `${actor_name} committed to [${this.getBranchName()} - ${this.getRepoName()}]`,
      text: `[commit message] ${commit_message}`,
      actions: [
        {
          type: 'button',
          text: 'view detail',
          url: `${commit_url}`,
        },
      ],
      footer: `${super.getSourceName()} | ${commit_date}`,
    });
  }
}
module.exports = messageBitbucketCloud;
