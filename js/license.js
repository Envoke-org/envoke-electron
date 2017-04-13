const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

common.addSubjectListener(null, 'asset')
common.addSubjectListener(null, 'license-holder')
common.removeSubjectListener(1, null, 'asset')
common.removeSubjectListener(1, null, 'license-holder')

document.getElementById('license').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData(),
      asset = document.getElementsByName('asset'),
      licenseHolder = document.getElementsByName('license-holder')
  for (i = 0; i < asset.length; i++) {
    form.append('assetIds', asset[i].value)
  }
  for (i = 0; i < licenseHolder.length; i++) {
    form.append('licenseHolderIds', licenseHolder[i].value)
  }
  form.append('validThrough', document.getElementById('valid-through').value)
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
