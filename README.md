# push 代码自动推送信息到 slack 频道和钉钉群组

> 功能：当我们更改或提交了代码之后，可以在 slack 和 钉钉 里面发出通知信息，方便团队其他成员查看。
> 原理：webhook 调用跑的这个程序，然后这个程序再给 slack 发出通知支持的平台： github | gitlab | coding | bitbucket

请求格式： xxx/:type?/:project_name?

* type: 非必填，可选值：slack | ding
* project_name: 非必填，指对应的项目名称，可随意填写，但需要和 env.js 中对应

举例：http://localhost:3009/slack/test

注意事项：

1.  不同的项目可以输入不同的 webhook
2.  secret 为非必填，但如果要填的话，要和 env.js 中的一样
3.  如果请求的地址中没有 type 和 project_name 的话，会发送到 slack 中的默认频道里，可在 env.js 中配置
