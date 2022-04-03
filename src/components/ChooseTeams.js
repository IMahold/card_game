import React from "react";
import { useContext } from "react";
import { Context } from "./GameContext";

export default function ChooseTeams() {
  const { nextGameState } = useContext(Context);
  return (
    <div>
      <button
        onClick={() => nextGameState({ choosenTeam: "red" })}
        className="red"
      >
        Red Team
      </button>
      <button
        onClick={() => nextGameState({ choosenTeam: "blue" })}
        className="blue"
      >
        Blue Team
      </button>
    </div>
  );
}
