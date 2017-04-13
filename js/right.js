const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

let widths = { 'default': { 'split': '50%', 'subject': '50%'}}

common.addSubjectListener(['split'], 'recipient', widths)
common.removeSubjectListener(1, ['split'], 'recipient', widths)

document.getElementById('right-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData(),
      recipient = document.getElementsByName('recipient'),
      split = document.getElementsByName('split')
  form.append('assetId', document.getElementById('asset').value)
  for (i = 0; i < recipient.length; i++) {
    form.append('recipientIds', recipient[i].value)
  }
  for (i = 0; i < split.length; i++) {
    form.append('splits', split[i].value)
  }
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
  req.on('error', (err) => {
    alert(err)
  })
  form.pipe(req)
  req.end()
}, false)
