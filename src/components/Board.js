import React from "react";
import { useContext } from "react";
import { Context } from "./GameContext";
import Card from "./Card";

export default function Board() {
  const { gameState, nextGameState } = useContext(Context);
  const playerCard = gameState[gameState.team].drawnCard;
  const opponentCard =
    gameState[gameState.team === "red" ? "blue" : "red"].drawnCard;
  return (
    <div>
      {gameState.state === "new game" || gameState.state === "comparison" ? (
        <button onClick={() => nextGameState()}>Draw Cards</button>
      ) : null}

      {gameState.state === "cards drawn" ? (
        <>
          <button onClick={() => nextGameState({ wantsEditing: true })}>
            Edit Traits
          </button>
          <button onClick={() => nextGameState({ wantsEditing: false })}>
            Play Card
          </button>
        </>
      ) : null}
      {playerCard != null ? (
        <Card
          name={playerCard.name}
          picture={playerCard.picture}
          hitpoint={playerCard.hitPoint}
        />
      ) : null}
      {gameState.state === "comparison" ? (
        <Card
          name={opponentCard.name}
          picture={opponentCard.picture}
          hitpoint={opponentCard.hitPoint}
        />
      ) : null}
    </div>
  );
}
