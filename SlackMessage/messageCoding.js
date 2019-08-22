const slackParentMessage = require('./parentMessageClass');

class messageCoding extends slackParentMessage {
  constructor(fields) {
    super(fields);

    this.slackPayload = [];

    this.dingTalkPayload = '';

    this.branch_name = fields.body.ref;

    this.repository_name = fields.body.repository.name;

    this.repository_url = `${fields.body.repository.owner.html_url}/p/${this.repository_name}`;

    this.commits = fields.body.commits ? fields.body.commits : [fields.body.head_commit];

    this.committer_name = fields.body.pusher.username || fields.body.pusher.email;

    this.buildDingTalkPayload();

    this.buildSlackPayload();
  }

  getPayload(type) {
    if (type) {
      if (parseInt(type) === 1 || type.toLowerCase() === 'slack') {
        return this.slackPayload;
      } else {
        return this.dingTalkPayload;
      }
    } else {
      return this.slackPayload;
    }
  }

  buildDingTalkPayload() {
    this.dingTalkPayload = `#### [${this.repository_name} - ${this.branch_name}] ${
      this.commits.length
    } commit, push by ${this.committer_name} \n`;
    this.commits.forEach(commit => {
      let committer_name = commit.committer.name;
      let commit_url = `${this.repository_url}/git/commit/${commit.id}`;
      let commit_message = commit.message || '';
      let commit_hash6 = commit.id.substring(0, 6);
      let item = `- ${committer_name}: [${commit_hash6}](${commit_url}) - ${commit_message}`;
      this.dingTalkPayload = this.dingTalkPayload + item;
    });
  }

  buildSlackPayload() {
    this.commits.forEach(commit => {
      const commit_date = super.nowDate(commit.timestamp);
      let commit_message = commit.message || '';
      let committer_name = commit.committer.name;
      let commit_url = `${this.repository_url}/git/commit/${commit.id}`;

      this.slackPayload.push({
        color: '#36a64f',
        author_name: `${this.repository_name}`,
        author_link: `${this.repository_url}`,
        author_icon: `${super.getRepoLogo()}`,
        title: `${committer_name} committed to [${this.branch_name} - ${this.repository_name}]`,
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
    });
  }
}

module.exports = messageCoding;
