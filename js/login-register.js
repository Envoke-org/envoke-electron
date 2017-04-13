const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')

const common = require('./common.js')

main.addNavigation() // for now..

document.getElementById('login-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData()
  form.append('privateKey', document.getElementById('privateKey').value)
  form.append('userId', document.getElementById('userId').value)
  let req = main.httpRequest(
    (res) => {
      if (res.statusCode === 200) {
        // main.addNavigation()
        main.navigate('home')
      } else {
        res.on('data', (data) => {
          alert(data)
        })
      }
    },
    form.getHeaders(),'POST', '/login'
  )
  req.on('error', (err) => {
    alert(err)
  })
  form.pipe(req)
  req.end()
}, false)

document.getElementById('register-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData()
  form.append('email', document.getElementById('email').value)
  form.append('name', document.getElementById('name').value)
  form.append('password', document.getElementById('password').value)
  form.append('sameAs', document.getElementById('sameAs').value)
  form.append('type', document.getElementById('type').value)
  let req = main.httpRequest(
    (res) => {
      if (res.statusCode === 200) {
        res.on('data', (data) => {
          document.getElementById('response-text').innerHTML = main.formatJSON(data)
        })
      } else {
        res.on('data', (data) => {
          alert(data)
        })
      }
    },
    form.getHeaders(), 'POST', '/register'
  )
  req.on('error', (err) => {
    alert(err)
  })
  form.pipe(req)
  req.end()
}, false)
