import React, { Component } from 'react';
import { getProjects} from './UserFunctions'
import Cards from './Cards';
class Projects extends Component {
    constructor(){
        super();
        this.state ={
            groups: [],
            data: false
        }
    }
    componentDidMount() {
        getProjects().then(res =>{
          this.setState({
            groups: res["Groups"],
            data: true
          })
        })
    }
    render() {
        if(!this.state.data) return null;
        
        const listItems = this.state.groups.map((i) =>
            <Cards name={i["group_name"]} rating={i["rating"]} id={i["group_id"]}/>
        );
        return (
            <div>
                <h1 className="text-center">Projects</h1>
                <ul>{listItems}</ul>
            </div>
        );
    }
}

export default Projects;