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
            group_id: this.props.group,
            user_id: this.props.user,
            content: '',
            prevPosts: []
         };
      }
      onSubmit = (e)=>{
          e.preventDefault();
          this.setState({
            prevPosts: [{'content': this.state.content, 'group_id': this.state.group_id, 'title': this.state.title, 'user_id': this.state.user_id},...this.state.prevPosts]
          }) 
          //const {match: {params}} = this.props
          axios.post(`/projects/${this.state.group_id}`, {
            title: this.state.title,
            group_id: this.state.group_id,
            user_id: this.state.user_id,
            content: this.state.content
          })
          .then((r) =>{
              console.log(r)
          })
          this.setState({
              title: '',
              content: ''
          })
          
      }
      myChangeHandler1 = (event) => {
        this.setState({title: event.target.value});
      }
      myChangeHandler2 = (e)=>{
          this.setState({content: e.target.value});
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
            <Card.Header>{i['title']}</Card.Header>
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
      <Button variant="primary" type="submit">
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