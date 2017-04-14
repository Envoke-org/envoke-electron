const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

let widths = { 'default': {'subject': '50%', 'valid-through': '50%'}}

common.addSubjectListener(null, 'asset')
common.addSubjectListener(['valid-through'], 'license-holder', widths)
common.removeSubjectListener(1, null, 'asset')
common.removeSubjectListener(1, ['valid-through'], 'license-holder', widths)

document.getElementById('license').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData(),
      asset = document.getElementsByName('asset'),
      valid_through = document.getElementsByName('valid-through'),
      holder = document.getElementsByName('license-holder')
  for (i = 0; i < asset.length; i++) {
    form.append('assetIds', asset[i].value)
  }
  for (i = 0; i < valid_through.length; i++) {
    form.append('expireTimes', valid_through[i].value)
  }
  for (i = 0; i < holder.length; i++) {
    form.append('licenseHolderIds', holder[i].value)
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
    form.getHeaders(), 'POST', '/license'
  )
  req.on('error', (err) => {
    alert(err)
  })
  form.pipe(req)
  req.end()
}, false)
