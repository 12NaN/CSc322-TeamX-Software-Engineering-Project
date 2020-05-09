import React, { Component } from 'react';
import {Accordion, Card} from 'react-bootstrap';
class Sections extends Component {
    constructor(props){
        super(props);
        this.state = {
            sectionName: this.props.sectionName,
            component: this.props.component, 
            privacy: this.props.privacy
        }
        console.log(this.state.privacy)
    }
    render() {
        if(this.state.privacy == false)
            return (
                <div>
                    <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                        {this.state.sectionName}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>{this.state.component}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </div>
            );
        else
            return (
                <div>
                    <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                        {this.state.sectionName}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>You need to be a member of this group to view this.</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </div>
            );
    }
}

export default Sections;