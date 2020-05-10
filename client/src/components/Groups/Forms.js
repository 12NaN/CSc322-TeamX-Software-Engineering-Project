import React, { Component } from 'react';
import {Form, Button, Card, ListGroup, ListItem} from 'react-bootstrap';
import image from '../ProfileImages/user.png';
import axios from 'axios';
import postCards from './postCards';
class Forms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            date_posted: '',
            group_id: this.props.group,
            user_id: this.props.user,
            content: '',
            prevPosts: []
         };
      }
      onSubmit = (e)=>{
          e.preventDefault();
          if(this.state.title == "" || this.state.content == ""){
            alert("Error. There is an empty field.")
          }
          else{
            this.setState({
              prevPosts: [{'content': this.state.content, 'group_id': this.state.group_id, 'title': this.state.title, 'user_id': this.state.user_id, 'date_posted':this.state.date_posted},...this.state.prevPosts]
            }) 
          //const {match: {params}} = this.props
            axios.post(`/projects/${this.state.group_id}`, {
              title: this.state.title,
              group_id: this.state.group_id,
              user_id: this.state.user_id,
              content: this.state.content,
              date_posted: this.state.date_posted,
            })
            .then((r) =>{
                console.log(r)
            })
            this.setState({
                title: '',
                content: ''
            })
          }
          
      }
      // Custom static function that timestamps a post .. Can we move to UserFunctions.js??
      static getDateTime(){
        var d = new Date();
        return d.toUTCString();
      }
      myChangeHandler1 = (event) => {
        this.setState({title: event.target.value});
      }
      myChangeHandler2 = (e)=>{
          this.setState({content: e.target.value});
      }
      // Handling the time stamp when the button is clicked
      setTimeStamp = (e)=>{
        this.setState({date_posted: Forms.getDateTime()})
      }
/*
      componentDidMount(){
     //   const {match: {params}} = this.props
        axios.get(`/projects/${this.state.group_id}`)
        .then((response) =>{
            console.log(response.data['Posts'])
            this.setState({
                prevPosts: [...response.data['Posts']]
            })
            console.log(this.state.prevPosts)
        })
      }
*/
    componentDidMount(){
    //   const {match: {params}} = this.props
       axios.get(`/projects/${this.state.group_id}`)
       .then((response) =>{
           console.log(response.data['Posts'])
           this.setState({
               prevPosts: [...response.data['Posts']].reverse()
           })
           console.log(this.state.prevPosts)
       })
     }
      render() {
        const list = this.state.prevPosts.map((i) =>
            <div>
                <Card.Header>{i['title']} &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; {i['date_posted']}</Card.Header>
                <Card.Body>
                    <blockquote className="blockquote mb-0">
                    {i['content']}
                    </blockquote>
                </Card.Body>
                <br/>
            </div>
        );
        return (
            <div>
      {      /*
          <form onSubmit={this.onSubmit}>
          <h1>Hello {this.state.username}</h1>
          <p>Enter title:</p>
          <input
            type='text'
            onChange={this.myChangeHandler1}
          />
          <p>Enter text:</p>
          <input
            type="text"
            onChange={this.myChangeHandler2}
            />
                  <input
        type='submit'
      />*/}
      <Form onSubmit={this.onSubmit}>
      <Form.Group controlId="exampleForm.ControlInput1" onChange={this.myChangeHandler1}>
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={this.state.title} />
      </Form.Group>
  
      <Form.Group controlId="exampleForm.ControlTextarea1" onChange={this.myChangeHandler2}>
          <Form.Label>Content</Form.Label>
          <Form.Control as="textarea" rows="5" value={this.state.content} />
      </Form.Group>
      <Button variant="secondary" style={{"backgroundColor": "purple"}} type="submit" onClick={this.setTimeStamp}>
        Submit
    </Button>
      </Form>
      <br/>
      <Card>
        {list}  
        <br/>
      </Card>
        </div>
        );
      }
}

export default Forms;