const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

document.getElementById('right').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData()
  form.append('percentShares', document.getElementById('percentShares').value)
  form.append('prevRightId', document.getElementById('prevRightId').value)
  form.append('recipientId', document.getElementById('recipientId').value)
  form.append('rightToId', document.getElementById('rightToId').value)
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
}, false)
