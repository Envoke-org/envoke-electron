const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')
const path = require('path')

let action = document.getElementById('action'),
    artistIds = document.getElementsByName('artistId'),
    artists = document.getElementById('artists'),
    signatures = document.getElementsByName('signature'),
    splits = document.getElementsByName('split'),
    submit = document.getElementById('submit')

submit.value = action.options[action.selectedIndex].text

action.addEventListener('change', () => {
  submit.value = action.options[action.selectedIndex].text
  if (artistIds.length > 1) {
    if (action.value === '/release') {
      for (i = 0; i < artistIds.length; i++) {
        artistIds[i].style.width = '40%'
      }
      for (i = 0; i < signatures.length; i++) {
        signatures[i].hidden = false
        signatures[i].required = true
      }
    } else {
      for (i = 0; i < artistIds.length; i++) {
        artistIds[i].style.width = '80%'
      }
      for (i = 0; i < signatures.length; i++) {
        signatures[i].hidden = true
        signatures[i].required = false
      }
    }
  }
})

document.getElementById('add-artist').addEventListener('click', () => {
  if (artistIds.length === 1) {
    if (action.value === '/release') {
      artistIds[0].style.width = '40%'
      signatures[0].hidden = false
      signatures[0].required = true
    } else {
      artistIds[0].style.width = '80%'
      signatures[0].hidden = true
      signatures[0].required = false
    }
    splits[0].hidden = false
    splits[0].required = true
  }
  let artist = document.createElement('div')
  let artistId = document.createElement('input')
  artistId.name = 'artistId'
  artistId.placeholder = 'ARTIST ID'
  artistId.required = true
  if (action.value === '/release') {
      artistId.style.width = '40%'
  } else {
    artistId.style.width = '80%'
  }
  artistId.type = 'text'
  artist.appendChild(artistId)
  let signature = document.createElement('input')
  signature.name='signature'
  signature.placeholder = 'SIGNATURE'
  if (action.value === '/release') {
    signature.hidden = false
    signature.required = true
  } else {
    signature.hidden = true
    signature.required = false
  }
  signature.style.width = '40%'
  signature.type='text'
  artist.append(signature)
  let split = document.createElement('input')
  split.minimum=1
  split.maximum=99
  split.name='split'
  split.placeholder='SPLIT'
  split.required=true
  split.style.width = '20%'
  split.type='number'
  artist.appendChild(split)
  artists.appendChild(artist)
}, false)

document.getElementById('remove-artist').addEventListener('click', () => {
  if (artistIds.length > 1) {
    artists.removeChild(artists.lastChild)
    if (artistIds.length === 1) {
      artistIds[0].style.width = '100%'
      signatures[0].hidden = true
      signatures[0].required = false
      splits[0].hidden = true
      splits[0].required = false
    }
  }
}, false)

function newRecording() {
  let form = new FormData()
  for (i = 0; i < artistIds.length; i++) {
      form.append('artistIds', artistIds[i].value)
  }
  form.append('compositionId', document.getElementById('compositionId').value)
  form.append('duration', document.getElementById('duration').value)
  form.append('isrcCode', document.getElementById('isrcCode').value)
  form.append('licenseId', document.getElementById('licenseId').value)
  form.append('recordLabelId', document.getElementById('recordLabelId').value)
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
