const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')
const path = require('path')

const common = require('./common.js')

let artists = document.getElementsByName('artist'),
    fieldNames = ['license', 'right', 'signature', 'split'],
    widths = {
      'default': {
        'license': '20%',
        'right': '20%',
        'party': '60%',
        'signature': '0%',
        'split': '0%'
      },
      '/release': {
        'license': '20%',
        'right': '20%',
        'party': '20%',
        'signature': '20%',
        'split': '20%'
      },
      '/sign/recording': {
        'license': '25%',
        'right': '25%',
        'party': '25%',
        'signature': '0%',
        'split': '25%'
      }
    }

common.addPartyListener(fieldNames, 'artist', widths)
common.addPartyListener(fieldNames, 'record-label', widths)
common.removePartyListener(fieldNames, 1, 'artist', widths)
common.removePartyListener(fieldNames, 0, 'record-label', widths)
common.selectActionListener(fieldNames, widths)

function newRecording() {
  let form = new FormData(),
      licenses = document.getElementsByName('license'),
      recordLabelIds = document.getElementsByName('recordLabel'),
      rightIds = document.getElementsByName('right'),
      signatures = document.getElementsByName('signature'),
      splits = document.getElementsByName('split')
  for (i = 0; i < artistIds.length; i++) {
      form.append('artistIds', artistIds[i].value)
  }
  form.append('compositionId', document.getElementById('composition').value)
  form.append('duration', document.getElementById('duration').value)
  form.append('isrcCode', document.getElementById('isrcCode').value)
  for (i = 0; i < licenseIds.length; i++) {
    form.append('licenseIds', licenseIds[i].value)
  }
  if (recordLabelIds.length > 0) {
    for (i = 0; i < recordLabelIds.length; i++) {
        form.append('recordLabelIds', recordLabelIds[i].value)
    }
  }
  if (rightIds.length > 0) {
    for (i = 0; i < rightIds.length; i++) {
      form.append('rightIds', rightIds[i].value)
    }
  }
  if (signatures.length > 1) {
    for (i = 0; i < signatures.length; i++) {
      form.append('signatures', signatures[i].value)
    }
  }
  if (splits.length > 1) {
    for (i = 0; i < splits.length; i++) {
      form.append('splits', splits[i].value)
    }
  }
  form.append('url', document.getElementById('url').value)
  return form
}

document.getElementById('record-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = newRecording()
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
    form.getHeaders(), 'POST', action.value
  )
  form.pipe(req)
  req.end()
}, false)
