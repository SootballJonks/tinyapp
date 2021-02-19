const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { urlDatabase, userDatabase, generateRandomString, checkEmail, urlPairs, urlOwner } = require('./helpers');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['Hackerman', 'is', 'the', 'most', 'powerful', 'hacker', 'of', 'all', 'time']
}));



//********************* WEBSITE PAGES: *********************

//landing page
app.get('/', (request, response) => {
  response.redirect('/urls');
});

//URL page - lists default database
app.get('/urls', (request, response) => {
  if (!request.session.user_id) {
    response.redirect('/login');
  }
  const user = JSON.parse(request.session.user_id);
  const templateVars = {  user_id: request.session.user_id, urls: urlPairs(user.id) };
  response.render('urls_index', templateVars);
});

//page for adding URLs to database
app.get('/urls/new', (request, response) => {
  const templateVars = { user_id: request.session.user_id };
  if (!request.session.user_id) {
    response.redirect('/login');
  }
  response.render('urls_new', templateVars);
});

//registration page
app.get('/register', (request, response) => {
  const templateVars = { user_id: request.session.user_id };
  response.render('register', templateVars);
});

//login page
app.get('/login', (request, response) => {
  const templateVars = { user_id: request.session.user_id };
  response.render('login', templateVars);
});

//404 custom page
app.get('/404', (request, response) => {
  const templateVars = { user_id: request.session.user_id };
  response.render('404', templateVars);
});

//******************* POST REQUESTS: **********************

//add new URL to database
app.post('/urls', (request, response) => {
  let shortURL = generateRandomString();
  const user = JSON.parse(request.session.user_id);
  urlDatabase[shortURL] = { longURL: request.body.longURL, owner: user.id };
  response.redirect(`/urls/${shortURL}`);
});

//delete URLs from database
app.post('/urls/:shortURL/delete', (request, response) => {

  const user = JSON.parse(request.session.user_id);
  const shortURL = request.params.shortURL;

  if (!request.session.user_id) {
    response.redirect('/urls');
  }
  const owner = urlOwner(user.id);
  if (user.id !== owner[shortURL]) {
    response.status(404).redirect(`/404`);
  }
  delete urlDatabase[request.params.shortURL];
  response.redirect('/urls');
});

//edit URLs from the database
app.post('/urls/:shortURL', (request, response) => {
  const redirURL = request.params.shortURL;
  const user = JSON.parse(request.session.user_id);
  urlDatabase[redirURL] = { longURL: request.body.longURL, owner: user.id };
  response.redirect(`/urls/${redirURL}`);
});

//register new account
app.post('/register', (request, response) => {
  const id = request.body.id;
  const email = request.body.email;
  const password = request.body.password;
  const eCheck = checkEmail(email);

  if (request.body.id === '' || request.body.email === '' || request.body.password === '') {
    response.status(400).send(`Missing information in the required fields!`);
  } else if (userDatabase[id] || eCheck) {
    response.status(400).send(`The username or email that you've provided already exists for us! Please try a different one!`);
  } else {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        userDatabase[id] = { id: id, email: email, password: hash };
        const cookieUser = JSON.stringify(request.body);
        request.session.user_id = cookieUser;
        response.redirect('/urls');
      });
    });
  }
});

//logging in with email
app.post('/login', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const user = checkEmail(email);
  
  if (!user) {
    response.status(403).send(`User does not exist!`);
  }
  bcrypt.compare(password, userDatabase[user].password, (err, result) => {
    if (email === userDatabase[user].email && result) {
      request.session.user_id = JSON.stringify(userDatabase[user]);
      response.redirect('/urls');
    } else if (email === userDatabase[user].email) {
      response.status(400).send(`Wrong password!`);
    }
  });
});

//Logout (delete cookie)
app.post('/logout', (request, response) => {
  delete request.session.user_id;
  response.redirect('/urls');
});


//********************* ROUTES: **********************

//urls route
app.get('/urls/:shortURL', (request, response) => {
  const user = JSON.parse(request.session.user_id);
  const urls = urlPairs(user.id);
  const shortURL = request.params.shortURL;

  if (!request.session.user_id) {
    response.redirect('/urls');
  }
  const owner = urlOwner(user.id);
  if (user.id !== owner[shortURL]) {
    response.status(404).redirect('/404');
  }
  const templateVars = {  user_id: request.session.user_id, shortURL: shortURL, longURL: urls[shortURL] };
  response.render('urls_show', templateVars);
});

//Shortened link route
app.get('/u/:shortURL', (request, response) => {
  const longUrl = urlDatabase[request.params.shortURL].longURL;
  response.redirect(longUrl);
});



app.listen(PORT, () => {
  console.log(`Your test app is listening on port ${PORT} ...`);
});