import React, { Component } from 'react'
import Rating from './Ratings';
import jwt_decode from 'jwt-decode'
import userimg from './ProfileImages/user.png'


class Profile extends Component {
  constructor() {
    super()
    this.state = {
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      rating: 0,
      image: '',
      user_type:'',
      errors: {}
    }
  }

  componentDidMount() {
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    this.setState({
      id: decoded.identity.id,
      user_name: decoded.identity.user_name,
      first_name: decoded.identity.first_name,
      last_name: decoded.identity.last_name,
      rating: decoded.identity.rating,
      image: decoded.identity.image_file,
      email: decoded.identity.email
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
                <td>First Name</td>
                <td>{this.state.first_name}</td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>{this.state.last_name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td>Rating</td>
                <td><Rating rating={this.state.rating}/></td>
              </tr>
              <tr>
                <td>User Type</td>
                <td>{this.state.rating > 30 ? 'VIP' : 'Ordinary User'}</td>
              </tr>
              <tr>
                <td>Groups</td>
              </tr>

            </tbody>
          </table>
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">WhiteList</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Username</td>
                <td>{this.state.user_name}</td>
              </tr>
            </tbody>
          </table>
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">BlackList</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Username</td>
                <td>{this.state.user_name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Profile