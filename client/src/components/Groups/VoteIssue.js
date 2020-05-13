import React, { Component } from 'react';
import Poll from 'react-polls';
import {Link} from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
 
class VoteIssue extends Component {
  // Setting answers to state to reload the component with each vote
  constructor(props){
        super(props);
        this.state ={
            VoteReults: [],
            nameVote:'',
            group_id:'',
            newdata:[{option: '', votes:''}],
            vote_id:'',
            subject_id:'',
            issuer_id:'',
            user_data:[],
            user_id_access:'',
            voters: [],
            vote_type: '',
            member_data: [],

            voteStyles: {
            questionSeparator: true,
            questionSeparatorWidth: 'poll',
            questionBold: true ,
            questionColor: '#800080',
            align: 'left',
            theme: 'purple'
            },
            dataFetched: false

        }
    }

    
  // Handling user vote
  // Increments the votes count of answer when the user votes
  handleVote = voteAnswer => { 
    const { newdata } = this.state.newdata
    const newnewdata = this.state.newdata.map(answer => {
      if (answer.option === voteAnswer) answer.votes++
      return answer
    })
    this.setState({
      newdata: newnewdata
    })
    axios.post(`/projects/${this.state.group_id}/votefor/issue/${this.props.match.params['id2']}`, {
      NewVoteData: this.state.newdata,
      user_id_access: this.state.user_id_access
    })
    .then((r) =>{
      console.log(r)
    }).catch(error => {
            if(error.response.status && error.response.status===500)
            NotificationManager.error("Bad Request");
            else NotificationManager.error("Something Went Wrong");
            this.setState({ errors: error })
        });
        
    NotificationManager.success("Vote Submitted!", 'SUCCESS'); 
  }
  
  componentDidMount(){
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
     axios.get(`/projects/${this.props.match.params['id']}/votefor/issue/${this.props.match.params['id2']}`)
       .then((response) =>{
           this.setState({
            user_id_access: decoded.identity.id,
            user_data: [...response.data['Users']],
            member_data: [...response.data['Members']],
            vote_id: this.props.match.params['id2'],
            group_id: this.props.match.params['id'],
            nameVote: response.data['VoteInfo'][0]['desc'],
            subject_id: response.data['VoteInfo'][0]['user_id_subject'],
            issuer_id: response.data['VoteInfo'][0]['user_id_issuer'],
            VoteReults: response.data['VoteInfo'],
            voters: [...response.data['Voters']],
            vote_type: response.data['VoteInfo'][0]['vote_type'],
            newdata: [{ option:'Yes', votes: response.data['VoteInfo'][0]['vote_yes'] }, {option: 'No', votes: response.data['VoteInfo'][0]['vote_no']}],
            dataFetched: true
           })
           console.log(response.data['VoteInfo'])    
           console.log(this.state)
       })
  }
  render () {

          let voted= false;
          let permission= false;
          let username = '';
          let type = '';
          
           for(var i=0;i<this.state.voters.length;i++){
             if(this.state.user_id_access === this.state.voters[i].user_id && this.state.voters[i].status === 1){
                 voted= true
             }
             if(this.state.user_id_access === this.state.voters[i].user_id){
                permission= true
                break;
             }
           }
           for(var i=0;i<this.state.member_data.length;i++){
              if(this.state.subject_id === this.state.member_data[i].id){
                username=this.state.member_data[i].user_name
                break;
              }
           }   

            if(this.state.vote_type === 0){
              type = 'Compliment'
            }
            if(this.state.vote_type === 1){
                type = 'Warning'
            }
            if(this.state.vote_type === 2){
              type = 'Kick'
            }
            if(this.state.vote_type === 3){
                type = 'GroupClosure'
             }

  if(voted === true){
    return(
      <div>
        <h1>You are not allowed to vote again. </h1>
                 <Link style={{"backgroundColor": "purple", "variant":"outline-dark"}} className='btn btn-dark btn-block'to={{pathname: '/projects/' + this.state.group_id}}>
                            Return
                    </Link>  
      </div>
    )
  }
  else if(permission === false){
    return(
      <div>
        <h1>You do not have permission to vote for this. </h1>
                 <Link style={{"backgroundColor": "purple", "variant":"outline-dark"}} className='btn btn-dark btn-block'to={{pathname: '/projects/' + this.state.group_id}}>
                            Return
                    </Link>  
      </div>
    )
  }
  else if(voted === false && permission ===true){
    return (
      <div>
        <h1>Type: {type} </h1>
        <br></br>
        <h4>User: {username}</h4>
          <br></br>
            <NotificationContainer/>
            <Poll  question={"Description/Reason: "+this.state.nameVote} answers={this.state.newdata} onVote={this.handleVote} customStyles= {this.state.voteStyles} />
                 <Link style={{"backgroundColor": "purple", "variant":"outline-dark"}} className='btn btn-dark btn-block'to={{pathname: '/projects/' + this.state.group_id}}>
                            Return
                    </Link>  
      </div>
    );
  }
}
};

export default VoteIssue;