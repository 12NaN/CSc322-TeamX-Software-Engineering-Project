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
import axios from 'axios'

class Group extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            members: [],
            rating: 0, 
            data: false
        }
       // this.setState({id: this.props.id, name: this.props.name, members: this.props.members});
    }
    componentDidMount(){
        const {match: {params}} = this.props
        axios.get(`/projects/${params.id}`)
            .then(response => {
            console.log("hi")
            console.log(response.data["GroupMembers"])
            console.log(response.data['Users'])
            console.log(response.data['Group'][0]["group_name"])
            this.setState({
                name: response.data['Group'][0]["group_name"],
                rating: response.data['Group'][0]["rating"]
            })
            console.log(response.data['Group'][0])
            
            let j = 0;
            let k = []
            for(let i = 0; i < response.data['Users'].length; i++){
                if(j < response.data['GroupMembers'].length && response.data['GroupMembers'][j]["user_id"] == response.data['Users'][i]["id"]){
                    k.push(response.data['Users'][i]["user_name"])

                    
                   //console.log(response.data['Users'][i]["id"])
                    j++;
                }
            }
            console.log(this.state.members)
            this.setState({
                members: k,
                data:true
            })
            return response.data
        })
        .catch(err => {
            console.log(err)
        }) 
    }
    render() {
        if(!this.state.data) return null
        return (
            <div>
                <img src={image} className="center" style={{height:"200px", width:"200px"}}/>
                <h1 id="groupName">{this.state.name}</h1>
                <Ratings rating={this.state.rating}/>
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