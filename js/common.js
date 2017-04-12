const {clipboard, remote} = require('electron')
const main = remote.require('./main.js')

let home = document.getElementById('home')

if (home) {
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

if (logout) {
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

function addSubjectListener(propertyNames, subjectName, widths) {
  let action = document.getElementById('action'),
      properties = {},
      group = document.getElementById(subjectName),
      subject = document.getElementsByName(subjectName),
      subjects = document.getElementsByClassName('subject')
  if (propertyNames !== null) {
    for (i = 0; i < propertyNames.length; i++) {
      properties[propertyNames[i]] = document.getElementsByName(propertyNames[i])
      for (j = 0; j < properties[propertyNames[i]].length; j++) {
        hideShow(properties[propertyNames[i]][j])
      }
    }
  }
  document.getElementById('add-' + subjectName).addEventListener('click', () => {
    if (subjects.length === 1) {
      if (action) {
        subjects[0].style.width = widths[action.value]['subject']
      } else if (widths) {
        subjects[0].style.width = widths['default']['subject']
      } else {
        subjects[0].style.width = '100%'
      }
      if (propertyNames) {
        for (i = 0; i < propertyNames.length; i++) {
          let property = properties[propertyNames[i]][0]
          if (action) {
            property.style.width = widths[action.value][propertyNames[i]]
          } else {
            property.style.width = widths['default'][propertyNames[i]]
          }
          hideShow(property)
        }
      }
    }
    let div = document.createElement('div')
    let subject = document.createElement('input')
    subject.className = 'subject'
    subject.name = subjectName
    subject.placeholder = subjectName.toUpperCase()
    subject.required = true
    if (action) {
      subject.style.width = widths[action.value]['subject']
    } else if (widths) {
      subject.style.width = widths['default']['subject']
    } else {
      subject.style.width = '100%'
    }
    subject.type = 'text'
    div.appendChild(subject)
    if (propertyNames) {
      for (i = 0; i < propertyNames.length; i++) {
        let property = properties[propertyNames[i]][0].cloneNode(true)
        if (action) {
          property.style.width = widths[action.value][propertyNames[i]]
        } else {
          property.style.width = widths['default'][propertyNames[i]]
        }
        hideShow(property)
        div.appendChild(property)
      }
    }
    group.appendChild(div)
  }, false)
}

function removeSubjectListener(minimum, propertyNames, subjectName, widths) {
  let group = document.getElementById(subjectName),
      subject = document.getElementsByName(subjectName),
      subjects = document.getElementsByClassName('subject')
  document.getElementById('remove-' + subjectName).addEventListener('click', () => {
    if (subject.length > minimum) {
      group.removeChild(group.lastChild)
    }
    if (subjects.length == 1) {
      if (widths) {
        subjects[0].style.width = widths['default']['subject']
      } else {
        subjects[0].style.width = '100%'
      }
      if (propertyNames !== null) {
        for (i = 0; i < propertyNames.length; i++) {
          let property = document.getElementsByName(propertyNames[i])[0]
          property.style.width = widths['default'][propertyNames[i]]
          hideShow(property)
        }
      }
    }
  }, false)
}

function selectActionListener(propertyNames, widths) {
  let action = document.getElementById('action'),
      properties = {},
      submit = document.getElementById('submit'),
      subjects = document.getElementsByClassName('subject')
  for (i = 0; i < propertyNames.length; i++) {
    properties[propertyNames[i]] = document.getElementsByName(propertyNames[i])
    for (j = 0; j < properties[propertyNames[i]].length; j++) {
      hideShow(properties[propertyNames[i]][j])
    }
  }
  submit.value = action.options[action.selectedIndex].text
  action.addEventListener('change', () => {
    submit.value = action.options[action.selectedIndex].text
    if (subjects.length == 1) {
        subjects[0].style.width = widths['default']['subject']
        for (i = 0; i < propertyNames.length; i++) {
          let property = properties[propertyNames[i]][0]
          property.style.width = widths['default'][propertyNames[i]]
          hideShow(property)
        }
    } else {
      for (i = 0; i < subjects.length; i++) {
        subjects[i].style.width = widths[action.value]['subject']
        for (j = 0; j < propertyNames.length; j++) {
          let property = properties[propertyNames[j]][i]
          property.style.width = widths[action.value][propertyNames[j]]
          hideShow(property)
        }
      }
    }
  })
}

exports.addSubjectListener = addSubjectListener
exports.removeSubjectListener = removeSubjectListener
exports.selectActionListener = selectActionListener
