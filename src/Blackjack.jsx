import React, { useState, useEffect } from "react";
import "./blackjack.css";

// Add split option?


function Blackjack() {
  useEffect(() => {
    document.title = "Blackjack";
  }, []);
  const cards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  // const cards = ["A", "A", "A", 9, 10, "J", "Q", "K"]; //rigged bro
  // const cards = [8, 8, "A", "A", "A", "J", "Q", "K"]; //rigged too
  // const cards = ["A", 2, 3, 4, 10, "A"]; //rigged again
 // const cards = ['K','Q','J','A'] //this is getting ridicilous
  const betSizes = [5, 10, 25, 100, 1000];

  let suits = ["_of_hearts", "_of_diamonds", "_of_spades", "_of_clubs"];
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [playerCards, setPlayerCards] = useState([]);
  const [playerCardsValue, setPlayerCardsValue] = useState([]);
  const [dealerCardsValue, setDealerCardsValue] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);
  const [softCount, setsoftCount] = useState();
  const [hardCount, sethardCount] = useState();
  const [bet, setBet] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [gameOver, setGameOver] = useState(false);
  const [msg, setMsg] = useState("Please place your bet");

  const [game, setgame] = useState({
    isStarted: false,
    playerBJ: false,
    dealerBJ: false,
    dealerTurn: false,
    prevBet: 0,
  });

  const getCard = () => {
    return cards[Math.floor(Math.random() * cards.length)];
  };

  const getSuit = () => {
    return suits[Math.floor(Math.random() * 4)];
  };

  const drawCard = (p) => {
    const randomValue = getCard();
    const randomSuit = getSuit();
    const randomCard = randomValue + randomSuit;
    if (p === "P") {
      setPlayerCards((prev) => [...prev, randomCard]);
      setPlayerCardsValue((prev) => [...prev, randomValue]);
    } else if (p === "D") {
      if (dealerCount < 17) {
        setDealerCards((prev) => [...prev, randomCard]);
        setDealerCardsValue((prev) => [...prev, randomValue]);
      }
    }
  };

  const isAce = (p) => {
    let hand;
    if (p === "P") {
      hand = playerCardsValue;
    } else if (p === "D") {
      hand = dealerCardsValue;
    }
    if (hand.includes("A")) {
      return 10;
    } else {
      return 0;
    }
  };
  const countHandValue = (p) => {
    let hand;
    let deck;
    if (p === "P") {
      hand = playerCardsValue;
      deck = setPlayerCount;
    } else if (p === "D") {
      hand = dealerCardsValue;
      deck = setDealerCount;
    }

    let total = 0;
    for (let i = 0; i < hand.length; i++) {
      if (hand[i] === "J" || hand[i] === "Q" || hand[i] === "K") {
        total += 10;
      } else if (hand[i] === "A") {
        total += 1;
      } else {
        total += hand[i];
      }
    }

    let hard = total + isAce(p);
    console.log("hard: ", hard);
    console.log("total: ", total);
    if (p === "D") {
      setsoftCount(total);
      sethardCount(hard);
    }
    if (hard <= 21) {
      deck(() => deck(hard));
    } else {
      deck(() => deck(total));
    }

    console.log("dcount: ", dealerCount);
  };
  useEffect(() => {
    countHandValue("P");
  }, [playerCards]);
  useEffect(() => {
    setDealerCount(() => setDealerCount(0));
    console.log("eff dcount: ", dealerCount);
    countHandValue("D");
  }, [dealerCards]);

  const startGame = () => {
    if (bet > 4) {
      for (let i = 0; i < 2; i++) {
        drawCard("P");
      }
      drawCard("D");
      setMsg("");
      setBalance((b) => b - bet);
      setHandsPlayed((h) => h + 1);
      setgame((prev) => {
        return { ...prev, isStarted: true, prevBet: bet };
      });
    } else {
      setMsg("Minimal bet is $5");
    }
  };

  const newGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setDealerCardsValue([]);
    setPlayerCardsValue([]);
    setDealerCount(0);
    setPlayerCount(0);
    setMsg("Please place your bet");
    setgame((prev) => ({
      ...prev,
      isStarted: false,
      playerBJ: false,
      dealerBJ: false,
      dealerTurn: false,
    }));
    setBet(0);
    setGameOver(false);
  };

  const playerHit = () => {
    drawCard("P");
  };
  const playerStand = () => {
    setgame((prev) => {
      return {
        ...prev,
        dealerTurn: true,
      };
    });
  };
  const playerDouble = () => {
    if (balance >= bet) {
      drawCard("P");

      setgame((prev) => {
        return {
          ...prev,
          dealerTurn: true,
        };
      });
      setBet((b) => b * 2);
      setBalance(balance - bet);
    }
  };

  const dealerPlays = () => {
    if (dealerCount < 17) {
      drawCard("D");
    }
  };
  const setPrevBet = () => {
    setBet(game.prevBet);
  };
  const clearBet = () => {
    setBet(0);
  };
  const setBetSize = (a) => {
    if (bet + a > balance) {
      setBet(balance);
    } else setBet((b) => b + a);
  };
  const maxBet = () => {
    setBet(balance);
  };

  const getMoney = () => {
    setBalance(10000);
  };
  const editBet = (a) => {
    if (bet * a > balance) {
      setBet(balance);
    } else {
      if (bet === 0) {
        setBet(Math.floor(game.prevBet * a));
      } else {
        setBet((b) => Math.floor(b * a));
      }
    }
  };

  // DEALER DRAW CARD
  useEffect(() => {
    if (game.dealerTurn && dealerCount < 17) {
      setTimeout(dealerPlays, 700);
    } else if (dealerCount >= 17) {
      setGameOver(true);
    }
  }, [game.dealerTurn, hardCount, softCount]);

  //PLAYER AUTOPLAY
  useEffect(() => {
    if (playerCount === 21 && playerCards.length > 2) {
      setgame((prev) => ({ ...prev, dealerTurn: true }));
    } else if (playerCount >= 22) {
      setGameOver(true);
      setMsg("Dealer wins");
      setgame((prev) => ({ ...prev, dealerTurn: false }));
    }
  }, [playerCount]);

  //CHECK BLACKJACK
  useEffect(() => {
    if (
      playerCount === 21 &&
      playerCards.length === 2 &&
      (dealerCount === 10 || dealerCount === 11)
    ) {
      setgame((p) => ({
        ...p,
        playerBJ: true,
        dealerTurn: true,
      }));
    } else if (
      playerCount === 21 &&
      playerCards.length === 2 &&
      !(dealerCount === 10 || dealerCount === 11)
    ) {
      setgame((p) => ({
        ...p,
        playerBJ: true,
      }));
      setGameOver(true);
    }
  }, [playerCount]);
  //CHECK DEALER BLACKJACK
  useEffect(() => {
    if (dealerCount === 21 && dealerCards.length === 2) {
      setgame((p) => ({
        ...p,
        dealerBJ: true,
      }));
    }
  }, [dealerCount]);

  //CHECK FOR WINNER AND HANDLE PAYOUTS
  useEffect(() => {
    if (gameOver) {
      if (game.playerBJ && !game.dealerBJ) {
        setBalance(balance + bet * 2.5);
        setMsg("You win with Blackjack!");
      } else if (game.playerBJ && game.dealerBJ) {
        setBalance(balance + bet);
        setMsg("It's a push");
      } else if (dealerCount >= 22 && !game.playerBJ) {
        setBalance(balance + bet * 2);
        setMsg(`Dealer busted with ${dealerCount}!`);
      } else if (
        playerCount === dealerCount &&
        playerCount < 22 &&
        !game.playerBJ &&
        !game.dealerBJ
      ) {
        setBalance(balance + bet);
        setMsg("It's a push");
      } else if (
        playerCount > dealerCount &&
        playerCount < 22 &&
        !game.playerBJ
      ) {
        setBalance(balance + bet * 2);
        setMsg(`You win!`);
      } else if (dealerCount > playerCount && dealerCount < 22) {
        setMsg("Dealer wins");
      }
    }
  }, [gameOver]);

  return (
    <>
      <div className="bjcontainer">
        <div className="player">
          <div className="cards">
            {playerCards.length === 0 && (
              <div className="cards">
                <img className="suit"alt="player card" src="/Cards/Card_back_02.svg"></img>
                <img className="suit"alt="player card" src="/Cards/Card_back_02.svg"></img>
              </div>
            )}
            {playerCards.map((items, index) => {
              return (
                <img key={index} src={`/Cards/${items}.svg`} className="suit" alt={items} />
              );
            })}
          </div>

          {playerCount > 0 && [
            game.playerBJ ? (
              <button className="count">BJ</button>
            ) : (
              <button className="count">{playerCount}</button>
            ),
          ]}
        </div>
        <div className="dealer">
          <div className="cards">
            {playerCards.length === 0 && (
              <div className="cards">
                <img className="suit" alt="dealer card" src="/Cards/Card_back_02.svg"></img>
              </div>
            )}
            {dealerCards.map((items, index) => {
              return (
                <img key={index} src={`/Cards/${items}.svg`} className="suit" />
              );
            })}
          </div>
          {playerCount > 0 && [
            game.dealerBJ ? (
              <button className="count">BJ</button>
            ) : (
              <>
                <button className="count">{dealerCount}</button>
              </>
            ),
          ]}
        </div>

        <div className="bottom">
          <div className="betsize">
            <h1>Bet: {bet}</h1>
          </div>
          {game.isStarted ? (
            (playerCount <= 21) &
            (game.dealerTurn === false) &
            !game.playerBJ ? (
              <div className="buttons">
                <div className="bjcontrols">
                  <button onClick={playerHit}>Hit</button>
                  <button onClick={playerStand}>Stand</button>
                  {playerCards.length === 2 && balance >= bet ? (
                    <button onClick={playerDouble}>Double</button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )
          ) : (
            <>
              <div className="buttons">
                <div className="btn-cont">
                  <button className="editbet" onClick={maxBet}>
                    Max
                  </button>
                  <button className="editbet" onClick={() => editBet(2)}>
                    2x
                  </button>
                  <button className="editbet" onClick={() => editBet(0.5)}>
                    1/2
                  </button>

                  <button className="repeatbtn" onClick={setPrevBet}>
                    ↻
                  </button>
                  <button className="crossbtn" onClick={clearBet}>
                    ❌
                  </button>
                </div>
                <div className="btn-cont">
                  {betSizes.map((item, index) => (
                    <button
                      className={`chips chip${item}`}
                      key={index}
                      onClick={() => setBetSize(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <button
                  className="gamestart"
                  id="gameStart"
                  onClick={startGame}
                >
                  DEAL
                </button>
              </div>
            </>
          )}
          {gameOver && (
            <div className="buttons">
              <button className="newgame" onClick={newGame}>
                New game
              </button>
            </div>
          )}
          <div className="balance">
            {!game.isStarted ? (
              [
                balance > 0 ? (
                  <h1>Balance: ${balance}</h1>
                ) : (
                  <button onClick={getMoney}>Get money</button>
                ),
              ]
            ) : (
              <h1>Balance: ${balance}</h1>
            )}
          </div>
          <div className="msg">
            <h1>
              <center>{msg}</center>
            </h1>
          </div>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{__html: "<!-- Icon made by Freepik from www.flaticon.com -->"}} />
   
    </>
  );
}

export default Blackjack;
