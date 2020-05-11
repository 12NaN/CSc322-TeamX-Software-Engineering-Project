import React, { Component } from "react";
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class PollForm extends Component {
  constructor(props) {
        super(props);
        console.log(this.props)
        console.log(this.props.location.state["group_id"])
        
        this.state = {
          group_id: '',   
          polls: [{ date: "", startTime: "", endTime: "" }],
          description: ""
        };

  }

  handleChange = e => {
    if (["date", "startTime", "endTime"].includes(e.target.className)) {
      let polls = [...this.state.polls];
      polls[e.target.dataset.id][e.target.className] = e.target.value;
      this.setState({ polls }, () => console.log(this.state.polls));
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
    this.setState({ group_id: this.props.match.params['id'] }, () => console.log(this.state));
  };

  addpoll = e => {
    this.setState(prevState => ({
      polls: [...prevState.polls, { date: "", startTime: "", endTime: "" }]
    }));
  };

  detetePoll(index) {
    const polls1 = [...this.state.polls];
    polls1.splice(index, 1);
    this.setState({ polls: polls1 });
  }

  handleSubmit = e => {
    e.preventDefault();
     if(this.state.description==='')
        {
            NotificationManager.warning("Please complete all fields.", 'ATTENTION');
            return false;
        }
        for(var i=0;i<this.state.polls.length;i++)
        {
                if(this.state.polls[i].date==='' || this.state.polls[i].startTime===''|| this.state.polls[i].endTime==='')
                {
                    NotificationManager.warning("Please complete all fields.", 'ATTENTION');
                    return false;
                }
        }
    axios.post(`/projects/${this.state.group_id}/createpoll`, {
      group_id: this.state.group_id,
      polls: this.state.polls,
      description: this.state.description
    })
    .then((r) =>{
      console.log(r)
    }).catch(error => {
            if(error.response.status && error.response.status===500)
            NotificationManager.error("Bad Request");
            else NotificationManager.error("Something Went Wrong");
            this.setState({ errors: error })
        });
        
    NotificationManager.success("Poll Created!", 'SUCCESS');
    setTimeout(() => this.props.history.push(`/projects/${this.props.match.params['id']}`),3000)
  }
  
  goBack = e =>{
    this.setState({group_id: '', polls: [{ date: "", startTime: "", endTime: "" }], description: ""})
    console.log(this.state)
    this.props.history.push(`/projects/${this.props.match.params['id']}`)
  }

  render() {
    
    let { description, polls } = this.state;
    return (
      <div className="content">
      <NotificationContainer/>
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <h1>Schedule a Meeting Poll</h1>
        <label htmlFor="description">Description: </label>
        
        <input
          type="text"
          name="description"
          id="description"
          value={description}
          className="form-control " rows="3"
        />
        <button onClick={this.addpoll} type='button' style={{"backgroundColor": "purple"}} className="btn btn-dark">Add New Option</button>
        <br/><br/>
        {polls.map((val, idx) => {
          let pollid = `poll-${idx}`,
            startTimeId = `startTime-${idx}`,
            endTimeId = `endTime-${idx}`;
          return (
            <div key={idx} className="form-group row">
              <div className="col-3">
                <label htmlFor={pollid}>{`Poll Option ${idx + 1}`}: </label>
              <input
                type="date"
                name={pollid}
                data-id={idx}
                id={pollid}
                value={polls[idx].date}
                className="date"
   
              />
              </div>
              
              <div className="col-2">
              <label htmlFor={startTimeId}>Start Time</label>
              <input
                type="time"
                name={startTimeId}
                data-id={idx}
                id={startTimeId}
                value={polls[idx].startTime}
                className="startTime"
                
              />
              </div>
              <div className="col-2">
              <label htmlFor={endTimeId}>End Time </label>
              <input
                type="time"
                name={endTimeId}
                data-id={idx}
                id={endTimeId}
                value={polls[idx].endTime}
                className="endTime"
              
              />
              </div>
             <div class="col">              
              <button onClick={() => this.detetePoll(idx)} type='button'style={{"backgroundColor": "purple"}} className="btn btn-dark"> - </button>
              </div>
            </div>
          );
        })}
        <button onClick={this.goBack} type='button' style={{"backgroundColor": "purple"}} className="btn btn-dark">Cancel</button>
        &emsp;
        <button type="submit" style={{"backgroundColor": "purple"}} className="btn btn-dark">Create</button>
      </form>
      </div>
    );
  }
}

export default PollForm;