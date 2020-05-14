import React, { Component } from 'react';
import { CardDeck } from 'react-bootstrap';
import Cards from './Cards';
import Rating from './Ratings';
import jwt_decode from 'jwt-decode';
import userimg from './ProfileImages/user.png';
import axios from 'axios';


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
      interest: '',
      user_type: '',
      groups: [],
      wht: [],
      blk: [],
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
      interest: decoded.identity.interest,
      image: decoded.identity.image_file,
      email: decoded.identity.email,
      data: false
    })
    //@app.route("/users/<user_id>", methods=['GET'])
    axios.get(`http://localhost:5000/users/${decoded.identity.id}`).then(res => {
      console.log("Start here")
      console.log(res.data);
      let g = [];
      for (let i = 0; i < res.data['Groups'].length; i++) {
        for (let j = 0; j < res.data['GroupMembers'].length; j++)
          if (res.data['Groups'][i]['group_id'] == res.data['GroupMembers'][j]['group_id']) {
            g.push(res.data['Groups'][i]);
          }
      }
      var uw = [];
      console.log(res.data['White'])
      for (let i = 0; i < res.data['Users'].length; i++) {
        for (let j = 0; j < res.data['White'].length; j++)
          if (res.data['Users'][i]['id'] == res.data['White'][j]['whtbxd_prsn_id']) {
            //console.log(res.data['Users'][i])
            uw.push(res.data['Users'][i]);
          }
      }
      console.log(uw)
      let ub = [];
      console.log(res.data['Users'])
      console.log(res.data['Black'])
      for (let i = 0; i < res.data['Users'].length; i++) {
        for (let j = 0; j < res.data['Black'].length; j++)
          if (res.data['Users'][i]['id'] == res.data['Black'][j]['blkbxd_prsn_id']) {
            ub.push(res.data['Users'][i]);
          }
      }
      this.setState({
        groups: g,
        blk: ub,
        wht: uw,
        data: true
      })
      console.log(ub)
      console.log(uw)
      return res;
    })
  }
  render() {
    if (!this.state.data) return null;
    console.log(this.state.blk)
    let group = this.state.groups.map((i) =>
      <Cards name={i['group_name']} rating={i['rating']} id={i['group_id']} type={"project"} />
    )
    let black = this.state.blk.map((i) =>
      <Cards name={i['user_name']} rating={i['rating']} id={i['id']} type={"user"} />
    )
    let white = this.state.wht.map((i) =>
      <Cards name={i['user_name']} rating={i['rating']} id={i['id']} type={"user"} />
    )
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
                <td>Interest</td>
                <td>{this.state.interest}</td>
              </tr>
              <tr>
                <td>Rating</td>
                <td><Rating rating={this.state.rating} /></td>
              </tr>
              <tr>
                <td>User Type</td>
                <td>{this.state.rating >= 30 ? 'VIP' : 'Ordinary User'}</td>
              </tr>
              <tr>
                <td>Groups</td>
                <CardDeck>
                  {group}
                </CardDeck>
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
                <CardDeck>
                  {white}
                </CardDeck>
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
                <CardDeck>
                  {black}
                </CardDeck>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )

  }
}

export default Profile