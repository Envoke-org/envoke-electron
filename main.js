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
  return http.request(options, callback)
}

function formatJSON(data) {
  return JSON.stringify(JSON.parse(data), null, 2)
}

function navigate(page) {
  win.loadURL(`file://${__dirname}/templates/` + page + '.html')
}

const navigation = {
  label: 'Navigation',
  submenu: [
    {
      label: 'Home',
      click() { navigate('home') }
    },
    {
      label: 'Discovery',
      submenu: [
        {
          label: 'Query',
          click() { navigate('query') }
        },
        {
          label: 'Search',
          click() { navigate('search') }
        }
      ]
    },
    {
      label: 'Metadata',
      submenu: [
        {
          label: 'Composition',
          click() { navigate('composition') }
        },
        {
          label: 'Recording',
          click() { navigate('recording') }
        }
      ]
    },
    {
      label: 'Ownership',
      submenu: [
        {
          label: 'License',
          click() { navigate('license') }
        },
        {
          label: 'Right',
          click() { navigate('right') }
        }
      ]
    },
    {
      label: 'Verfication',
      submenu: [
        {
          label: 'Prove',
          click() { navigate('prove') }
        },
        {
          label: 'Verify',
          click() { navigate('verify') }
        }
      ]
    }
  ]
}

// From electron api-docs

const template = [
  {
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
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
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }
]

let menu, touchBar, win

function addNavigation() {
  template.splice(2, 0, navigation)
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function removeNavigation() {
  template.splice(2, 1)
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  win = new BrowserWindow({'height': 1000, 'width': 1000})
  win.loadURL(`file://${__dirname}/templates/login-register.html`)
  win.on('closed', () => {
    win = null
  })
})

exports.addNavigation = addNavigation
exports.formatJSON = formatJSON
exports.httpRequest = httpRequest
exports.navigate = navigate
exports.removeNavigation = removeNavigation
