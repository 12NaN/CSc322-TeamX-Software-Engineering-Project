import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Form, Row, Col} from 'react-bootstrap';
import AddMembersList from './AddMembersList';
import axios from 'axios';
class CreateGroups extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            desc: "",
            post: false,
            members: false,
            eval: false,
            warn: false
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handlePostChange = this.handlePostChange.bind(this);
        this.handleMembersChange = this.handleMembersChange.bind(this);
        this.handleEvalChange = this.handleEvalChange.bind(this);
        this.handleWarnChange = this.handleWarnChange.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleNameChange(e){
        this.setState({name: e.target.value});
    }
    handleDescChange(e){
        this.setState({desc: e.target.value});
    }
    handlePostChange(e){
        this.setState({post: this.state.post == true ? false : true});
    }
    handleMembersChange(e){
        this.setState({members: this.state.members == true ? false : true});
    }
    handleEvalChange(e){
        this.setState({eval: this.state.eval == true ? false: true});
    }
    handleWarnChange(e){
        console.log(e.target.value)
        this.setState({warn: this.state.warn == true ? false: true});
    }
    handleOnClick(e){
        e.preventDefault();
        axios.post('/projects/create', {
            group_name: this.state.name,
            group_desc: this.state.desc,
            visi_post: this.state.post== true ? 1 : 0,
            visi_members: this.state.members == true ? 1 : 0,
            visi_eval: this.state.eval == true ? 1 : 0,
            visi_warn: this.state.warn == true ? 1 : 0,
            rating: 0
          })
          .then((r) =>{
              console.log(r)
          })
    }
    render() {
        return (
            <div>
                <h1>Create A Group</h1>
                <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="exampleForm.ControlInput1" value={this.state.name} onChange={this.handleNameChange}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Team name" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1" value={this.state.desc} onChange={this.handleDescChange}>
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
                     onChange={this.handlePostChange}
                    />
                    <Form.Check
                    type="checkbox"
                    label="Members list"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                    onChange={this.handleMembersChange}
                    />
                    <Form.Check
                    type="checkbox"
                    label="Evaluations"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios3"
                    onChange={this.handleEvalChange}
                    />
                    <Form.Check
                    type="checkbox"
                    label="Warnings"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios3"
                    onChange={this.handleWarnChange}
                    />
                </Col>
                </Form.Group>
                <Link style={{"backgroundColor":"purple"}} to={'/projects/create/addMembers'} className="btn btn-primary" onClick={this.handleOnClick}>Submit</Link>
                </Form>
            </div>
        );
    }
}

export default CreateGroups;