const Server = require('boardgame.io/server').Server;
const Skull = require('./game').Skull;
const server = Server({ games: [Skull] });
server.run(8000);