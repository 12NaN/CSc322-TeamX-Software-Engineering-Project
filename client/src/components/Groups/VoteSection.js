import React, { Component, useState, useEffect } from 'react';
import io from "socket.io-client";
import {Link} from 'react-router-dom';
import {Button, ListGroup} from 'react-bootstrap';
import PollCards from './pollCards'
import axios from 'axios';
import './PollSection.css';

//let endPoint = "http://localhost:5000";
//let socket = io.connect(`${endPoint}`);
class VoteSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            group_id: this.props.group,
            polls: [],
            data: true

        };
    }
    componentDidMount() {
       
        axios.get(`/projects/${this.state.group_id}`)
       .then((response) =>{
           console.log(response.data['Polls'])
           this.setState({
            polls: [...response.data['Polls']].reverse(),
            data: true

           })
           console.log('hello')
           console.log(this.state.polls)
           console.log('hi')
       })
    }
    
    render() {
        const listItems = this.state.polls.map((i) =>
            <PollCards pollname={i["desc"]} poll_id={i["poll_id"]} group_id={this.state.group_id}/>
        );
        return (
            <div>
                <h1>Available Meeting Polls</h1>
                <br/>
                <div className='pollsection'>
                <ListGroup></ListGroup>
                </div>
                <br/>
                <br/>
                 <Link style={{"backgroundColor": "purple"}} className='btn btn-dark btn-block'to={{pathname: '/projects/' + this.props.group + '/createissue/handler'}}>
                            Create Vote
                    </Link>                
            </div>
        );
    }
}

export default VoteSection;