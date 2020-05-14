import React, { Component } from 'react'
import Rating from './Ratings';
import userimg from './ProfileImages/user.png'
import {Link} from 'react-router';
import axios from 'axios'

class Profile extends Component {
  constructor() {
    super()
    this.state = {
        user_name: "",
        email: "",
        interest: "",
        rating: 0
    }
  }

  componentDidMount() {
    const {match: {params}} = this.props
    axios.get(`/users/${params.id}`)
        .then(response => {
        console.log(response.data["User"][0]["email"])
       // console.log(response.data['Group'][0]["group_name"])
        
        this.setState({
            user_name: response.data['User'][0]["user_name"],
            email: response.data['User'][0]["email"],
            interest: response.data['User'][0]['interest'],
            rating: response.data['User'][0]['rating'],
            user_type: this.state.rating > 30 ? "VIP" : "Ordinary User"
        })
        
        return response.data
    })
    .catch(err => {
        console.log(err)
    }) 
    this.setState({
      first_name: "",
      last_name: "",
      email: "",
      rating: 0,
      groups: []
    })
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">PROFILE</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <img src={userimg} style={{ height: "200px", width: "200px" }} />
            <tbody>
              <tr>
                <td>Username</td>
                <td>{this.state.user_name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td>Interest</td>
                <td>{this.state.interest}</td>
              </tr>
              <tr>
                <td>Rating</td>
                <td>{<Rating rating={this.state.rating}/>}</td>
              </tr>
              <tr>
                <td>User Type</td>
                <td>{this.state.rating > 30 ? 'VIP' : 'Ordinary User'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Profile