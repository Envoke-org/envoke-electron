const {remote} = require('electron')
const main = remote.require('./main.js')
const path = require('path')

let name = document.getElementById('name'),
    type = document.getElementById('type'),
    userId = document.getElementById('userId')

type.addEventListener('change', () => {
  switch (type.value) {
      case 'composition':
          name.hidden = false
          userId.placeholder = 'COMPOSER ID'
          break
      case 'license':
          name.hidden = true
          userId.placeholder = 'LICENSE-HOLDER ID'
          break
      case 'recording':
          name.hidden = false
          userId.placeholder = 'ARTIST ID'
          break
      case 'right':
          name.hidden = true
          userId.placeholder = 'RIGHT-HOLDER ID'
          break
      case 'user':
          name.hidden = false
          userId.placeholder = 'USER ID'
          break
      default:
          alert('Invalid type: ' + type.value)
  }
})

document.getElementById('search').addEventListener('submit', (event) => {
  event.preventDefault()
  let type = document.getElementById('type').value,
      userId = document.getElementById('userId').value,
      name = document.getElementById('name').value
  let urlpath
  if (name === null) {
    urlpath = path.join('/search', type, userId)
  } else {
    urlpath = path.join('/search', type, userId, name)
  }
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
    null, 'GET', urlpath
  )
  req.end()
}, false)
