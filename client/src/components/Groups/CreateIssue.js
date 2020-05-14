import React, { Component } from 'react';
import Poll from 'react-polls';
import {Link} from 'react-router-dom';
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './selectcustom.css'
 
// Declaring poll question and answers
const pollQuestion = 'Is react-polls useful?'
const pollAnswers = []
 
class CreateIssueVote extends Component {
  // Setting answers to state to reload the component with each vote
  constructor(props){
        super(props);
        this.state ={
              description: '',  
              issuer_id: '',
              subject_name: '',
              group_id:'',
              user_list: [{username: '', id: ''}],
              user_data: [],
              vote_type: '',
              datafetched: false
        }
    }

 handleChange = e => {
      this.setState({subject_name: e.target.value });
  }

 handleChange2 = e => {
      this.setState({vote_type: e.target.value });
      console.log(this.state)
  }

  
  componentDidMount(){
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    console.log(this.props.match.params['id'])
     axios.get(`/projects/${this.props.match.params['id']}/createissue/handler`)
       .then((response) =>{console.log(this.props.match.params['id'])
        console.log(this.props.match.params)
           //console.log(response.data['PollOptions'])
           //console.log(response.data['Polls'][0]['desc'])
           console.log(response.data['Users'])
          this.setState({
            issuer_id: decoded.identity.id,
            user_data: [...response.data['Users']],
            group_id: this.props.match.params['id'],
            dataFetched: true
           }) 
           console.log(this.state.issuer_id)
           for(var i=0;i<this.state.user_data.length;i++){
             let user_list = [...this.state.user_list];
             user_list[i].username = this.state.user_data[i].user_name;
             user_list[i].id = this.state.user_data[i].id;
             this.setState(prevState => ({
                user_list: [...prevState.user_list, { username: '', id:'' }]
             }));
           }            
           
           this.setState({
              user_list: this.state.user_list.slice(0, -1)
            });
           console.log(this.state.user_list)
           //console.log(this.state.newdata)
       })
  }

handleSubmit = e => {
    e.preventDefault();
     if(this.state.description==='' || this.state.subject_name === '' || this.state.vote_type ==='' )
        {
            NotificationManager.warning("Please complete all fields.", 'ATTENTION');
            return false;
        }
      if(this.state.issuer_id === ''){
           NotificationManager.warning("Wait a minute... you are not supposed to be here...", 'ATTENTION');
           return false;
      }
      for(var i=0;i<this.state.user_list.length;i++)
        {
                if(this.state.issuer_id != this.state.user_list[i].id && i == this.state.user_list.length)
                {
                    NotificationManager.warning("You are not authorized to do that, buddy.", 'ATTENTION');
                    return false;
                }
        }
    axios.post(`/projects/${this.props.match.params['id']}/createissue/handler`, {
      group_id: this.state.group_id,
      issuer_id: this.state.issuer_id,
      description: this.state.description,
      vote_type: this.state.vote_type,
      subject_name: this.state.subject_name,
      user_list: this.state.user_list
    })
    .then((r) =>{
      console.log(r)
    }).catch(error => {
            if(error.response.status && error.response.status===500)
            NotificationManager.error("Bad Request");
            else NotificationManager.error("Something Went Wrong");
            this.setState({ errors: error })
        });
        
    NotificationManager.success("Vote issued!", 'SUCCESS');
    setTimeout(() => this.props.history.push(`/projects/${this.props.match.params['id']}`),3000)
  }

  render () {
    let optionTemplate = this.state.user_list.map(v => (
      <option value={v.id}>{v.username}</option>
    ));
    if(this.state.vote_type==='3'){
      optionTemplate = <option value={this.state.issuer_id}>This Group</option>
    }
    return (
      <div>
      <NotificationContainer/>
      <form onSubmit={this.handleSubmit}>
        <h1>Vote to Issue a Warning/Compliment/Kick or Group Closure</h1>
        <br></br>
        <h4>If you select Group Closure, select your own username below.</h4>
        <label> Vote Type:
          <div>
           <select class='custom-select' type='input' value={this.state.vote_type} onChange={this.handleChange2}>
                  <option value="">Select Type</option>
                  <option value="0">Compliment</option>
                  <option value="1">Warn</option>
                  <option value="2">Kick</option>
                  <option value="3">Group Closure</option>
           </select>
          </div>
        </label>
        <br></br>
        <label htmlFor="description">Description: </label>
        <input placeholder="Enter your reason..."
       value={this.state.description}
       class="form-control " rows="3"
       onChange={e => {
           this.setState({ description: e.target.value });
           this.value = this.state.description;
       }}
      />
        <br></br>
        <label> This vote is for:
          <div>
           <select class='custom-select' type='input' value={this.state.subject_name} onChange={this.handleChange}>
                  <option value="0">Select User</option>
                  {optionTemplate}
           </select>
          </div>
        </label>
        <br></br>
        <Link style={{"backgroundColor": "purple", "variant":"outline-dark"}} className='btn btn-dark'to={{pathname: '/projects/' + this.state.group_id}}>
                            Return
                    </Link>  
         &emsp;
        <input type="submit" value="Submit" style={{"backgroundColor": "purple", "variant":"outline-dark"}} className='btn btn-dark btn' />
      </form>
          <br></br>
                    
      </div>
    );
  }
};

export default CreateIssueVote;
