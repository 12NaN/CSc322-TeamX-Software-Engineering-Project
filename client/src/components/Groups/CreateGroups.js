import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Form, Row, Col} from 'react-bootstrap';
import AddMembersList from './AddMembersList';

class CreateGroups extends Component {
    render() {
        return (
            <div>
                <h1>Create A Group</h1>
                <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Team name" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="3" />
                </Form.Group>
                
                <Form.Group as={Row}>
                <Form.Label as="legend" column sm={2}>
                    Privacy Settings
                </Form.Label>
                <Col sm={10}>
                    <Form.Check
                    type="checkbox"
                    label="Posts"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios1"
                    />
                    <Form.Check
                    type="checkbox"
                    label="Members list"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                    />
                    <Form.Check
                    type="checkbox"
                    label="Evaluations"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios3"
                    />
                    <Form.Check
                    type="checkbox"
                    label="Warnings"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios3"
                    />
                </Col>
                </Form.Group>
                <Link to={'/projects/create/addMembers'} className="btn btn-primary">Submit</Link>
                </Form>
            </div>
        );
    }
}

export default CreateGroups;