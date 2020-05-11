import axios from 'axios'

export const register = newUser => {
  return axios
    .post('users/register', {
      user_name: newUser.user_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password,
      interest: newUser.interest,
      references: newUser.reference,
      user_type: newUser.user_type == null ? 0 : newUser.user_type,
      rating: newUser.rating == null ? 0 : newUser.rating
    })
    .then(response => {
        console.log('Received Data') 
    })
    .catch(error =>{ // Added an exception for when a blacklisted user wants to register
      console.log("You have not been registed!")
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
    .post('/profile', {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then(response => {
      console.log("hi")
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}


export const getProfilesAndGroups = () => {
  return axios
    .get('http://localhost:5000/')
    .then(response => {
      console.log(response.data["Groups"])
      return response.data
    })
    .catch(err => {
      console.log("NOOOOOOOOOOOO")
      console.log(err)
    })
}
export const getProfiles = () => {
  return axios
    .get('/users')
    .then(response => {
      console.log(response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getNotifications = () => {
  return axios
    .get('/notifications', {
    })
    .then(response => {
      console.log("hi")
      console.log(response.data["Notifications"])
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}


export const getProjects = () => {
  return axios
    .get('/projects', {
    })
    .then(response => {
      console.log("hi")
      console.log(response.data["Groups"])
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