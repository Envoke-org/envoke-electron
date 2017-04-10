const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

let composers = document.getElementsByName('composer'),
    fieldNames = ['signature', 'split'],
    widths = {
      'default': {
        'party': '100%',
        'signature': '0%',
        'split': '0%'
      },
      '/publish': {
        'party': '40%',
        'signature': '40%',
        'split': '20%'
      },
      '/sign/composition': {
        'party': '80%',
        'signature': '0%',
        'split': '20%'
      },
    }
common.addPartyListener(fieldNames, 'composer', widths)
common.addPartyListener(fieldNames, 'publisher', widths)
common.removePartyListener(fieldNames, 1, 'composer', widths)
common.removePartyListener(fieldNames, 0, 'publisher', widths)
common.selectActionListener(fieldNames, widths)

function newComposition() {
  let form = new FormData(),
      publishers = document.getElementsByName('publisher'),
      signatures = document.getElementsByName('signature'),
      splits = document.getElementsByName('split')
  for (i = 0; i < composers.length; i++) {
      form.append('composerIds', composers[i].value)
  }
  form.append('inLanguage', document.getElementById('inLanguage').value)
  form.append('iswcCode', document.getElementById('iswcCode').value)
  form.append('name', document.getElementById('name').value)
  for (i = 0; i < publisherIds.length; i++) {
    form.append('publisherIds', publisherIds[i].value)
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
  form.pipe(req)
  req.end()
}, false)
