import React, { Component } from 'react';
import Cards from '../Cards';
import {Card, CardDeck} from 'react-bootstrap';
class Members extends Component {
    constructor(props){
        super(props);
        this.state = {
            members: []
        };

    }
    componentDidMount(){
        this.setState({members: this.props.members});
        console.log(this.state.members);
    }
    render() {
        const listItems = this.state.members.map((i) =>
            <Cards name={i["user_name"]} id={i["id"]} rating={i["rating"]} type={"user"}/>
        );
        return (
            <div>
                <h1>Members</h1>
                <CardDeck>{listItems}</CardDeck>
            </div>
        );
    }
}

export default Members;