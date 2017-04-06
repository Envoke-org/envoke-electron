const {app, BrowserWindow} = require('electron')
const FormData = require('form-data')
const http = require('http')

let win

app.on('ready', () => {
  win = new BrowserWindow({'width': 1000, 'height': 1000})
  win.loadURL(`file://${__dirname}/templates/login-register.html`)
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
})

var host = 'localhost', port = 8888

exports.httpRequest = (callback, headers, method, path) => {
  let options = {
    hostname: host,
    method: method,
    path: path,
    port: port,
  }
  if (headers !== null) {
    options['headers'] = headers
  }
  let req = http.request(options, callback)
  req.on('error', (err) => {
    alert(err)
  })
  return req
}

exports.formatJSON = (data) => {
  return JSON.stringify(JSON.parse(data), null, 2)
}

exports.navigate = (page) => {
  win.loadURL(`file://${__dirname}/templates/` + page + '.html')
}
