## 支持多Git平台的Slak或钉钉通知

push 代码自动推送信息到 slack 频道或钉钉群组

功能：提交了代码之后，可以在 slack 和 钉钉 里面发出通知信息，方便团队其他成员查看。

请求格式： xxx/:type?/:project_name?

* type: 非必填，可选值：slack | ding
* project_name: 非必填，指对应的项目名称，可随意填写，但需要和 env.js 中对应

举例：http://localhost:3009/slack/test

注意事项：

1.  不同的项目可以输入不同的 webhook
2.  secret 为非必填，但如果要填的话，要和 env.js 中的一致
3.  如果请求的地址中没有 type 和 project_name 的话，会发送到 slack 中的默认频道里，可在 env.js 中配置


## 问题
#### 如何获取 slackChannelUrl？
流程：
1. 创建一个自定义 slack app
2. 这个slack app要勾选开通 incoming webhook 功能，参考：https://api.slack.com/incoming-webhooks
3. 选择要通知的频道，复制 Webhook URL， 比如 https://hooks.slack.com/services/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


## 注意
1. Gitlab 本身支持 Slack 通知

## TODO
1. 怎么支持多个type？ slack的话应该填写channel name，钉钉的话只填写token或完整机器人地址
2. 如何获取 slackChannelUrl
2. clientId clientSecret 的填写应该不是必须的
