const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

let licenseForIds = document.getElementsByName('licenseForId'),
    licenseFors = document.getElementById('licenseFors'),
    licenseHolderIds = document.getElementsByName('licenseHolderId'),
    licenseHolders = document.getElementById('licenseHolders')

document.getElementById('add-licenseFor').addEventListener('click', () => {
  let licenseFor = document.createElement('input')
  licenseFor.name = 'licenseForId'
  licenseFor.placeholder = 'COMPOSITION/RECORDING ID'
  licenseFor.type = 'text'
  licenseFors.appendChild(licenseFor)
})

document.getElementById('remove-licenseFor').addEventListener('click', () => {
  if (licenseForIds.length > 1) {
      licenseFors.removeChild(licenseFors.lastChild)
  }
})

document.getElementById('add-licenseHolder').addEventListener('click', () => {
  let licenseHolder = document.createElement('input')
  licenseHolder.name = 'licenseHolderId'
  licenseHolder.placeholder = 'LICENSE-HOLDER ID'
  licenseHolder.type = 'text'
  licenseHolders.appendChild(licenseHolder)
})

document.getElementById('remove-licenseHolder').addEventListener('click', () => {
  if (licenseHolderIds.length > 1) {
    licenseHolders.removeChild(licenseHolders.lastChild)
  }
})

document.getElementById('license').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData()
  for (i = 0; i < licenseForIds.length; i++) {
    form.append('licenseForIds', licenseForIds[i].value)
  }
  for (i = 0; i < licenseHolderIds.length; i++) {
    form.append('licenseHolderIds', licenseHolderIds[i].value)
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
