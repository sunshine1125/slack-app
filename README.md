## 支持多Git平台的Slack通知或钉钉通知

支持push 代码到Github，Gitlab，Coding，Gitee平台中自动推送提交信息到 slack 频道或钉钉群组，方便团队其他成员查看。

## 说明
#### Slack通知
需要创建自定义APP，利用APP机器人往频道发送消息，具体参见：https://api.slack.com/start
Slack通知两种方式：
第一种是最简单的方法， 但是需要为每一个频道生成一个webhook地址
方法1：创建自定义APP，进入配置页面 - Incoming Webhooks 选择某频道 - 复制 Webhook URL

![image.png](http://image.mafeifan.com/images/2019/09/06/301786eade142361613bdcf6bc8915e4.png)

![image.png](http://image.mafeifan.com/images/2019/09/06/121bc733a1bc9d77338fd3fce52a77f0.png)

参见：https://api.slack.com/incoming-webhooks

方法2 (未开发)：
创建自定义APP，利用提供的clientId，clientSecret。然后根据 API，https://api.slack.com/methods/chat.postMessage/test 
传入channel id，发送消息

#### 钉钉通知
需要建立讨论组然后添加自定义机器人，复制提供的回调地址，格式如`https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxxxx`

## 使用方法 (补充截图)

1. 复制 env.example.js 为 env.js
请求格式： xxx/:type?/:project_name?

* type: 非必填，可选值：slack | ding
* project_name: 非必填，指对应的项目名称，可随意填写，但需要和 env.js 中对应

举例：http://localhost:3009/slack/test

注意事项：

## 问题
#### 如何获取 slackChannelUrl？
流程：
1. 创建一个自定义 slack app
2. 这个slack app要勾选开通 incoming webhook 功能，参考：https://api.slack.com/incoming-webhooks
3. 选择要通知的频道，复制 Webhook URL， 比如 https://hooks.slack.com/services/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


## 注意
1. Gitlab 本身支持 Slack 通知, 但不支持钉钉
2. 不同的项目可以输入不同的 webhook
3. secret 为非必填，但如果要填的话，要和 env.js 中的一致
4. 如果请求的地址中没有 type 和 project_name 的话，会发送到 slack 中的默认频道中，可在 env.js 中配置


## TODO
1. 怎么支持多个type如何填写？ 
2. 配置钉钉dingRobotUrl只填写后面的token字符串
3. 补充测试，test目录放些不同平台的push的payload
