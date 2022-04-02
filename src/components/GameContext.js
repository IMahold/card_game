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
   * @type "choose teams" | "new game" | "cards drawn" | "comparison" | "editing traits" | "end game"
   */
  state: "choose teams",

  // function to drawn cards


  //create the deck,means 25 objects with names, pictures and hit point
  createDecks: async function () {
    for (let i = 0; i < 25; i++) {
      this.red.s_deck.push(await createCreature());
      this.blue.s_deck.push(await createCreature());
    }
  },

  // function that randoms the cards
  randomArray: function () {},

  // check if the blue card is > red card(you win,take red card to blue deck), else (you lose the card,and your blue card goes to red deck)
  checkScore: function (blue, red) {},
};

/**
 * @returns {
 * name:String,
 * picture:String, // should be the url with random images
 * hitpoint:Number
 * }
 */

async function createCreature() {
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

  const name = await getName();
  const picture = await getPicture();
  const hitPoint = getHitPoint();
  return { name, picture, hitPoint };
}





export const Context = createContext({
  gameState:defaultGameState,
  setGameState (){}
})
export default function Provider({children}){

  const [gameState, setGameState] = useState(defaultGameState)

  //  const drawCards = ()=> {

  //   const newGameState = {...gameState}
     
  //   gameState.red.drawnCard = gameState.red.s_deck.splice(
  //     Math.floor(Math.random() * gameState.red.s_deck.length),
  //     1
  //   )[0];




  //   gameState.blue.drawnCard = gameState.blue.s_deck.splice(
  //     Math.floor(Math.random() * gameState.blue.s_deck.length),
  //     1
  //   )[0];
  // },





  return <Context.Provider value={{gameState,setGameState}}>
    {children}
  </Context.Provider>
}
