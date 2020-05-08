import React, { Component } from 'react';
import {Card, Button} from 'react-bootstrap';
import axios from 'axios';
class AddMembersList extends Component {
    constructor(){
        super();
        this.state = {
            users: [],
            members: []
        }
    }
    componentDidMount(){
        axios.get('/users')
        .then((response)=>{
            this.setState({
                users: response.data['Users']
            })
        })
    }
    render() {
        let members = this.state.users.map((i) =>
        <div>
            <Card.Header>{i['user_name']}</Card.Header>
            <Card.Body>
                <blockquote className="blockquote mb-0">
                <Button>Invite</Button>
                </blockquote>
            </Card.Body>
            <br/>
        </div>
        );
        return (
            <div>
                <h1>Invite Group Members</h1>
                <Card>
                    {members}
                </Card>
            </div>
        );
    }
}

export default AddMembersList;