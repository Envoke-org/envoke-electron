const {app, BrowserWindow, Menu} = require('electron')
const FormData = require('form-data')
const http = require('http')

var host = 'localhost', port = 8888

function httpRequest(callback, headers, method, path) {
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

function formatJSON(data) {
  return JSON.stringify(JSON.parse(data), null, 2)
}

function navigate(page) {
  win.loadURL(`file://${__dirname}/templates/` + page + '.html')
}

const template = [
  {
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      /* {role: 'services', submenu: []}, */
      {
        label: 'navigate',
        submenu: [
          {
            label: 'discovery',
            submenu: [
              {
                label: 'query',
                click() { navigate('query') }
              },
              {
                label: 'search',
                click() { navigate('search') }
              }
            ]
          },
          {
            label: 'metadata',
            submenu: [
              {
                label: 'composition',
                click() { navigate('composition') }
              },
              {
                label: 'recording',
                click() { navigate('recording') }
              }
            ]
          },
          {
            label: 'ownership',
            submenu: [
              {
                label: 'license',
                click() { navigate('license') }
              },
              {
                label: 'right',
                click() { navigate('right') }
              }
            ]
          },
          {
            label: 'verfication',
            submenu: [
              {
                label: 'prove',
                click() { navigate('prove') }
              },
              {
                label: 'verify',
                click() { navigate('verify') }
              }
            ]
          }
        ]
      },
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  }
]

let menu, win

app.on('ready', () => {
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  win = new BrowserWindow({'width': 1000, 'height': 1000})
  win.loadURL(`file://${__dirname}/templates/login-register.html`)
  // win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
})

exports.formatJSON = formatJSON
exports.httpRequest = httpRequest
exports.navigate = navigate
