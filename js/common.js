const {clipboard, remote} = require('electron')
const main = remote.require('./main.js')

let home = document.getElementById('home')

if (home !== null) {
  home.addEventListener('click', () => {
    main.navigate('home')
  })
}

let inputs = document.getElementsByTagName('input')

for (i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('dblclick', (event) => {
    clipboard.writeText(event.target.value)
  }, false)
}

let logout = document.getElementById('logout')

if (logout !== null) {
  logout.addEventListener('click', () => {
    main.navigate('login-register')
  }, false)
}
