import React, { Component, useState, useEffect } from 'react';
import io from "socket.io-client";
import {Link} from 'react-router-dom';


//let endPoint = "http://localhost:5000";
//let socket = io.connect(`${endPoint}`);
class PollSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            group_id: ''
        };
    }
    componentDidMount(){
        this.setState({
            group_id: this.props.group
        })
        console.log("FUCCCCCCK")
        console.log(this.props.group)
    }
    
    render() {

        return (
            <div>
                <h1>Available Polls:</h1>
                 <Link to={{pathname: `/projects/${this.state.group_id}/createpoll`, state: {group_id: this.state.group_id}}}>
                            Create Poll
                    </Link>    
            </div>
        );
    }
}

export default PollSection;