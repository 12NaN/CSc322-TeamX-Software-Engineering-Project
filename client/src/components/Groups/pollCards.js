import React, { Component } from 'react';
import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';


class PollCards extends Component {
    constructor(props){
        super(props);
        this.state ={
            pollname: '',
            poll_id: '',
            group_id: '',
            dataFetched: false
        }

    }
    componentDidMount(){
        this.setState({
            pollname: this.props.pollname,
            poll_id: this.props.poll_id,
            group_id: this.props.group_id,
            dataFetched: true
            
        })
        console.log('HELLOOO??')
        console.log(this.state)
    }
    render() {
            return (
                <div>
                    <Card style={{width: '56rem' }, {height: '8rem'}}>
                        <Card.Body>
                        <Card.Title>{this.state.pollname}</Card.Title>
                        </Card.Body>
                        <Card.Footer>
                        <Link style={{"backgroundColor": "purple"}} className='btn btn-dark btn-block' to={'/projects/'+this.state.group_id+'/poll/'+this.state.poll_id}>
                                Vote
                        </Link>                 
                        </Card.Footer>
                    </Card>
                </div>
            );
    }
}

export default PollCards;;