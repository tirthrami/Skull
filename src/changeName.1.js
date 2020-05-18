export function changeName(G, ctx, name) {
  G.players[ctx.currentPlayer].name = name;
}
export function playCard(G, ctx, card) {
  var player = G.players[ctx.currentPlayer];
  if (player.cards.includes(card)) {
    let index = player.cards.indexOf(card);
    player.cards.splice(index, 1);
    player.plays.push(card);
    G.cardsOnTable[ctx.currentPlayer].playedCards.push({ type: card, flipped: false });
  }
}
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
      if (card.type == 'skull' && playerID == ctx.currentPlayer) {
        resetGame(G, ctx, false);
      }
      else if (card.type == 'skull') {
        resetGame(G, ctx, true);
        ctx.events.endPhase();
      }
      else {
        let flippedCount = countFlipped(G, ctx);
        if (flippedCount == G.currentBet) {
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
