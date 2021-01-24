# BarkPush 发送消息服务
## 部署
1. 修改参数，内容参照push-devices.js说明
2. 安装nodejs
3. 安装npm或yarn(二选一)
4. 启动发送消息服务
   ```
   npm install -g pm2    # npm和yarn二选一
   yarn global add pm2   # npm和yarn二选一
   pm2 start push.js
   ```
5. 推送消息 `http://<listenAddr>:<listenPort>`，格式参照Bark说明。（Android只支持title content automaticallyCopy）

## 手机端接收消息
iOS接收消息
- APP [Bark](https://itunes.apple.com/app/bark-customed-notifications/id1403753865)
- App源码 https://github.com/Finb/Bark
- 后端源码 https://github.com/Finb/bark-server

Android接收消息
- APP [PushLite](https://github.com/xlvecle/PushLite)

## 其他
感谢[Finb](https://github.com/Finb)和[xlvecle](https://github.com/xlvecle)<br>
Android推送链接来自[Bark-Chrome-Extension](https://github.com/xlvecle/Bark-Chrome-Extension)
