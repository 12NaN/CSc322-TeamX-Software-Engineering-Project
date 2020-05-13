import React, { Component, useState, useEffect } from 'react';
import io from "socket.io-client";
import {Link} from 'react-router-dom';
import {Button, ListGroup} from 'react-bootstrap';
import VoteCards from './voteCards'
import axios from 'axios';
import './PollSection.css';


//let endPoint = "http://localhost:5000";
//let socket = io.connect(`${endPoint}`);
class VoteSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            group_id: this.props.group,
            votes: [],
            data: true

        };
    }
    componentDidMount() {
       
        axios.get(`/projects/${this.state.group_id}`)
       .then((response) =>{
           console.log(response.data['Vote'])
           this.setState({
            votes: [...response.data['Vote']].reverse(),
            data: true

           })
           console.log('hello')
           console.log(this.state.votes)
           console.log('hi')
       })


    }
    
    render() {
        const listItems = this.state.votes.map((i) =>
            <VoteCards votename={i["desc"]} vote_id={i["vote_id"]} group_id={this.state.group_id} yes_votes={i["vote_yes"]} no_votes={i["vote_no"]} vote_type={i["vote_type"]} subject_user={i["user_id_subject"]}/>
        );
        return (
            <div>
                <h1>Available Votes</h1>
                <br></br>
                <h4>Make sure you vote! </h4>
                <br/>
                <div className='pollsection'>
                <ListGroup>{listItems}</ListGroup>
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
