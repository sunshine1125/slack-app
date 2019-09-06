### webhook git commit message slack & dingtalk notification

通过 webhook 往 slack 和 钉钉机器人发送代码提交消息

支持的代码仓库平台：github | coding | bitbucket | gitlab

注意事项：

1.  slack 中 channel 的信息需要在 env.js 里面配置
2.  secret 为非必填，但如果要填的话，要和 env.js 中的一样
3.  如果想在不同的 channel 中发送信息，需要在 env.js 中配置，并在 webhook 地址中加入指定 id


### 配置 

### TODO

1. 推送地址
xxx.com/1  -> xxx.com?project=rep-app&receiver=slack,dingtalk

2. project | channels 下包含 secret
 
