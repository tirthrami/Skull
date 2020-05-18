import React from 'react';
import logo from './logo.svg';
import { Game } from 'boardgame.io/core';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer'
import './App.css';
import { Skull } from './Game';


const SkullClient = Client({
  game: Skull,
  //multiplayer: Local()
})

const App = SkullClient
export default App;
