const slackParentMessage = require('./parentMessageClass');

class messageBitbucketServer extends slackParentMessage {
  constructor(fields) {
    super(fields);
    this.data = fields.body;
  }
  getBitbucketUrl() {
    if (this.data.repository) {
      if (this.data.repository.project.type === 'PERSONAL') {
        let project_owner = this.data.repository.project.owner.name;
        return `${super.getBitbucketRepoUrl()}/${project_owner}/repos/`;
      }
    }
    return super.getBitbucketUrl();
  }
  getRepoName() {
    if (this.data.repository) {
      return this.data.repository.name;
    }
    return null;
  }
  getRepoUrl() {
    if (this.data.repository) {
      return `${this.getBitbucketUrl()}${this.data.repository.slug}`;
    }
    return null;
  }
  getCommitDate() {
    if (Object.keys(this.data) !== '{}') {
      return super.nowDate(this.data.date);
    }
    return null;
  }
  getActorName() {
    if (this.data.actor) {
      return super.getDisplayName(this.data.actor.displayName);
    }
    return null;
  }
  getMessage() {
    let output = [];
    if (this.data.changes) {
      if (this.data.changes.length > 1) {
        this.data.changes.forEach(change => {
          let commit_url = `${this.getBitbucketUrl()}${this.data.repository.slug}/commits/${
            change.toHash
          }`;
          let branch_name = change.ref.displayId;
          this.build(output, commit_url, branch_name);
        });
      } else {
        let commit_url = `${this.getBitbucketUrl()}${this.data.repository.slug}/commits/${
          this.data.changes[0].toHash
        }`;
        let branch_name = this.data.changes[0].ref.displayId;
        this.build(output, commit_url, branch_name);
      }
    }
    return output;
  }
  build(output, commit_url, branch_name) {
    output.push({
      color: '#36a64f',
      author_name: `${this.getRepoName()}`,
      author_link: `${this.getRepoUrl()}`,
      author_icon: `${super.getRepoLogo()}`,
      title: `${this.getActorName()} committed to [${branch_name} - ${this.getRepoName()}]`,
      text: ``,
      actions: [
        {
          type: 'button',
          text: 'view detail',
          url: `${commit_url}`,
        },
      ],
      footer: `${super.getSourceName()} | ${this.getCommitDate()}`,
    });
  }
}
module.exports = messageBitbucketServer;
