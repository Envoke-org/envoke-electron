const {remote} = require('electron')
const main = remote.require('./main.js')

let buttons = document.getElementsByClassName('button')

for (i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', (event) => {
    main.navigate(event.target.value)
  }, false)
}
