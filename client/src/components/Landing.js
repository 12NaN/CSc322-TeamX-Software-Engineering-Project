import React, { Component } from 'react'
import WELCOME from './ProfileImages/WELCOME.png'
import LOGO2 from './ProfileImages/LOGO2.png'

class Landing extends Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <img src={WELCOME} class='middle' />
            <img src={LOGO2} class='middle' style={{ height: "250px", width: "300px" }} />

            <hr />
            <h4 className="text-center">Top 3 Rated Projects</h4>
            <hr />
            <h4 className="text-center">Top 3 Rated User Profiles</h4>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing