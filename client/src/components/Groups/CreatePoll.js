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
    const poll_obj = {
      description = this.state.description,
      polls = this.state.polls
    }

    CreatePoll(poll_obj).then(res => {
    this.props.history.push(`/poll`)
    })
  };
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
        />
        &nbsp;
        <button onClick={this.addpoll}>Add New Option</button>
        <br/><br/>
        {polls.map((val, idx) => {
          let pollid = `poll-${idx}`,
            startTimeId = `startTime-${idx}`,
            endTimeId = `endTime-${idx}`;
          return (
            <div key={idx}>
              <label htmlFor={pollid}>{`Poll Option ${idx + 1}`}: </label>
              <input
                type="date"
                name={pollid}
                data-id={idx}
                id={pollid}
                value={polls[idx].date}
                className="date"
                
              />
              
              &nbsp;
              <label htmlFor={startTimeId}>Start Time</label>
              <input
                type="time"
                name={startTimeId}
                data-id={idx}
                id={startTimeId}
                value={polls[idx].startTime}
                className="startTime"
              />
              &nbsp;
              <label htmlFor={endTimeId}>End Time </label>
              <input
                type="time"
                name={endTimeId}
                data-id={idx}
                id={endTimeId}
                value={polls[idx].endTime}
                className="endTime"
              />
             &nbsp;
              <button onClick={() => this.detetePoll(idx)}> - </button>
              <br/><br/>
            </div>
          );
        })}
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default PollForm;


const rootElement = document.getElementById("root");
ReactDOM.render(<PollForm />, rootElement);