import axios from 'axios'

export const register = newUser => {
  return axios
    .post('users/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      user_name: newUser.user_name,
      email: newUser.email,
      password: newUser.password,
      references: newUser.reference,
      interest: newUser.interest,
      rating: 0
    })
    .then(response => {
      console.log('Registered')
    })
}

export const login = user => {
  return axios
    .post('users/login', {
      email: user.email,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getProfile = user => {
  return axios
    .get('users/profile', {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getGroup = user =>{
  return axios
    .get('users/profile', {

    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

function addItem(e) {
  // if enter key is pressed on the form input, add new item
  if (e.which == 13 || e.keyCode == 13) {
    let item = document.querySelector('.new-todo');
    fetch('/add-todo', {
      method: 'post',
      body: JSON.stringify({ 
        id: `item-${Date.now()}`,
        value: item.value,
        completed: 0
      })
    })
    .then(resp => {
      // empty form input once a response is received
      item.value = ""
    });
  }
}

// function that makes API call to remove an item
function removeItem(id) {
  fetch(`/remove-todo/${id}`);
}

// function that makes API call to update an item 
// toggles the state of the item between complete and
// incomplete states
function toggleComplete(elem) {
  let id = elem.dataset.id,
      completed = (elem.dataset.completed == "1" ? "0" : "1");
  fetch(`/update-todo/${id}`, {
    method: 'post',
    body: JSON.stringify({ completed })
  });
}

// helper function to append new ToDo item to current ToDo list
function appendToList(data) {
  let html = `
    <li id="${data.id}">
      <div class="view">
        <input class="toggle" type="checkbox" onclick="toggleComplete(this)" 
          data-completed="${data.completed}" data-id="${data.id}">
        <label>${data.value}</label>
        <button class="destroy" onclick="removeItem('${data.id}')"></button>
      </div>
    </li>`;
  let list = document.querySelector(".todo-list")
  list.innerHTML += html;
};