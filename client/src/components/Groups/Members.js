import React, { Component } from 'react';

class Members extends Component {
    constructor(props){
        super(props);
        this.state = {
            members: []
        };

    }
    componentDidMount(){
        this.setState({members: this.props.members});
        console.log(this.state.members);
    }
    render() {
        let j = 1;
        const listItems = this.state.members.map((i) =>
            <li key={j++}>{i}</li>
        );
        return (
            <div>
                <h1>Members</h1>
                <ul>{listItems}</ul>
            </div>
        );
    }
}

export default Members;