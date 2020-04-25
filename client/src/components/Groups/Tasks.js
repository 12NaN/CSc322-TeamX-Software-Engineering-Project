import React, { Component } from 'react';
import Pusher from 'pusher-js';
class Tasks extends Component {
    constructor(props){
        super(props);
       // this.addItem = this.addItem.bind(this);
       // this.removeItem = this.removeItem.bind(this);
       // this.toggleComplete = this.toggleComplete.bind(this);
    }
    render() {
        Pusher.logToConsole = true;

        // configure pusher
        const pusher = new Pusher('5481efcb3669a7275fd2', {
              cluster: 'us2',
              forceTLS: true
        });
        
        // subscribe to `todo` public channel, on which we'd be broadcasting events
        const channel = pusher.subscribe('todo');
        
        // listen for item-added events, and update todo list once event triggered
        channel.bind('item-added', data => {
          appendToList(data);
        });
        
        // listen for item-removed events
        channel.bind('item-removed', data => {
          let item = document.querySelector(`#${data.id}`);
          item.parentNode.removeChild(item);
        });
        
        // listen for item-updated events
        channel.bind('item-updated', data => {
          let elem = document.querySelector(`#${data.id} .toggle`);
          let item = document.querySelector(`#${data.id}`);
          item.classList.toggle("completed");
          elem.dataset.completed = data.completed;
          elem.checked = data.completed == 1;
        });
        function addItem(e) {
            // if enter key is pressed on the form input, add new item
            e.preventDefault();
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
          };
        
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
                <div className="view">
                  <input className="toggle" type="checkbox" onclick="toggleComplete(this)" 
                    data-completed="${data.completed}" data-id="${data.id}">
                  <label>${data.value}</label>
                  <button className="destroy" onClick="removeItem('${data.id}')"></button>
                </div>
              </li>`;
            let list = document.querySelector(".todo-list")
            list.innerHTML += html;
         };
        return (
            <div>
                <section className="todoapp">
                    <header className="header">
                    <h1>Todos</h1>
                    <input className="new-todo" placeholder="What needs to be done?" 
                        autoFocus="" onKeyPress={this.addItem}/>
                    </header>

                    <section className="main">
                    <ul className="todo-list"></ul>
                    </section>

                    <footer className="footer"></footer>  
                </section>
            </div>
        );
    }
}

export default Tasks;