const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

common.addSubjectListener(null, 'license-for')
common.addSubjectListener(null, 'license-holder')
common.removeSubjectListener(1, null, 'license-for')
common.removeSubjectListener(1, null, 'license-holder')

document.getElementById('license').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData(),
      licenseFor = document.getElementsByName('license-for'),
      licenseHolder = document.getElementsByName('license-holder')
  for (i = 0; i < licenseForIds.length; i++) {
    form.append('licenseForIds', licenseFor[i].value)
  }
  for (i = 0; i < licenseHolderIds.length; i++) {
    form.append('licenseHolderIds', licenseHolder[i].value)
  }
  form.append('validFrom', document.getElementById('validFrom').value)
  form.append('validThrough', document.getElementById('validThrough').value)
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
  form.pipe(req)
  req.end()
}, false)
