import React, { Component } from 'react'
import { getNotifications } from './UserFunctions'
import NotificationCards from './NotificationCards';
import jwt_decode from 'jwt-decode'
import userimg from './ProfileImages/user.png'

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
      data: false,
      errors: {}

    }
  }

  componentDidMount() {

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
        data: true
      })
    })
  }

  render() {
    if (!this.state.data) return null;

    const user = this.state.user_id;
    const userName = this.state.first_name;
    console.log(user);

    const listItems = this.state.notifications.map((i) =>

      < NotificationCards id={i["id"]} sender_id={i["sender_id"]} recipient_id={i["recipient_id"]} body={i["body"]} />
    );

    return (

      listItems.filter(listItems => listItems.props.recipient_id == user).map(listItems => (
        <ul>
          <h1 className="text-center">{userName}</h1>

          {listItems}
        </ul>
      ))



      /*<div>
        <h1 className="text-center">{user}</h1>
        <ul>{listItems}</ul>
      </div>*/
    );
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


