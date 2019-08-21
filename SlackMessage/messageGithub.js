const slackParentMessage = require('./parentMessageClass');

class messageGithub extends slackParentMessage {
  constructor(fields) {
    super(fields);
    this.data = fields.body;
  }
  getBranchName() {
    return this.data.ref;
  }
  getRepoName() {
    return this.data.repository.name;
  }
  getRepoUrl() {
    return this.data.repository.html_url;
  }
  getMessage() {
    const output = [];
    if (this.data.commits) {
      this.data.commits.forEach(commit => {
        this.processData(output, commit);
      });
    } else {
      this.processData(output, this.data.head_commit);
    }
    return output;
  }

  processData(output, commit) {
    const commit_date = super.nowDate(commit.timestamp);
    const commit_url = commit.url;
    const actor_name = commit.author.name;
    const commit_message = commit.message || '';
    this.build(output, commit_date, commit_url, actor_name, commit_message);
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

module.exports = messageGithub;
