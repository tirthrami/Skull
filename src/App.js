import React from 'react';
import logo from './logo.svg';
import { Game } from 'boardgame.io/core';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';

import './App.css';
import { Skull } from './Game';
import { Board } from './frontend/Board';


const SkullClient = Client({
  game: Skull,
  board: Board,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
  debug: true,
})

// const App = () => (
//   <div>
//     <SkullClient playerID="0" />
//     <SkullClient playerID="1" />
//   </div>
// );

class App extends React.Component {
  state = { playerID: null };

  render() {
    if (this.state.playerID === null) {
      return (
        <div>
          <p>Play as</p>
          <button onClick={() => this.setState({ playerID: "0" })}>
            Player 0
          </button>
          <button onClick={() => this.setState({ playerID: "1" })}>
            Player 1
          </button>
        </div>
      );
    }
    return (
      <div>
        <SkullClient playerID={this.state.playerID} />
      </div>
    );
  }
} 

export default App;
