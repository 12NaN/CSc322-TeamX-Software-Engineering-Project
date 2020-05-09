import React, { Component } from 'react';
import { getProfiles} from './UserFunctions'
import {Link} from 'react-router-dom';
import Cards from './Cards';
import {CardDeck} from 'react-bootstrap';

class Users extends Component {
    constructor(){
        super();
        this.state ={
            users: [],
            data: false
        }
    }
    componentDidMount() {
        getProfiles().then(res =>{
          this.setState({
            users: res["Users"],
            data: true
          })
        })

    }
    render() {
        if(!this.state.data) return null;
        const listItems = this.state.users.map((i) =>
            <Cards name={i["user_name"]} rating={i["rating"]} id={i["id"]} type={"user"}/>
        );
        return (
            <div>
                <h1 className="text-center">Users</h1>
                <Link to="/projects/create" className="btn btn-warning">Make a complaint</Link>
                <br/>
                <br/>
                <CardDeck>{listItems}</CardDeck>
            </div>
        );
    }
}

export default Users;