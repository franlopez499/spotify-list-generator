import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';

export default class Playlist extends React.Component {
  
    constructor(props){
       super(props);
        this.state = {
            
        };
  }
 
  
  componentDidMount(){
    
  }
  
 
  render() {
    return (
        <Card>
        <Card.Img variant="top" src={this.props.image} />
        <Card.Body>
          <Card.Title>{this.props.name}</Card.Title>
          <Card.Text>
            De {this.props.owner}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
            <small className="text-muted">ID: {this.props.id}</small>
        </Card.Footer>
      </Card>
    )
  }
}
