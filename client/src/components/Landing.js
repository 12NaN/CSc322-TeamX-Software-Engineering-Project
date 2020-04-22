import React, { Component } from 'react'

class Landing extends Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">WELCOME TO FRIENDS</h1>
            <hr/>
            <h4 className="text-center">Top 3 Rated Projects</h4>
            <hr/>
            <h4 className="text-center">Top 3 Rated User Profiles</h4>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing