const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { urlDatabase, userDatabase, generateRandomString, checkEmail, urlPairs, urlOwner } = require('./helpers');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


//********************* WEBSITE PAGES: *********************

//landing page
app.get('/', (request, response) => {
  response.redirect('/urls');
});

//URL page - lists default database
app.get('/urls', (request, response) => {
  if (request.cookies.user_id) {
    const user = JSON.parse(request.cookies.user_id);
    const templateVars = {  user_id: request.cookies.user_id, urls: urlPairs(user.id) };
    response.render('urls_index', templateVars);
  } else {
    response.redirect('/login');
  }
});

//page for adding URLs to database
app.get('/urls/new', (request, response) => {
  const templateVars = { user_id: request.cookies.user_id }
  if (request.cookies.user_id){
    response.render('urls_new', templateVars);
  } else {
    response.redirect('/login');
  }
});

//registration page
app.get('/register', (request, response) => {
  const templateVars = { user_id: request.cookies.user_id }
  response.render('register', templateVars);
});

//login page
app.get('/login', (request, response) => {
  const templateVars = { user_id: request.cookies.user_id }
  response.render('login', templateVars);
});

//******************* POST REQUESTS: **********************

//add new URL to database
app.post('/urls', (request, response) => {
  let shortURL = generateRandomString();
  const user = JSON.parse(request.cookies.user_id);
  urlDatabase[shortURL] = { longURL: request.body.longURL, owner: user.id };
  console.log(urlDatabase);
  response.redirect(`/urls/${shortURL}`);
});

//delete URLs from database
app.post('/urls/:shortURL/delete', (request, response) => {

  const user = JSON.parse(request.cookies.user_id);
  const shortURL = request.params.shortURL;

  if (request.cookies.user_id) {
    const owner = urlOwner(user.id);
    console.log(owner[shortURL])
    if (user.id === owner[shortURL]) {
      delete urlDatabase[request.params.shortURL];
      console.log(urlDatabase);
      response.redirect('/urls');
    } else {
      response.status(404).send(`Uh oh! That Smol-Link does not exist!`);
    };
  } else {
    response.redirect('/urls')
  }
});

//edit URLs from the database
app.post('/urls/:shortURL', (request, response) => {
  const redirURL = request.params.shortURL;
  const user = JSON.parse(request.cookies.user_id);
  urlDatabase[redirURL] = { longURL: request.body.longURL, owner: user.id };
  response.redirect(`/urls/${redirURL}`);
});

//register new account
app.post('/register', (request, response) => {
  console.log(request.body)
  if (request.body.id === '' || request.body.email === '' || request.body.password === '') {
    response.status(400).send(`Missing information in the required fields!`);
  }

  const id = request.body.id;
  const email = request.body.email;
  const password = request.body.password;

  if (userDatabase[id]) {
    response.status(400).send(`Username already exists for us! Please try a different one!`);
  } else {
    userDatabase[id] = { id: id, email: email, password: password };
    console.log(userDatabase);
    const cookieUser = JSON.stringify(request.body);
    response.cookie('user_id', cookieUser);
    response.redirect('/urls')
  };
});

//logging in with email
app.post('/login', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const user = checkEmail(email);
  
  if (user) {
    if (email === userDatabase[user].email && password === userDatabase[user].password) {
      response.cookie('user_id', JSON.stringify(userDatabase[user]));
      response.redirect('/urls');
    } else if (email === userDatabase[user].email) {
      response.status(400).send(`Wrong password!`);
    } 
  } else {
    response.status(403).send(`User does not exist!`);
  };
});

//Logout (delete cookie)
app.post('/logout', (request, response) => {
  response.clearCookie('user_id');
  response.redirect('/urls');
});


//********************* ROUTES: **********************

//urls route
app.get('/urls/:shortURL', (request, response) => {
  const user = JSON.parse(request.cookies.user_id);
  const urls = urlPairs(user.id);
  const shortURL = request.params.shortURL;

  if (request.cookies.user_id) {
    const owner = urlOwner(user.id);
    console.log(owner[shortURL])
    if (user.id === owner[shortURL]) {
      const templateVars = {  user_id: request.cookies.user_id, shortURL: shortURL, longURL: urls[shortURL] };
      response.render('urls_show', templateVars);
    } else {
      response.status(404).send(`Uh oh! That Smol-Link does not exist!`);
    };
  } else {
    response.redirect('/urls')
  }

});

//Shortened link route
app.get('/u/:shortURL', (request, response) => {
  const longUrl = urlDatabase[request.params.shortURL].longURL;
  response.redirect(longUrl);
});



app.listen(PORT, () => {
  console.log(`Your test app is listening on port ${PORT} ...`);
});