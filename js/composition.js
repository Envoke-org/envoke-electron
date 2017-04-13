const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

let composer = document.getElementsByName('composer'),
    propertyNames = ['signature', 'split'],
    widths = {
      'default': {
        'signature': '0%',
        'split': '0%',
        'subject': '100%'
      },
      '/publish': {
        'signature': '40%',
        'split': '20%',
        'subject': '40%'
      },
      '/sign/composition': {
        'signature': '0%',
        'split': '20%',
        'subject': '80%'
      },
    }
common.addSubjectListener(propertyNames, 'composer', widths)
common.addSubjectListener(propertyNames, 'publisher', widths)
common.removeSubjectListener(1, propertyNames, 'composer', widths)
common.removeSubjectListener(0, propertyNames, 'publisher', widths)
common.selectActionListener(propertyNames, widths)

function newComposition() {
  let form = new FormData(),
      publisher = document.getElementsByName('publisher'),
      signature = document.getElementsByName('signature'),
      split = document.getElementsByName('split')
  for (i = 0; i < composer.length; i++) {
      form.append('composerIds', composer[i].value)
  }
  form.append('inLanguage', document.getElementById('language').value)
  form.append('iswcCode', document.getElementById('iswc').value)
  form.append('name', document.getElementById('name').value)
  for (i = 0; i < publisher.length; i++) {
    form.append('publisherIds', publisher[i].value)
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

document.getElementById('compose-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = newComposition()
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
    form.getHeaders(),'POST', action.value
  )
  req.on('error', (err) => {
    alert(err)
  })
  form.pipe(req)
  req.end()
}, false)
