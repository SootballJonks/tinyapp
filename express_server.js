const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.ca'
};

//landing page
app.get('/', (request, response) => {
  response.send('Hello!');
});

//Our urlDatabase object in JSON format
app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});





app.listen(PORT, () => {
  console.log(`Your test app is listening on port ${PORT} ...`);
});