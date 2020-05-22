import React from 'react';

class Board extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {state: props.G};
    }

    componentDidMount(){

        this.setState(this.state);
    }
    render() {
      
        return(<p>{this.state.state.players}</p>);
    }
} 
  
  export default Board;