const { request, response } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');


const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.ca'
};

app.get('/urls', (request, response) => {
  const templateVars = { urls: urlDatabase };
  response.render('urls_index', templateVars);
});



//******THE FOLLOWING IS FOR TESTING PURPOSES:



//landing page
app.get('/', (request, response) => {
  response.send('Hello!');
});

//hello greeting page
// app.get('/hello', (request, response) => {
//   const templateVars = { greeting: 'Hello World!'};
//   response.render('hello_world', templateVars);
// });

// //Our urlDatabase object in JSON format
// app.get('/urls.json', (request, response) => {
//   response.json(urlDatabase);
// });

// app.get('/set', (request, response) => {
//   const a = 1;
//   response.send(`a = ${a}`);
// });

// app.get('/fetch', (request, response) => {
//   response.send(`a = ${a}`);
// });

//***** END OF TEST CODE

app.listen(PORT, () => {
  console.log(`Your test app is listening on port ${PORT} ...`);
});