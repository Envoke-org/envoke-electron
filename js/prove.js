const {remote} = require('electron')
const main = remote.require('./main.js')
const path = require('path')

const common = require('./common.js')

let challenge = document.getElementById('challenge'),
    tx = document.getElementById('tx'),
    type = document.getElementById('type')

type.addEventListener('change', () => {
  switch (type.value) {
      case 'composer':
      case 'publisher':
          tx.placeholder = 'COMPOSITION'
          break
      case 'license-holder':
          tx.placeholder = 'LICENSE'
          break
      case 'artist':
      case 'record-label':
          tx.placeholder = 'RECORDING'
          break
      case 'right-holder':
          tx.placeholder = 'RIGHT'
          break
      default:
          alert('Invalid type: ' + type.value)
  }
})

document.getElementById('prove-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let urlpath = path.join('/prove', challenge.value, tx.value, type.value)
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
