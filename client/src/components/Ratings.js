import React, { Component } from 'react';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

class Ratings extends Component {
  constructor(props){
    super(props)

  }
  render() {
    //const [value, setValue] = React.useState(2);
    return (
      <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Rating name="read-only" value={this.props.rating} readOnly />
      </Box>
    </div>
    );
  }
}

export default Ratings;