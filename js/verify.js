const {remote} = require('electron')
const main = remote.require('./main.js')
const path = require('path')

const common = require('./common.js')

let challenge = document.getElementById('challenge'),
    signature = document.getElementById('signature'),
    tx = document.getElementById('tx'),
    type = document.getElementById('type'),
    user = document.getElementById('user')

type.addEventListener('change', () => {
  user.placeholder = type.value.toUpperCase()
  switch (type.value) {
      case 'composer' || 'publisher':
          tx.placeholder = 'COMPOSITION'
          break
      case 'license-holder':
          tx.placeholder = 'LICENSE'
          break
      case 'artist' || 'record-label':
          tx.placeholder = 'RECORDING'
          break
      case 'right-holder':
          tx.placeholder = 'RIGHT'
          break
      default:
          alert('Invalid type: ' + type.value)
  }
})

document.getElementById('verify-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let urlpath = path.join('/verify', challenge.value, signature.value, tx.value, type.value, user.value)
  let req = main.httpRequest(
    (res) => {
      if (res.statusCode === 200) {
        res.on('data', (data) => {
          document.getElementById('response-text').innerHTML = data
        })
      } else {
        res.on('data', (data) => {
          alert(data)
        })
      }
    },
    null, 'GET', urlpath
  )
  req.on('error', (err) => {
    alert(err)
  })
  req.end()
}, false)
