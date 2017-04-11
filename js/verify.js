const {remote} = require('electron')
const main = remote.require('./main.js')
const path = require('path')

const common = require('./common.js')

let challenge = document.getElementById('challenge'),
    signature = document.getElementById('signature'),
    tx = document.getElementById('tx'),
    type = document.getElementById('type'),
    user = document.getElementById('user')

type.addEventListener('change', (event) => {
  switch (event.target.value) {
      case 'composition':
          tx.placeholder = 'COMPOSITION'
          user.placeholder = 'COMPOSER'
          break
      case 'license':
          tx.placeholder = 'LICENSE'
          user.placeholder = 'LICENSE-HOLDER'
          break
      case 'recording':
          tx.placeholder = 'RECORDING'
          user.placeholder = 'ARTIST'
          break
      case 'right':
          tx.placeholder = 'RIGHT'
          user.placeholder = 'RIGHT-HOLDER'
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
  req.end()
}, false)
