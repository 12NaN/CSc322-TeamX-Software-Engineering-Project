import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Projects from './components/Projects'
import Users from './components/Users'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import userPage from './components/userPage'
import Group from './components/Groups/Group'
import Notifications from './components/Notifications'
import CreateGroups from './components/Groups/CreateGroups.js'
import AddMembersList from './components/Groups/AddMembersList'
import Complaints from './components/Complaints'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/projects" component={Projects} />
            <Route exact path="/projects/:id" component={Group} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/notifications" component={Notifications} />
            <Route exact path="/users/:id" component={userPage} />
            <Route exact path="/group" component={Group} />
            <Route exact path="/projects/create" component={CreateGroups}/>
            <Route exact path="/projects/create/addMembers" component={AddMembersList}/>
            <Route exact path="/complaint" component={Complaints}/>
          </div>
        </div>
      </Router>
    )
  }
}

export default App