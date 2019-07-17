# push 代码自动推送信息到slack频道

功能：当我们更改或提交了代码之后，可以在 slack 里面发出通知信息，方便团队其他成员查看。原理：webhook 调用跑的这个程序，然后这个程序再给 slack 发出通知支持的平台： github | gitlab | coding | bitbucket

注意事项：

1.  slack 中 channel 的信息需要在 env.js 里面配置
2.  secret 为非必填，但如果要填的话，要和 env.js 中的一样
