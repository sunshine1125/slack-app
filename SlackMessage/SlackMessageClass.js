class SlackMessage {
  constructor(fields) {
    this.fields = fields;
    // this.fields = {
    //   comment_date: '',
    //   actor_name: '',
    //   branch_name: '',
    //   repo_name: '',
    //   commit_url: '',
    // }
  }

  trans() {
    let message = this.build();
    // replace
  }

  build() {
    return '[:comment_date :actor_name] committed to [:branch_name - :repo_name] - <:commit_url | click to see more>';
  }

  output() {
    let output = this.trans();
    return output;
  }
}

const coding = new SlackMessage(req);
coding.assignField({});
