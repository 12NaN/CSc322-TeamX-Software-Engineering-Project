import React, { Component, useState, useEffect } from 'react';
import io from "socket.io-client";

//let endPoint = "http://localhost:5000";
//let socket = io.connect(`${endPoint}`);
class Poll extends Component {
    constructor(){
        super();
        this.meeting = this.meeting.bind(this);
        this.state = {
            mon: 0,
            tue: 0,
            wed: 0,
            thur: 0,
            fri: 0,
            sat: 0,
            sun: 0
        }
    }
    meeting(event){
        if(event.target.id == 'mon'){
            console.log(this.state.mon);
            this.setState({mon: this.state.mon+1})
        }
        else if(event.target.id == 'tue'){
            this.setState({tue: this.state.tue+1})
        }
        else if(event.target.id == 'wed'){
            this.setState({wed: this.state.wed+1})
        }
        else if(event.target.id == 'thur'){
            this.setState({thur: this.state.thur+1})
        }
        else if(event.target.id == 'fri'){
            this.setState({fri: this.state.fri+1})
        }
        else if(event.target.id == 'sat'){
            this.setState({sat: this.state.sat+1})
        }
        else{
            this.setState({sun: this.state.sun+1})
        }
    }
    render() {

        return (
            <div>
                <h1>Next Meeting Poll</h1>
                <h1>Votes: {this.state.mon} </h1>
                <button id="mon" onClick={this.meeting.bind(this)}>Monday</button>
                <h1>Votes: {this.state.tue} </h1>
                <button id="tue" onClick={this.meeting.bind(this)}>Tuesday</button>
                <h1>Votes: {this.state.wed} </h1>
                <button id="wed" onClick={this.meeting.bind(this)}>Wednesday</button>
                <h1>Votes: {this.state.thur}</h1>
                <button id="thur" onClick={this.meeting.bind(this)}>Thursday</button>
                <h1>Votes: {this.state.fri}</h1>
                <button id="fri" onClick={this.meeting.bind(this)}>Friday</button>
                <h1>Votes: {this.state.sat}</h1>
                <button id="sat" onClick={this.meeting.bind(this)}>Saturday</button>
                <h1>Votes: {this.state.sun}</h1>
                <button id="sun" onClick={this.meeting.bind(this)}>Sunday</button>
            </div>
        );
    }
}

export default Poll;