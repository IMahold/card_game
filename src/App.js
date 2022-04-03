import { useContext } from "react";
import "./App.css";
import { Context } from "./components/GameContext";
import ChooseTeams from "./components/ChooseTeams";
import Endgame from "./components/Endgame";
import Board from "./components/Board";

function App() {
  const { gameState, nextGameState, determineWinner } = useContext(Context);
  return (
    <div className="App">
      {gameState.state === "choose teams" ? (
       <ChooseTeams />
      ) : gameState.state === "end game" ?  <Endgame /> : <Board />}
    </div>
  );
}

export default App;
