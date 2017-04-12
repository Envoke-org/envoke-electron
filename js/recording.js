const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')
const path = require('path')

const common = require('./common.js')

let artist = document.getElementsByName('artist'),
    propertyNames = ['license', 'signature', 'split'],
    widths = {
      'default': {
        'license': '50%',
        'signature': '0%',
        'split': '0%',
        'subject': '50%'
      },
      '/release': {
        'license': '25%',
        'signature': '25%',
        'split': '25%',
        'subject': '25%'
      },
      '/sign/recording': {
        'license': '33%',
        'signature': '0%',
        'split': '33%',
        'subject': '34%'
      }
    }

common.addSubjectListener(propertyNames, 'artist', widths)
common.addSubjectListener(propertyNames, 'label', widths)
common.removeSubjectListener(1, propertyNames, 'artist', widths)
common.removeSubjectListener(0, propertyNames, 'label', widths)
common.selectActionListener(propertyNames, widths)

function newRecording() {
  let form = new FormData(),
      license = document.getElementsByName('license'),
      label = document.getElementsByName('label'),
      signature = document.getElementsByName('signature'),
      split = document.getElementsByName('split')
  for (i = 0; i < artist.length; i++) {
      form.append('artistIds', artist[i].value)
  }
  form.append('compositionId', document.getElementById('composition').value)
  form.append('duration', document.getElementById('duration').value)
  form.append('isrcCode', document.getElementById('isrc').value)
  for (i = 0; i < license.length; i++) {
    form.append('licenseIds', license[i].value)
  }
  for (i = 0; i < label.length; i++) {
      form.append('recordLabelIds', label[i].value)
  }
  if (signature.length > 1) {
    for (i = 0; i < signature.length; i++) {
      form.append('signatures', signature[i].value)
    }
  }
  if (split.length > 1) {
    for (i = 0; i < split.length; i++) {
      form.append('splits', split[i].value)
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
