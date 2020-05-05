import React, { Component } from 'react';
import { getProfiles} from './UserFunctions'
import Cards from './Cards';
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
                <ul>{listItems}</ul>
            </div>
        );
    }
}

export default Users;