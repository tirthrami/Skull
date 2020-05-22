import React from 'react';
import equal from 'fast-deep-equal';

export class Board extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {state: props.G, playerID: props.playerID};
    }

    componentDidMount(){

        this.setState(this.state);
    }
    shouldComponentUpdate(nextProps){
        return !equal(this.props.G, nextProps.G);
    }
    componentDidUpdate(prevProps){
            this.setState(this.state);
    }
    render() {
        
        return(
        <div>
            <p>{this.props.G.players[this.state.playerID].cards}</p>
        </div>
        );
    }
} 