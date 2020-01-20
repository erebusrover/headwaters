import React, { useState, useEffect } from 'react';
import Image from 'react-bootstrap/Image';
import axios from 'axios';

const Home = () => {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getQuotes() {
      let quotesArray;
      await axios
        .get('/api/quotes')
        .then(res => {
          quotesArray = res.data;
        })
        .catch(err => console.error(err));
      return quotesArray;
    }

    getQuotes().then(quoteData => {
      setQuotes(quoteData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="home">
      <div className="home-content">
        {/* <strong>&quot;{quotes[Math.floor(Math.random() * quotes.length)].content}&quot;<br />{quotes[0].author}</strong> */}
      </div>
    </div>
  );
};

export default Home;
