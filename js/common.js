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
    main.removeNavigation()
    main.navigate('login-register')
  }, false)
}

function hideShow(element, required) {
  element.hidden = element.style.width == '0%'
  if (element.hidden) {
    element.required = false
  } else if (required) {
    element.required = true
  }
}

function addPartyListener(fieldNames, partyName, widths) {
  let action = document.getElementById('action'),
      fields = {},
      group = document.getElementById(partyName),
      parties = document.getElementsByClassName('party')
  for (i = 0; i < fieldNames.length; i++) {
    fields[fieldNames[i]] = document.getElementsByName(fieldNames[i])
    for (j = 0; j < fields[fieldNames[i]].length; j++) {
      hideShow(fields[fieldNames[i]][j])
    }
  }
  document.getElementById('add-' + partyName).addEventListener('click', () => {
    if (parties.length === 1) {
      parties[0].style.width = widths[action.value]['party']
      for (i = 0; i < fieldNames.length; i++) {
        let field = fields[fieldNames[i]][0]
        field.style.width = widths[action.value][fieldNames[i]]
        hideShow(field, true)
      }
    }
    let div = document.createElement('div')
    let party = document.createElement('input')
    party.className = 'party'
    party.name = partyName
    party.placeholder = partyName.toUpperCase()
    party.required = true
    party.style.width = widths[action.value]['party']
    party.type = 'text'
    div.appendChild(party)
    for (i = 0; i < fieldNames.length; i++) {
      let input = fields[fieldNames[i]][0].cloneNode(true)
      input.style.width = widths[action.value][fieldNames[i]]
      hideShow(input, true)
      div.appendChild(input)
    }
    group.appendChild(div)
  }, false)
}

function removePartyListener(fieldNames, minimum, partyName, widths) {
  let action = document.getElementById('action'),
      group = document.getElementById(partyName),
      party = document.getElementsByName(partyName),
      parties = document.getElementsByClassName('party')
  document.getElementById('remove-' + partyName).addEventListener('click', () => {
    if (party.length > minimum) {
      group.removeChild(group.lastChild)
    }
    if (parties.length == 1) {
      parties[0].style.width = widths['default']['party']
      for (i = 0; i < fieldNames.length; i++) {
        let field = document.getElementsByName(fieldNames[i])[0]
        field.style.width = widths['default'][fieldNames[i]]
        hideShow(field)
      }
    }
  }, false)
}

function selectActionListener(fieldNames, widths) {
  let action = document.getElementById('action'),
      fields = {},
      submit = document.getElementById('submit'),
      parties = document.getElementsByClassName('party')
  for (i = 0; i < fieldNames.length; i++) {
    fields[fieldNames[i]] = document.getElementsByName(fieldNames[i])
    for (j = 0; j < fields[fieldNames[i]].length; j++) {
      hideShow(fields[fieldNames[i]][j])
    }
  }
  submit.value = action.options[action.selectedIndex].text
  action.addEventListener('change', () => {
    submit.value = action.options[action.selectedIndex].text
    if (parties.length == 1) {
        parties[0].style.width = widths['default']['party']
        for (i = 0; i < fieldNames.length; i++) {
          let field = fields[fieldNames[i]][0]
          field.style.width = widths['default'][fieldNames[i]]
          hideShow(field)
        }
    } else {
      for (i = 0; i < parties.length; i++) {
        parties[i].style.width = widths[action.value]['party']
        for (j = 0; j < fieldNames.length; j++) {
          let field = fields[fieldNames[j]][i]
          field.style.width = widths[action.value][fieldNames[j]]
          hideShow(field)
        }
      }
    }
  })
}

exports.addPartyListener = addPartyListener
exports.removePartyListener = removePartyListener
exports.selectActionListener = selectActionListener
