import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import Bryan from './ProfileImages/user.png';
import { LetterAvatars } from './Groups/LetterAvatars';
import { Link } from 'react-router-dom';
import Ratings from './Ratings';
import axios from 'axios';

class ApproveCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            id: 0,
            rating: 0,
            email: '',
            type: 0,
            dataFetched: false
        }
        this.onApprove = this.onApprove.bind(this)
        this.onDeny = this.onDeny.bind(this)
    }
    componentDidMount() {
        this.setState({
            name: this.props.name,
            rating: this.props.rating,
            id: this.props.id,
            email: this.props.email,
            type: this.props.type,
        })
    }

    onApprove() {
        axios.post('/notifications', {
            id: this.state.id,
            sender_id: 1,
            body: "Approved",
            email: this.state.email,
            type: 4,
        })
            .then((r) => {
                console.log(r)
            })
        this.setState(state => ({
            isDisabled: true,
            disabled: true,
        }));
    }

    onDeny() {
        axios.post('/notifications', {
            id: this.state.id,
            sender_id: 1,
            body: "Denied",
            email: this.state.email,
            type: -1,

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

        let approve;
        let deny;
        approve = <button onClick={this.onApprove} disabled={this.state.isDisabled} style={{ float: "right" }} style={{"backgroundColor": "purple"}} className="btn btn-dark">Approve</button>
        deny = <button onClick={this.onDeny} disabled={this.state.isDisabled} style={{ float: "right" }} style={{"backgroundColor": "purple"}} className="btn btn-dark">Decline</button> 
        console.log(this.state.email);
        return (
            <div>
                <Card>
                    <Card.Img variant="top" src={''} />
                    <Card.Body>
                        <p>User ID {this.state.id}</p>
                        <p>Email {this.state.email}</p>
                        <p> A new user signed up! Awaiting your approval...</p>
                        <Card.Title>{this.state.name}</Card.Title>
                        <Card.Text>

                        </Card.Text>
                        {/*
                        <Card.Text>
                            This is a wider card with supporting text below as a natural lead-in to
                            additional content. This content is a little bit longer.
                        </Card.Text>
                        */}
                    </Card.Body>

                    <Card.Footer>
                        <Link style={{"backgroundColor": "purple"}} className="btn btn-dark" to={"/users/" + this.props.id}>
                            View Page

                            
                        </Link>
                        &emsp;
                        {approve}
                        &emsp;
                            {deny}
                    </Card.Footer>
                </Card>

            </div>
        );
    }
}

export default ApproveCard;