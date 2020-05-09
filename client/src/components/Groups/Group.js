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
import Form from './Forms';
import {CardDeck} from 'react-bootstrap';
class Group extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: '',
            name: '',
            members: [],
            desc: '',
            visi_posts: false,
            visi_members: false,
            visi_eval: false,
            visi_warn: false,
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
                id: response.data['Group'][0]["group_id"],
                desc: response.data['Group'][0]["group_desc"],
                name: response.data['Group'][0]["group_name"],
                rating: response.data['Group'][0]["rating"],
                visi_posts: response.data['Group'][0]["visi_posts"],
                visi_members: response.data['Group'][0]["visi_members"],
                visi_eval: response.data['Group'][0]["visi_eval"],
                visi_warn: response.data['Group'][0]["visi_warn"]
            })
            console.log(response.data['Group'][0])
            
            let j = 0;
            let k = []
            for(let i = 0; i < response.data['Users'].length; i++){
                if(j < response.data['GroupMembers'].length && response.data['GroupMembers'][j]["user_id"] == response.data['Users'][i]["id"]){
                    k.push({
                        "id": response.data['Users'][i]["id"],
                        "user_name": response.data['Users'][i]["user_name"],
                        "rating": response.data['Users'][i]["rating"]
                    })                    
                   //console.log(response.data['Users'][i]["id"])
                    j++;
                }
            }
            console.log(this.state.id)
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
                <h3>Description: {this.state.desc}</h3>
                <hr></hr>
                <Sections sectionName="Posts" privacy={this.state.visi_posts} component={<Form group = {this.state.id} user = {1}/>}/>
                <hr></hr>
                <Sections sectionName="Members" privacy={this.state.visi_members} component={<Members members={this.state.members}/>}/>
                <hr></hr>
                <Sections sectionName="Tasks" privacy={this.state.visi_posts} component={<Todo/>}/>
                <hr></hr>
                <Sections sectionName="Poll" privacy={this.state.visi_posts} component={<Poll groupID= {this.state.id}/>}/>
                <hr></hr>
                <Sections sectionName="Evaluations" privacy={this.state.visi_eval} component={<Evaluations/>}/>
                <hr></hr>
                <Sections sectionName="Warnings" privacy={this.state.visi_warn} component={<Warnings/>}/>
            </div>
        );
    }
}

export default Group;