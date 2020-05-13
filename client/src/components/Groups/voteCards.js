import React, { Component } from 'react';
import {Card, ProgressBar} from 'react-bootstrap';
import {Link} from 'react-router-dom';


class VoteCards extends Component {
    constructor(props){
        super(props);
        this.state ={
            votename: '',
            vote_id: '',
            group_id: '',
            yes_votes: '',
            no_votes: '',
            vote_type: '',
            subject_user: '',
            members:[],
            dataFetched: false
        }

    }

    
    componentDidMount(){
        this.setState({
            votename: this.props.votename,
            vote_id: this.props.vote_id,
            group_id: this.props.group_id,
            yes_votes: this.props.yes_votes,
            no_votes: this.props.no_votes,
            vote_type: this.props.vote_type,
            subject_user: this.props.subject_user,
            members: this.props.members,
            dataFetched: true
        })

    }
    render() {
        let  bar = this.state.yes_votes;
        let bar2 = this.state.no_votes;
        let barFull = bar+bar2;
        let barA = (bar/barFull)*100;
        let barB = (bar2/barFull)*100;
        let name = '';
        let u_name = '';
        if(this.state.vote_type === 0){
            name = 'Compliment'
        }
        if(this.state.vote_type === 1){
            name = 'Warning'
        }
        if(this.state.vote_type === 2){
            name = 'Kick'
        }
        if(this.state.vote_type === 3){
            name = 'GroupClosure'
        }

        for(var i=0;i<this.props.members.length;i++){
              if(this.state.subject_user === this.props.members[i].id){
                u_name=this.props.members[i].user_name
                break;
              }
           } 
        
            return (
                
                <div>
                    <Card>
                        <Card.Body>
                        <Card.Title>{name} for {u_name}</Card.Title>
                        <Card.Text>{this.state.votename}</Card.Text>
                        <br></br>
                        <Card.Text>Yes: {this.state.yes_votes}</Card.Text>
                        <ProgressBar now={barA} />
                        <Card.Text>No: {this.state.no_votes}</Card.Text>
                         <ProgressBar now={barB} />
                        </Card.Body>
                        <Card.Footer>
                        <Link style={{"backgroundColor": "purple"}} className='btn btn-dark btn-block' to={'/projects/'+this.state.group_id+'/votefor/issue/'+this.state.vote_id}>
                                Vote
                        </Link>                 
                        </Card.Footer>
                    </Card>
                </div>
            );
    }
}

export default VoteCards;;
