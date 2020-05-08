import React, { Component } from 'react';
import {Card, ListGroup} from 'react-bootstrap';
import axios from 'axios';
class postCards extends Component {
    constructor(props){
        super(props);
    }
    /*
    componentDidMount(){
        axios.get(`/projects/${params.id}`)
        .then(response => {
            console.log(response.data['Posts'])
            return response
        })
    }
    */

    render() {

        return (
            <div>
            <Card style={{ width: '18rem' }}>
            <ListGroup variant="flush">
                {this.props.list}
            </ListGroup>
            </Card>
            </div>
        );
    }
}

export default postCards;