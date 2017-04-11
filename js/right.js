const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

document.getElementById('right-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData()
  form.append('percentShares', document.getElementById('percent-shares').value)
  form.append('previousRightId', document.getElementById('previous-right').value)
  form.append('recipientId', document.getElementById('recipient').value)
  form.append('rightToId', document.getElementById('right-to').value)
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
    form.getHeaders(), 'POST', '/right'
  )
  form.pipe(req)
  req.end()
}, false)
