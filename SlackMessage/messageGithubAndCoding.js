const slackParentMessage = require('./parentMessageClass');
class messageGithubAndCoding extends slackParentMessage {
  constructor(fields) {
    super(fields);
    this.data = fields.body;
    this.commitInfo = {};
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
  getCommit() {
    if (this.data.commits) {
      this.data.commits.forEach(commit => {
        this.commitInfo.commit_date = super.nowDate(commit.timestamp);
        this.commitInfo.commit_url = commit.url;
        this.commitInfo.actor_name = commit.author.name;
        this.commitInfo.commit_message = commit.message || '';
      });
    } else {
      let commit = this.data.head_commit;
      this.commitInfo.commit_date = super.nowDate(commit.timestamp);
      this.commitInfo.commit_url = commit.url;
      this.commitInfo.actor_name = commit.author.name;
      this.commitInfo.commit_message = commit.message || '';
    }
    return this.commitInfo;
  }
  build() {
    return {
      color: '#36a64f',
      author_name: `${this.getRepoName()}`,
      author_link: `${this.getRepoUrl()}`,
      author_icon: `${super.getRepoLogo()}`,
      title: `${
        this.getCommit().actor_name
      } committed to [${this.getBranchName()} - ${this.getRepoName()}]`,
      text: `commit message ${this.getCommit().commit_message}`,
      actions: [
        {
          type: 'button',
          text: 'view detail',
          url: `${this.getCommit().commit_url}`,
        },
      ],
      footer: `${super.getSourceName()} | ${this.getCommit().commit_date}`,
    };
  }
  output() {
    return super.output();
  }
}

module.exports = messageGithubAndCoding;
