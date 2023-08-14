import React, {useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(function loadDeckFromAPI() {
        async function getData() {
            let d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeck(d.data);
        }
        getData();
    }, [setDeck]);

    async function draw() {
        try {
            const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);
            if (drawRes.data.remaining === 0) throw new Error("No cards remaining!");
            const card = drawRes.data.cards[0];
            setDrawn(d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                },
            ]);
    } catch (err) {
        alert(err);
    }
}

    async function shuffle() {
        setIsShuffling(true);
        try {
            const shuffleRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
            setDrawn([]);
        } catch (err) {
            alert(err);
        }
        setIsShuffling(false);
    }

  function renderDrawBtnIfOk() {
    if (!deck) return null;

    return (
      <button
        className="Deck-gimme"
        onClick={draw}
        disabled={isShuffling}>
        DRAW
      </button>
    );
  }

  function renderShuffleBtnIfOk() {
    if (!deck) return null;
    return (
      <button
        className="Deck-gimme"
        onClick={startShuffling}
        disabled={isShuffling}>
        SHUFFLE DECK
      </button>
    );
  }

  return (
    <main className="Deck">

      {renderDrawBtnIfOk()}
      {renderShuffleBtnIfOk()}

      <div className="Deck-cardarea">{
        drawn.map(c => (
          <Card key={c.id} name={c.name} image={c.image} />
        ))}
      </div>

    </main>
  );
}

export default Deck;

