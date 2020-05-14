import React, { Component } from 'react';
import { getProfiles} from './UserFunctions'
import {Link} from 'react-router-dom';
import Cards from './Cards';
import jwt_decode from 'jwt-decode';
import {CardDeck} from 'react-bootstrap';

class Users extends Component {
    constructor(){
        super();
        this.state ={
            id: '',
            users: [],
            data: false
        }
    }
    componentDidMount() {
    
        if(localStorage.usertoken){
            const token = localStorage.usertoken
            const decoded = jwt_decode(token)
            this.setState({
                id: decoded.identity.id
            })
        }
        
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
            <Cards name={i["user_name"]} rating={i["rating"]} id={i["id"]} type={"user"} su={this.state.id== 1?true:false}/>
        );
        return (
            <div>
                <h1 className="text-center">Users</h1>
                <Link to="/complaint" className="btn btn-warning">Make a complaint</Link>
                <br/>
                <br/>
                <CardDeck>{listItems}</CardDeck>
            </div>
        );
    }
}

export default Users;