const {remote} = require('electron')
const main = remote.require('./main.js')
const FormData = require('form-data')
const fs = require('fs')

document.getElementById('login').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData()
  form.append('privateKey', document.getElementById('privateKey').value)
  form.append('userId', document.getElementById('userId').value)
  let req = main.httpRequest(
    (res) => {
      if (res.statusCode === 200) {
        main.navigate('home')
      } else {
        res.on('data', (data) => {
          alert(data)
        })
      }
    },
    form.getHeaders(),'POST', '/login'
  )
  form.pipe(req)
  req.end()
}, false)

document.getElementById('register').addEventListener('submit', (event) => {
  event.preventDefault()
  let form = new FormData()
  form.append('email', document.getElementById('email').value)
  form.append('name', document.getElementById('name').value)
  form.append('password', document.getElementById('password').value)
  form.append('sameAs', document.getElementById('sameAs').value)
  form.append('type', document.getElementById('type').value)
  let file = fs.createWriteStream('../credentials/credentials.json')
  file.on('open', (fd) => {
    let req = main.httpRequest(
      (res) => {
        if (res.statusCode === 200) {
          res.on('data', (data) => {
            file.write(data)
          }).on('end', () => {
            file.end()
          })
        } else {
          res.on('data', (data) => {
            alert(data)
          }).on('end', () => {
            file.end()
          })
        }
      },
      form.getHeaders(), 'POST', '/register'
    )
    form.pipe(req)
    req.end()
  })
}, false)
