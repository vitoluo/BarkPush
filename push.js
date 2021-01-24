const http = require('http')
const https = require('https')
const { iOSPushUrls, androidPushIds } = require('./push-devices')

const server = http.createServer()
server.listen(8888, 'localhost', () => console.log('推送服务启动成功，监听本地端口：8888'))
server.on('request', async (req, resp) => {
  resp.setHeader('Content-Type', 'application/json')

  const reqPath = req.url
  let promises = []
  if (androidPushIds.length > 0) {
    promises.push(pushAndroidMsg(androidPushIds, reqPath))
  }
  iOSPushUrls.forEach(baseUrl => promises.push(pushIosMsg(baseUrl, reqPath)))

  const results = await Promise.all(promises.map(reflect))
  const rejectedList = results.filter(result => result.status === 'rejected')

  if (rejectedList.length > 0) {
    rejectedList.forEach(result => console.error('推送消息发送失败', result.reason))
    resp.write('{"code":0,"data":null,"message":"推送消息发送失败"}')
  } else {
    resp.write('{"code":200,"data":null,"message":""}')
  }
  resp.end()
})

function reflect(promise) {
  return promise.then(
    value => ({ status: 'fulfilled', value: value }),
    error => ({ status: 'rejected', reason: error }))
}

function pushIosMsg(baseUrl, reqPath) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${reqPath}`
    const req = https.request(url, { method: 'get' })

    req.on('response', (resp) => {
      resp.on('data', (data) => {
        const json = JSON.parse(data)
        const { code } = json
        if (code == 200) {
          resolve(data)
        } else {
          reject(`iOS推送请求失败url: ${decodeURI(url)} , 响应内容: ${JSON.stringify(json)}`)
        }
      })
    })

    req.on('error', (e) => reject(`iOS推送请求失败url: ${decodeURI(url)} , 错误消息: ${e.message}`))

    req.end()
  })
}

function pushAndroidMsg(ids, reqPath) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(reqPath, 'http://temp')

    const pathArr = reqUrl.pathname.split('/')
    const title = pathArr.length === 3 ? decodeURI(pathArr[1]) : '推送消息'
    const content = decodeURI(pathArr.length === 3 ? pathArr[2] : pathArr[1])
    const autoCopy = reqUrl.searchParams.get('automaticallyCopy')

    const req = https.request('https://fcm.googleapis.com/fcm/send', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'key=AIzaSyAd-JC3NxVeGRHyo5ZZB2BUmhSA7Z_IqHY',
      },
      timeout: 10 * 1000
    })

    req.on('response', (resp) => {
      resp.on('data', (data) => {
        const json = JSON.parse(data)
        const { failure } = json
        if (failure == 0) {
          resolve('{"code":200,"data":null,"message":""}')
        } else {
          reject(`android推送请求失败, 响应内容: ${JSON.stringify(json)}`)
        }
      })
    })

    req.on('error', (e) => reject(`android推送请求失败, 错误消息: ${e.message}`))

    const sendData = {
      registration_ids: ids,
      data: {
        title: title,
        body: content,
        autoCopy: autoCopy || 0,
        msgType: 'normal'
      }
    }
    req.write(JSON.stringify(sendData))

    req.end()
  })
}
