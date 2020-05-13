import React, { Component } from 'react'
import { getNotifications } from './UserFunctions'
import NotificationCards from './NotificationCards';
import jwt_decode from 'jwt-decode'
import userimg from './ProfileImages/user.png'
import axios from 'axios';
import Cards from './Cards';
import ApproveCard from './ApproveCard';


class Notifications extends Component {

  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      image: '',
      user_id: 0,
      notifications: [],
      users: [],
      userNotif: [],
      data: false,
      errors: {}

    }
  }

  componentDidMount() {
    axios.get('/notifications').then(res => {

      let notifs = [];
      console.log(res.data['Users'])
      console.log(res.data['Notifications'])
      for (let i = 0; i < res.data['Users'].length; i++) {
        for (let j = 0; j < res.data['Notifications'].length; j++)
          if (res.data['Users'][i]['id'] == res.data['Notifications'][j]['sender_id'] && res.data['Notifications'][j]['recipient_id'] == 1) {
            notifs.push(res.data['Users'][i]);
          }
      }
      this.setState({
        userNotif: notifs,
        data: true
      })
      console.log(notifs)

      return res;
    })
    getNotifications().then(res => {
      const token = localStorage.usertoken
      const decoded = jwt_decode(token)
      this.setState({
        first_name: decoded.identity.first_name,
        last_name: decoded.identity.last_name,
        image: decoded.identity.image_file,
        email: decoded.identity.email,
        user_id: decoded.identity.id,
        notifications: res["Notifications"],
        users: res["Users"],
        data: true
      })
    })
  }

  onApprove() {
    axios.post('/notifications', {
      notif_id: this.state.notif_id,
      id: this.state.id,
      sender_id: this.state.sender_id,
      recipient_id: this.state.recipient_id,
      body: "Approved",
      email: ""

    })
      .then((r) => {
        console.log(r)
      })
    this.setState(state => ({
      isDisabled: true,
      disabled: true,
    }));
  }

  render() {
    if (!this.state.data) return null;

    const user = this.state.user_id;
    const userName = this.state.first_name;
    console.log(user);


    const listItems = this.state.notifications.map((i) =>

      < NotificationCards notif_id={i["notif_id"]} id={i["id"]} sender_id={i["sender_id"]} recipient_id={i["recipient_id"]} body={i["body"]} />
    );

    const listUsers = this.state.users.map((i) =>
      <Cards name={i["user_name"]} rating={i["rating"]} id={i["id"]} type={"user"} />
    );

    const listNotifs = this.state.userNotif.map((i) =>
      <ApproveCard name={i["user_name"]} rating={i["rating"]} id={i["id"]} email={i["email"]} />

    );


    let render;
    if (user == 1) {
      render = <div>{listNotifs}</div>
    }
    else {
      render = listItems.filter(listItems => listItems.props.recipient_id == user).map(listItems => (
        <div>


          {listItems}

        </div>
      ))
    }

    return (
      <div className="App">
        <h1>
          Hello {userName}
        </h1>
        {render}
      </div>
    );



    /*<div>
        <h1 className="text-center">{user}</h1>
        <ul>{listItems}</ul>
      </div>*/

  }
  /*
  constructor() {
          super();
    this.state = {
          notifications: [],
      data: false
    }
  }
  componentDidMount() {
          getNotifications().then(res => {
            this.setState({
              notifications: res["Notifications"],
              data: true
            })
          })
        }
  render() {
    if (!this.state.data) return null;

    const listItems = this.state.notifications.map((i) =>
      <NotificationCards id={i["id"]} sender_id={i["sender_id"]} recipient_id={i["recipient_id"]} body={i["body"]} />
    );
    return (
      <div>
          <h1 className="text-center">Notifications</h1>
          <ul>{listItems}</ul>
        </div>
    );
  }*/
}


export default Notifications


