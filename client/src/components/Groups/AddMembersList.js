import React, { Component } from 'react';
import Cards from '../Cards';
import {Link} from 'react-router-dom';
import {Card, CardDeck, Button} from 'react-bootstrap';
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
            <Cards name={i["user_name"]} rating={i["rating"]} id={i["id"]} type={"user"}/>
            <Link style={{"padding": "10px","backgroundColor":"purple","height":"40px", "width":"185px"}} to={''} className="btn btn-primary">Invite</Link>
        </div>
        );
        return (
            <div>
                <h1>Invite Group Members</h1>
                <CardDeck>
                    {members}
                </CardDeck>
                <br/>
                <Link style={{"backgroundColor":"purple"}} to={'/projects'} className="btn btn-primary">Return to projects</Link>
            </div>
        );
    }
}

export default AddMembersList;