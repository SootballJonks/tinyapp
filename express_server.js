const { request, response } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// **** These should be moved somewhere later... **** 
//Default database
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.ca'
};

function generateRandomString() {
  return Math.random().toString(16).substr(2, 6);
}

// ****


//landing page
app.get('/', (request, response) => {
  response.redirect('/urls');
});

//URL page - lists default database
app.get('/urls', (request, response) => {
  const templateVars = { urls: urlDatabase };
  response.render('urls_index', templateVars);
});

//page for adding URLs to database
app.get('/urls/new', (request, response) => {
  response.render('urls_new');
});

//**** POST REQUESTS:
//add new URL to database
app.post('/urls', (request, response) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = request.body.longURL;
  console.log(urlDatabase);
  response.redirect(`/urls/${shortURL}`);
});

//delete URLs from database
app.post('/urls/:shortURL/delete', (request, response) => {
  delete urlDatabase[request.params.shortURL];
  console.log(urlDatabase);
  response.redirect('/urls');
});

//edit URLs from the database
app.post('/urls/:shortURL', (request, response) => {
  const redirURL = request.params.shortURL;
  response.redirect(`/urls/${redirURL}`);
});

//***** ROUTES

//urls route
app.get('/urls/:shortURL', (request, response) => {
  const templateVars = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL] };
  response.render('urls_show', templateVars);
});

//Shortened link route
app.get('/u/:shortURL', (request, response) => {
  const longUrl = urlDatabase[request.params.shortURL];
  response.redirect(longUrl);
});






//******THE FOLLOWING IS FOR TESTING PURPOSES:

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