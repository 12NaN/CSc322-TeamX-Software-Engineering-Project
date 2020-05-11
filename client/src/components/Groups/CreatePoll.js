import React, { Component } from "react";
import axios from 'axios'

class PollForm extends Component {
  constructor(props) {
        super(props);
        console.log(this.props)
        console.log(this.props.location.state["group_id"])
        
        this.state = {
          group_id: this.props.location.state["group_id"],   //This is the issue -> this.props.match.params['id'],
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
    axios.post(`/projects/${this.state.group_id}/createpoll`, {
      group_id: this.state.group_id,
      polls: this.state.polls,
      description: this.state.description
    })
    .then((r) =>{
      console.log(r)
    })
    
  }
  componentDidMount(){
    this.setState({
      group_id: this.props.group_id
    }); 
    console.log(this.state.group_id)
  }

  render() {
    
    let { description, polls } = this.state;
    return (

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
        <button onClick={this.addpoll} style={{"backgroundColor": "purple"}} className="btn btn-dark">Add New Option</button>
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
             <div className="col">              
              <button onClick={() => this.detetePoll(idx)} style={{"backgroundColor": "purple"}} className="btn btn-dark"> - </button>
              </div>
            </div>
          );
        })}
        <input type="submit" value="Submit"  style={{"backgroundColor": "purple"}} className="btn btn-dark"/>
      </form>
    );
  }
}

export default PollForm;