const { request, response } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// **** These should probably be moved somewhere later... **** 
//Default URL database
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.ca'
};

//Default user database
const userDatabase = {
  'Jonks': {
    'id': 'Jonks',
    'email': 'jonks@email.com',
    'password': 'testing'
  }
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
  const templateVars = {  user_id: request.cookies.user_id, urls: urlDatabase };
  response.render('urls_index', templateVars);
});

//page for adding URLs to database
app.get('/urls/new', (request, response) => {
  const templateVars = { user_id: request.cookies.user_id }
  response.render('urls_new', templateVars);
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
  urlDatabase[redirURL] = request.body.longURL;
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

//logging in with username
app.post('/login', (request, response) => {
  const id = request.body.id;
  const password = request.body.password;

  console.log(userDatabase[id]);
  if (!userDatabase[id]) {
    response.status(400).send(`User does not exist!`);
  }
  if (id === userDatabase[id].id && password === userDatabase[id].password) {
    response.cookie('user_id', JSON.stringify(userDatabase[id]));
    response.redirect('/urls');
  } else if (id === userDatabase[id].id) {
    response.status(400).send(`Wrong password!`);
  }

});

//Logout (delete cookie)
app.post('/logout', (request, response) => {
  response.clearCookie('user_id');
  response.redirect('/urls');
});


//***** ROUTES:

//urls route
app.get('/urls/:shortURL', (request, response) => {
  const templateVars = { username: request.cookies.username, shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL] };
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