import React, { Component } from 'react';
import Cards from '../Cards';
import {Link} from 'react-router-dom';
import {Card, CardDeck, Button} from 'react-bootstrap';
import axios from 'axios';
class AddMembersList extends Component {
    constructor(props){
        super(props);
        console.log("hi")
        console.log(this.props.location.state.group_id)
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
            <Cards name={i["user_name"]} rating={i["rating"]} id={i["id"]} type={"user"} invite={"yes"} group_id={this.props.location.state.group_id}/>
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