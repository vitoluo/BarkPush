// iOSPushUrls和androidPushIds可填多个，会一起推送

// Bark得到的服务器地址
// 结尾不加 / 
const iOSPushUrls = []

// PushLite得到的token
const androidPushIds = []

// 服务监听地址
const listenAddr = 'localhost'

// 服务监听端口
const listenPort = 8888

module.exports = {
    iOSPushUrls,
    androidPushIds,
    listenAddr,
    listenPort
}
