import React, { Component } from "react";
import ReactDOM from "react-dom";

class PollForm extends Component {
  state = {
    polls: [{ date: "", startTime: "", endTime: "" }],
    description: ""
  };

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
  }
  render() {
    
    let { description, polls } = this.state;
    return (

      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        
        <label htmlFor="description">Description: </label>
        
        <input
          type="text"
          name="description"
          id="description"
          value={description}
          class="form-control " rows="3"
        />
        <button onClick={this.addpoll} style={{"backgroundColor": "purple"}} className="btn btn-dark">Add New Option</button>
        <br/><br/>
        {polls.map((val, idx) => {
          let pollid = `poll-${idx}`,
            startTimeId = `startTime-${idx}`,
            endTimeId = `endTime-${idx}`;
          return (
            <div key={idx} class="form-group row">
              <div class="col-3">
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
              
              <div class="col-2">
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
              <div class="col-2">
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


const rootElement = document.getElementById("root");
ReactDOM.render(<PollForm />, rootElement);
