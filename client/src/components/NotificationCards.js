import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import jwt_decode from 'jwt-decode'

class NotificationCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            sender_id: 0,
            recipient_id: 0,
            body: '',
            dataFetched: false
        }

    }
    componentDidMount() {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)

        this.setState({
            id: this.props.id,
            sender_id: this.props.sender_id,
            recipient_id: this.props.recipient_id,
            body: this.props.body,

        })
    }
    render() {
        const isInvite = this.state.id;

        let button;
        let button2;
        if (isInvite == 1) {
            button = <button style={{ float: "right" }}>Accept</button>
            button2 = <button style={{ float: "right" }}>Decline</button>
        }
        if (isInvite == 2) {
            button = <button style={{ float: "right" }}>Rate</button>
        }
        if (isInvite == 3) {
            button = <button style={{ float: "right" }}>Approve</button>
            button2 = <button style={{ float: "right" }}>Deny</button>
        }

        const type = this.state.id;
        let type_name;
        if (type == 1) {
            type_name = "Group Invite"
        }
        if (type == 2) {
            type_name = "Rate"
        }
        if (type == 3) {
            type_name = "Register Visitor"
        }
        return (
            <div>
                <Card style={{ width: '50rem' }} >
                    <Card.Img variant="top" style={{ width: '250px' }} />
                    <Card.Body  >

                        <Card.Title >{type_name}</Card.Title>
                        <Card.Text >
                            {this.state.body}
                            <div>
                                {button}
                                {button2}
                            </div>
                        </Card.Text>

                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default NotificationCards;