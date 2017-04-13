const {remote} = require('electron')
const main = remote.require('./main.js')
const path = require('path')

const common = require('./common.js')

document.getElementById('query').addEventListener('submit', (event) => {
  event.preventDefault()
  let urlpath = path.join('/query', document.getElementById('id').value)
  let req = main.httpRequest(
    (res) => {
      if (res.statusCode === 200) {
        res.on('data', (data) => {
          document.getElementById('response-text').innerHTML = main.formatJSON(data)
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
