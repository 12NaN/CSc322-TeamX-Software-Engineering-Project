import React, { Component } from 'react'
import { getNotifications } from './UserFunctions'
import NotificationCards from './NotificationCards';


class Notifications extends Component {
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
  }
}


export default Notifications