import React, { Component } from 'react';
import Poll from 'react-polls';
import {Link} from 'react-router-dom';
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
 
// Declaring poll question and answers
const pollQuestion = 'Is react-polls useful?'
const pollAnswers = []
 
class PollVote extends Component {
  // Setting answers to state to reload the component with each vote
  constructor(props){
        super(props);
        this.state ={
            pollOptions: [],
            namePoll:'',
            group_id:'',
            newdata:[{option: '', votes:''}],
            poll_id:'',
            pollStyles1: {
            questionSeparator: true,
            questionSeparatorWidth: 'question',
            questionBold: true ,
            questionColor: '#800080',
            align: 'center',
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
    axios.post(`/projects/${this.state.group_id}/poll/${this.state.poll_id}`, {
      NewPollData: this.state.newdata
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
     axios.get(`/projects/${this.props.match.params['id']}/poll/${this.props.match.params['id2']}`)
       .then((response) =>{
           console.log(response.data['PollOptions'])
           console.log(response.data['Polls'][0]['desc'])
           this.setState({
            PollOptions: [...response.data['PollOptions']],
            poll_id: this.props.match.params['id2'],
            group_id: this.props.match.params['id'],
            namePoll: response.data['Polls'][0]['desc'],
            dataFetched: true
           })
           for(var i=0;i<this.state.PollOptions.length;i++){
             let newdata = [...this.state.newdata];
             newdata[i].option = this.state.PollOptions[i].option;
             newdata[i].votes = this.state.PollOptions[i].votes;
             this.setState(prevState => ({
                newdata: [...prevState.newdata, { option:'',votes:'' }]
             }));
           }            
           this.setState({
              newdata: this.state.newdata.slice(0, -1)
            });
           console.log(this.state.newdata)
       })
  }
  render () {
    const { pollAnswers } = this.state
    return (
      <div>
          <br></br>
            <NotificationContainer/>
            <Poll  question={this.state.namePoll} answers={this.state.newdata} onVote={this.handleVote} customStyles= {this.state.pollStyles1} />
                 <Link style={{"backgroundColor": "purple", "variant":"outline-dark"}} className='btn btn-dark btn-block'to={{pathname: '/projects/' + this.state.group_id}}>
                            Return
                    </Link>  
      </div>
    );
  }
};

export default PollVote;
