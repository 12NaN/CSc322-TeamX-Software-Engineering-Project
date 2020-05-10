import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';

class Complaints extends Component {
    render() {
        return (
            <div>
            <h1>Complaint</h1>
            <br/>
            <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Complaint Towards</Form.Label>
                <Form.Control type="text" placeholder="Username/Group name" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Text</Form.Label>
                <Form.Control as="textarea" rows="3" />
            </Form.Group>
            <Button variant="secondary" style={{"backgroundColor": "purple"}} type="submit" onClick={this.setTimeStamp}>
                Submit
            </Button>
            </Form>
            </div>
        );
    }
}

export default Complaints;