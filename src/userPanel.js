export function getNameUser() {
  return document.getElementById('user-name').value
}

export function setNameUser(name) {
  document.getElementById('user-name').value = name
}

export function setUserColor(color) {
  document.getElementById('user-color').value = color
}

export function getUserColor(color) {
  return document.getElementById('user-color').value
}


export function defineStartHandler(handler) {
  document.getElementById('start-button').onclick = handler
}


export function setChangeNameHandler(handler) {
  document.getElementById('change-user-name-btn').onclick = handler
}

export function setChangeColorHandler(handler) {
  document.getElementById('change-user-color-btn').onclick = handler
}

export function setUserList(usersList) {
  let userListDiv = document.getElementById('user-list')

  usersList.forEach(user => {
    userListDiv.innerHTML += generateUserItem(user.color, user.name)
  })
}

function generateUserItem(color, username) {
  return `<div class=\"user-item display-flex\"><div style=\"background-color: ${color}\" class=\"user-item-color border-1px\"></div><div class=\"user-item-name\"> ${username} </div></div>`
}

export function deleteAllUsersOnPanel() {
  document.getElementById('user-list').innerHTML = ''
}