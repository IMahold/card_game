import { createContext, useState } from "react";

const defaultGameState = {
  // we need to fill the array with 25 objects
  red: {
    s_deck: [],
    b_deck: [],
    drawnCard: null,
  },

  // we need to fill the array with 25 objects
  blue: {
    s_deck: [],
    b_deck: [],
    drawnCard: null,
  },

  /**
   * @type {"choose teams" | "new game" | "cards drawn" | "comparison" | "editing traits" | "end game"}
   */
  state: "choose teams",

  /**
   * @type {null | 'red' | 'blue'}
   */
  team: null,
  canEdit: true,
};

/**
 * @returns {
 * name:String,
 * picture:String, // should be the url with random images
 * hitpoint:Number
 * }
 */

function createCreature() {
  const getName = async () => {
    const data = await fetch("https://randomuser.me/api/");
    const response = await data.json();
    return response.results[0].name.first;
  };

  const getPicture = async () => {
    const data = await fetch("https://randomuser.me/api/");
    const response = await data.json();
    return response.results[0].picture.medium;
  };

  const getHitPoint = () => {
    return Math.floor(Math.random() * 100);
  };

  const name = getName();
  const picture = getPicture();
  const hitPoint = getHitPoint();
  return new Promise((res, rej) => {
    Promise.all([name, picture]).then((fullfilled) => {
      res({
        name: fullfilled[0],
        picture: fullfilled[1],
        hitPoint,
      });
    });
  });
}

export const Context = createContext({
  gameState: defaultGameState,
  determineWinner() {},
  nextGameState() {},
});
export default function Provider({ children }) {
  const [gameState, setGameState] = useState(defaultGameState);

  const drawCards = () => {
    setGameState((gameState) => {
      const newGameState = { ...gameState };

      const redSdeck = [...gameState.red.s_deck];

      newGameState.red = {
        ...gameState.red,
        drawnCard: redSdeck.splice(
          Math.floor(Math.random() * redSdeck.length),
          1
        )[0],
        s_deck: redSdeck,
      };

      //  makes a copy of blue sDeck
      const blueSdeck = [...gameState.blue.s_deck];

      newGameState.blue = {
        // makes a copy of the state for the blue player
        ...gameState.blue,

        // pick a random card out of the sDeck and assign it to the drawn card
        drawnCard: blueSdeck.splice(
          Math.floor(Math.random() * blueSdeck.length),
          1
        )[0],

        // overwrites the sDeck with a new copy
        s_deck: blueSdeck,
      };
      return newGameState;
    });
  };

  //create the deck,means 25 objects with names, pictures and hit point
  const createDecks = async () => {
    const creatures = [];
    const namesImages = (
      await (await fetch("https://randomuser.me/api/?results=50")).json()
    ).results;

    for (let i = 0; i < 50; i++) {
      const randomUser = namesImages.splice(
        Math.floor(Math.random() * namesImages.length),
        1
      )[0];
      creatures.push({
        name: randomUser.name.first,
        picture: randomUser.picture.medium,
        hitPoint: Math.floor(Math.random() * 100),
      });
    }

    setGameState({
      ...gameState,
      red: { ...gameState.red, s_deck: creatures.slice(0, 25) },
      blue: { ...gameState.blue, s_deck: creatures.slice(-25) },
    });
  };

  const determineWinner = () => {
    const team = gameState.team;
    const opponent = team === "red" ? "blue" : "red";
    if (
      gameState[team].drawnCard.hitPoint >
      gameState[opponent].drawnCard.hitPoint
    ) {
      return team;
    } else {
      return opponent;
    }
  };

  // check if the blue card is > red card(you win,take red card to blue deck), else (you lose the card,and your blue card goes to red deck)
  const collectCards = (blue, red) => {
    const winner = determineWinner();
    const looser = winner === "red" ? "blue" : "red";

    setGameState((gameState) => ({
      ...gameState,
      [winner]: {
        ...gameState[winner],
        b_deck: [
          ...gameState[winner].b_deck,
          gameState[winner].drawnCard,
          gameState[looser].drawnCard,
        ],
        drawnCard: null,
      },
      [looser]: { ...gameState[looser], drawnCard: null },
    }));
  };

  const nextGameState = async (
    { choosenTeam, wantsEditing } = {
      choosenTeam: undefined,
      wantsEditing: false,
    }
  ) => {
    switch (gameState.state) {
      case "choose teams":
        await createDecks();
        setGameState((gameState) => ({
          ...gameState,
          team: choosenTeam,
          state: "new game",
        }));

        break;
      case "new game":
        drawCards();
        setGameState((gameState) => ({ ...gameState, state: "cards drawn" }));
        break;

      case "cards drawn":
        if (wantsEditing && gameState.canEdit) {
          setGameState((gameState) => ({
            ...gameState,
            state: "editing traits",
          }));
        } else {
          setGameState((gameState) => ({ ...gameState, state: "comparison" }));
        }
        break;

      case "editing traits":
        setGameState((gameState) => ({ ...gameState, state: "comparison" }));
        break;

      case "comparison":
        collectCards();

        setGameState((gameState) => {
          if (gameState.red.s_deck.length === 0) {
            return { ...gameState, state: "end game" };
          } else {
            drawCards();
            if (gameState.canEdit) {
              return {
                ...gameState,
                state: "cards drawn",
              };
            } else {
              return {
                ...gameState,
                state: "comparison",
              };
            }
          }
        });

        break;

      case "end game":
        setGameState(defaultGameState);
        break;

      default:
        break;
    }
  };

  return (
    <Context.Provider value={{ gameState, nextGameState, determineWinner }}>
      {children}
    </Context.Provider>
  );
}
