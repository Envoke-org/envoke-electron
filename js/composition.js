const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

let action = document.getElementById('action'),
    composerIds = document.getElementsByName('composerId'),
    composers = document.getElementById('composers'),
    signatures = document.getElementsByName('signature'),
    splits = document.getElementsByName('split'),
    submit = document.getElementById('submit')

submit.value = action.options[action.selectedIndex].text

action.addEventListener('change', () => {
  submit.value = action.options[action.selectedIndex].text
  if (composerIds.length > 1) {
    if (action.value === '/publish') {
      for (i = 0; i < composerIds.length; i++) {
        composerIds[i].style.width = '40%'
      }
      for (i = 0; i < signatures.length; i++) {
        signatures[i].hidden = false
        signatures[i].required = true
      }
    } else {
      for (i = 0; i < composerIds.length; i++) {
        composerIds[i].style.width = '80%'
      }
      for (i = 0; i < signatures.length; i++) {
        signatures[i].hidden = true
        signatures[i].required = false
      }
    }
  }
})

document.getElementById('add-composer').addEventListener('click', () => {
  if (composerIds.length === 1) {
    if (action.value === '/publish') {
      composerIds[0].style.width = '40%'
      signatures[0].hidden = false
      signatures[0].required = true
    } else {
      composerIds[0].style.width = '80%'
      signatures[0].hidden = true
      signatures[0].required = false
    }
    splits[0].hidden = false
    splits[0].required = true
  }
  let composer = document.createElement('div')
  let composerId = document.createElement('input')
  composerId.name = 'composerId'
  composerId.placeholder = 'COMPOSER ID'
  composerId.required = true
  if (action.value === '/publish') {
      composerId.style.width = '40%'
  } else {
    composerId.style.width = '80%'
  }
  composerId.type = 'text'
  composer.appendChild(composerId)
  let signature = document.createElement('input')
  signature.name='signature'
  signature.placeholder = 'SIGNATURE'
  if (action.value === '/publish') {
    signature.hidden = false
    signature.required = true
  } else {
    signature.hidden = true
    signature.required = false
  }
  signature.style.width = '40%'
  signature.type='text'
  composer.append(signature)
  let split = document.createElement('input')
  split.minimum=1
  split.maximum=99
  split.name='split'
  split.placeholder='SPLIT'
  split.required=true
  split.style.width = '20%'
  split.type='number'
  composer.appendChild(split)
  composers.appendChild(composer)
}, false)

document.getElementById('remove-composer').addEventListener('click', () => {
  if (composerIds.length > 1) {
    composers.removeChild(composers.lastChild)
    if (composerIds.length === 1) {
      composerIds[0].style.width = '100%'
      signatures[0].hidden = true
      signatures[0].required = false
      splits[0].hidden = true
      splits[0].required = false
    }
  }
}, false)

function newComposition() {
  let form = new FormData()
  for (i = 0; i < composerIds.length; i++) {
      form.append('composerIds', composerIds[i].value)
  }
  form.append('inLanguage', document.getElementById('inLanguage').value)
  form.append('iswcCode', document.getElementById('iswcCode').value)
  form.append('name', document.getElementById('name').value)
  form.append('publisherId', document.getElementById('publisherId').value)
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
