import { useContext } from "react";
import "./App.css";
import { Context } from "./components/GameContext";

function App() {
  const { gameState, setGameState } = useContext(Context);
  return (
    <div className="App">
      {gameState.red.drawnCard}
      <button
        onClick={() => {
          const newState = { ...gameState };
          newState.red.drawnCard = 5;
          setGameState(newState);
        }}
      >
        Click
      </button>
      <h1>test</h1>
    </div>
  );
}

export default App;
