const slackParentMessage = require('./parentMessageClass');
class messageGitLab extends slackParentMessage {
  constructor(fields) {
    super(fields);
    this.data = fields.body;
  }
  getBranchName() {
    return this.data.ref;
  }
  getRepoName() {
    return this.data.project.name;
  }
  getRepoUrl() {
    return this.data.project.web_url;
  }
  getMessage() {
    let output = [];
    if (this.data.commits) {
      this.data.commits.forEach(commit => {
        let commit_date = super.nowDate(commit.timestamp);
        let commit_url = commit.url;
        let actor_name = commit.author.name;
        let commit_message = commit.message;
        this.build(output, commit_date, commit_url, actor_name, commit_message);
      });
    }
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

module.exports = messageGitLab;
