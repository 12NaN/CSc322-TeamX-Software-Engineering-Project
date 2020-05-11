import React, { Component, useState, useEffect } from 'react';
import io from "socket.io-client";
import {Link} from 'react-router-dom';


//let endPoint = "http://localhost:5000";
//let socket = io.connect(`${endPoint}`);
class PollSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            group_id: this.props.group
        };
    }
    
    
    render() {

        return (
            <div>
                <h1>Available Polls:</h1>
                 <Link to={{pathname: '/projects/' + this.props.group + '/createpoll', state: {groupsid: this.props.group}}}>
                            Create Poll
                    </Link>    
            </div>
        );
    }
}

export default PollSection;