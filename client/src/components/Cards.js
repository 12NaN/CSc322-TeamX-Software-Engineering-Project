import React, { Component } from 'react';
import {Card} from 'react-bootstrap';
import Bryan from './ProfileImages/user.png';
import { LetterAvatars } from './Groups/LetterAvatars';
import {Link} from 'react-router-dom';
import Ratings from './Ratings';
class Cards extends Component {
    constructor(props){
        super(props);
        this.state ={
            name: '',
            rating: 0,
            dataFetched: false
        }

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
                            <Ratings rating={this.state.rating}/>
                        </Card.Text>
                    {/*
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                    </Card.Text>
                    */}
                    </Card.Body>
                    <Card.Footer>
                    <Link to={this.props.type == "user" ? "/users/"+ this.props.id: "/projects/" + this.props.id}>
                            View Page
                    </Link>                 
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}

export default Cards;