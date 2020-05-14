import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import Bryan from './ProfileImages/user.png';
import { LetterAvatars } from './Groups/LetterAvatars';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Ratings from './Ratings';
import NumericInput from 'react-numeric-input';
class Cards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            rating: 0,
            group_id: this.props.group_id,
            dataFetched: false

        }
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnClick2 = this.handleOnClick2.bind(this);
    }
    handleOnClick(e) {
        e.preventDefault();

        axios.post('/projects/create/mem', {
            group_id: this.state.group_id,
            user_id: this.props.id
        }).then((r) => {
            console.log(r)
        })
    }
    handleOnClick2(e){
        e.preventDefault();
        console.log(e.target.value)
        
        axios.post('/users',{
            rating: this.props.rating + e.target.value,
            user_id: this.props.id
        }).then((r)=> {
            console.log(r)
        })      
                  
    }
    componentDidMount(){
        this.setState({
            name: this.props.name,
            rating: this.props.rating
        })
    }
    render() {
        return (
            <div>
                <Card>
                    <Card.Img variant="top" src={''} />
                    <Card.Body>
                        <Card.Title>{this.state.name}</Card.Title>
                        <Card.Text>
                            <Ratings rating={this.state.rating} />
                        </Card.Text>
                        {/*
                        <Card.Text>
                            This is a wider card with supporting text below as a natural lead-in to
                            additional content. This content is a little bit longer.
                        </Card.Text>
                        */}
                    </Card.Body>
                    <Card.Footer>
                        <Link style={{ "backgroundColor": "purple" }} className="btn btn-dark" to={this.props.type == "user" ? "/users/" + this.props.id : "/projects/" + this.props.id}>
                            View Page
                        </Link>

                        {this.props.invite == "yes" ?
                        <Link style={{ "backgroundColor": "mustard" }} className= "btn btn-dark" onClick={this.handleOnClick}>
                                                       <br/> Invite
                        </Link> : ""}
                        {this.props.su == true ? <h6>Change Rating</h6>: ""}
                        {this.props.su == true ? <NumericInput min={-100} max={100} value={0} onClick={this.handleOnClick2}/>: ""}                    
                        </Card.Footer>
                    </Card>
                </div>
            );
    }
}

export default Cards;