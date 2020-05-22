import { ActivePlayers } from 'boardgame.io/core';
import { TurnOrder } from 'boardgame.io/core'

export function changeName(G, ctx, name) {
  G.players[ctx.currentPlayer].name = name;
}
export function playCard(G, ctx, card) {
  var player = G.players[ctx.playerID];
  if (player.cards.includes(card)) {
    let index = player.cards.indexOf(card);
    player.cards.splice(index, 1);
    player.plays.push(card);
    G.cardsOnTable[ctx.currentPlayer].playedCards.push({ type: card, flipped: false });
  }
}
//TODO: limit bet to max cards played
export function placeBet(G, ctx, num) {
  var player = G.players[ctx.currentPlayer];
  if (num > 0 && (num > G.currentBet || G.currentBet == null)) {
    player.bet = num;
    G.currentBet = num;
  }
}
export function flipCard(G, ctx, playerID) {
  for (let index = G.cardsOnTable[playerID].playedCards.length - 1; index >= 0; index--) {
    let card = G.cardsOnTable[playerID].playedCards[index];
    console.log(card.type);
    if (!card.flipped) {
      card.flipped = true;
      if (card.type === 'skull' && playerID === ctx.currentPlayer) {
        resetGame(G, ctx, false);
      }
      else if (card.type === 'skull') {
        resetGame(G, ctx, true);
        ctx.events.endPhase();
      }
      else {
        let flippedCount = countFlipped(G, ctx);
        if (flippedCount === G.currentBet) {
          G.players[ctx.currentPlayer].points++;
          resetGame(G, ctx, false);
          ctx.events.endPhase();
        }
      }
      break;
    }
  }
}
export function discardOwnCard(G, ctx, card) {
  var player = G.players[ctx.currentPlayer];
  if (player.cards.includes(card)) {
    let index = player.cards.indexOf(card);
    player.cards.splice(index, 1);
    ctx.events.endPhase();
  }
}
export function resetGame(G, ctx, skullFlipped) {
  G.currentBet = null;
  G.cardsOnTable.forEach((player) => { player.playedCards = []; });
  G.players.forEach((player) => {
    player.cards = player.cards.concat(player.plays);
    player.bet = null;
    player.plays = [];
  });
  if (skullFlipped) {
    let index = ctx.random.Die(G.players[ctx.currentPlayer].cards.length) - 1;
    G.players[ctx.currentPlayer].cards.splice(index, 1);
  }
}
export function countFlipped(G, ctx) {
  let flippd = 0;
  G.cardsOnTable.forEach((player) => {
    player.playedCards.forEach((card) => {
      if (card.flipped)
        flippd++;
    });
  });
  return flippd;
}

export function initializeGame(ctx) {
    const G = {
      players: Array(ctx.numPlayers).fill({
        name: null,
        cards: ['skull', 'rose', 'rose', 'rose'], 
        plays: [], 
        bet: null,
        points: 0}),
      cardsOnTable: Array(ctx.numPlayers).fill({
        playedCards: []
      }),
      currentBet: null,
      winner: null,
    }
    return G;
  }
  
  export const Skull = {
    setup: initializeGame,
    minPlayers: 2,
    maxPlayers: 8,
  
    turn: {
      moveLimit: 1
    },
  
    phases : {
      //Initial Placement Phase
      initialPlay: {
        turn: {
          moveLimit: 1,
        },
        onBegin: (G,ctx) => {
          ctx.events.setActivePlayers(ActivePlayers.ALL_ONCE)
        },
        moves: { playCard, 
                changeName: { move: changeName, noLimit: true }},
        endIf: G => {
          return G.players.every(player => player.plays.length !== 0 );
        },
        next: 'play',
        start: true,
      },
      //Secondary Placement Phase
      play: {
        turn: {
            order: TurnOrder.CONTINUE
          },
        moves: { playCard, placeBet },
        endIf: G => (G.currentBet != null),
        next: 'betting'
      },
      //Betting and Flipping Phase
      betting: {
        turn: {
          activePlayers: ActivePlayers.ALL,
        },
        moves: { 
          placeBet, 
          flipCard: {move: (G, ctx, playerID) => {
                          flipCard(G,ctx, playerID)
                          ctx.events.setActivePlayers([ctx.currentPlayer])
                      },
                      noLimit: true
                    },
          discardOwnCard
        },
        next: 'initialPlay'
      },
    },
  //Victory Condition
   endIf: (G, ctx) => {
      for(var i = 0; i< G.players.length; i++){
        if(G.players[i].points === 2){
          return G.players[i].name;
        }
      }
   },
   onEnd: (G, ctx) => {
      G.winner = ctx.gameover;
    }
  };

  export default Skull
