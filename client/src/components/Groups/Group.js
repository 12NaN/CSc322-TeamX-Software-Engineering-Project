import React, { Component } from 'react';
import Ratings from '../Ratings';
import Todo from './Todo';
import Sections from './Sections';
import Poll from './Poll';
import Members from './Members';
import Evaluations from './Evaluations';
import Warnings from './Warnings';
import Posts from './Posts';
import image from '../ProfileImages/user.png';
class Group extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: '1',
            name: 'Team X',
            members: ["Frank", "Bryan", "Henry", "Peter"],
            image: "",
            rating: 5, 
            posts:[]
        }
       // this.setState({id: this.props.id, name: this.props.name, members: this.props.members});
    }
    render() {
        return (
            <div>
                <img src={image} className="center" style={{height:"200px", width:"200px"}}/>
                <h1 id="groupName">{this.state.name}</h1>
                <Ratings/>
                <hr></hr>
                <Sections sectionName="Posts" component={<Posts/>}/>
                <hr></hr>
                <Sections sectionName="Members" component={<Members members={this.state.members}/>}/>
                <hr></hr>
                <Sections sectionName="Tasks" component={<Todo/>}/>
                <hr></hr>
                <Sections sectionName="Poll" component={<Poll/>}/>
                <hr></hr>
                <Sections sectionName="Evaluations" component={<Evaluations/>}/>
                <hr></hr>
                <Sections sectionName="Warnings" component={<Warnings/>}/>
            </div>
        );
    }
}

export default Group;