
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 4000;
const app = express();
const token = 'esfeyJ1c2VySWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NUIhkufemQifQ';

let nextId = 3;

let cards = [
      {
        userid: "user",
        id: 1,
        title: "An Item",
        category: "Misc",
        description: "This is my first item",
        link: "url will go here",
        completed: false,
        created: new Date(),
        updated: null
    },
    {
        userid: "user",
        id: 2,
        title: "Another Item",
        category: "Misc",
        description: "This is my second item",
        link: "url will go here",
        completed: false,
        created: new Date(),
        updated: null
    }
  ];



app.use(bodyParser.json());

app.use(cors());

function authenticator(req, res, next) {
  const { authorization } = req.headers;
  if (authorization === token) {
    next();
  } else {
    res.status(403).json({ error: 'User must be logged in to do that.' });
  }
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user' && password === 'password') {
    req.loggedIn = true;
    res.status(200).json({
      payload: token
    });
  } else {
    res
      .status(403)
      .json({ error: 'Username or Password incorrect. Please see Readme' });
  }
});

app.get('/api/cards', authenticator, (req, res) => {
  setTimeout(() => {
    res.send(cards);
  }, 1000);
});

app.get('/api/cards/:id', authenticator, (req, res) => {
  const card = cards.find(c => c.id == req.params.id);

  if (card) {
    res.status(200).json(card);
  } else {
    res.status(404).send({ msg: 'Card not found' });
  }
});

app.post('/api/cards', authenticator, (req, res) => {
  const card = { id: getNextId(), ...req.body };

  cards = [...cards, card];

  res.send(cards);
});

app.put('/api/cards/:id', authenticator, (req, res) => {
  const { id } = req.params;

  const cardIndex = cards.findIndex(c => c.id == id);

  if (cardIndex > -1) {
    const card = { ...cards[cardIndex], ...req.body };

    cards = [
      ...cards.slice(0, cardIndex),
      card,
      ...cards.slice(cardIndex + 1)
    ];
    res.send(cards);
  } else {
    res.status(404).send({ msg: 'Card not found' });
  }
});

app.delete('/api/cards/:id', authenticator, (req, res) => {
  const { id } = req.params;

  cards = cards.filter(c => c.id !== Number(id));

  res.send(cards);
});

function getNextId() {
  return nextId + 1;
}

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
