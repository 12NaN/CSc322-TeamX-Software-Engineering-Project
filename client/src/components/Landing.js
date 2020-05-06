import React, { Component } from 'react';
import { getProfilesAndGroups } from './UserFunctions'
import WELCOME from './ProfileImages/WELCOME.png';
import Cards from './Cards';
import LOGO2 from './ProfileImages/LOGO2.png';

class Landing extends Component {
  constructor() {
    super()
    this.state = {
      groups: [],
      profiles: [],
      dataFetched: false
    }
  }
  componentDidMount() {
    getProfilesAndGroups().then(res =>{
      
      this.setState({
        groups: res["Groups"],
        profiles: res["Users"],
        dataFetched: true
      })
      console.log(this.state.groups[0])
      console.log(this.state.profiles[1]["user_name"])
     console.log(res["Groups"][0].group_name)
    })
    //response.data["Groups"][0]["group_id"]
  }

  render() {
    if(!this.state.dataFetched) return null;
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <img src={WELCOME} class='middle' />
            <img src={LOGO2} class='middle' style={{ height: "250px", width: "300px" }} />

            <hr />
            <h4 className="text-center">Top 3 Rated Projects</h4>
            
            <Cards name={this.state.profiles[0]["user_name"]} rating={this.state.profiles[0]["rating"]} id={this.state.profiles[0]["id"]} type={"user"}/>
            <Cards name={this.state.profiles[1]["user_name"]} rating={this.state.profiles[1]["rating"]} id={this.state.profiles[1]["id"]} type={"user"}/>
            <Cards name={this.state.profiles[2]["user_name"]} rating={this.state.profiles[2]["rating"]} id={this.state.profiles[2]["id"]} type={"user"}/>

            <hr />
            
            <h4 className="text-center">Top 3 Rated User Profiles</h4>
            <Cards name={this.state.groups[0]["group_name"]} rating={this.state.groups[0]["rating"]} id={this.state.groups[0]["group_id"]} type={"project"}/>
            <Cards name={this.state.groups[1]["group_name"]}rating={this.state.groups[1]["rating"]} id={this.state.groups[1]["group_id"]} type={"project"}/>
            <Cards name={this.state.groups[2]["group_name"]} rating={this.state.groups[2]["rating"]} id={this.state.groups[2]["group_id"]} type={"project"}/>

            
          </div>
        </div>
      </div>
    )
  }
}

export default Landing