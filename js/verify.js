const {remote} = require('electron')
const main = remote.require('./main.js')
const path = require('path')

let challenge = document.getElementById('challenge'),
    signature = document.getElementById('signature'),
    txId = document.getElementById('txId'),
    type = document.getElementById('type'),
    userId = document.getElementById('userId')

type.addEventListener('change', (event) => {
  switch (event.target.value) {
      case 'composition':
          txId.placeholder = 'COMPOSITION ID'
          userId.placeholder = 'COMPOSER ID'
          break
      case 'license':
          txId.placeholder = 'LICENSE ID'
          userId.placeholder = 'LICENSE-HOLDER ID'
          break
      case 'recording':
          txId.placeholder = 'RECORDING ID'
          userId.placeholder = 'ARTIST ID'
          break
      case 'right':
          txId.placeholder = 'RIGHT ID'
          userId.placeholder = 'RIGHT-HOLDER ID'
          break
      default:
          alert('Invalid type: ' + type.value)
  }
})

document.getElementById('verify-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let urlpath = path.join('/verify', challenge.value, signature.value, txId.value, type.value, userId.value)
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
