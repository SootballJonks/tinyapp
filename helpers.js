//Default URL database
const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', owner: "Jonks" },
  '9sm5xK': { longURL: 'http://www.google.ca', owner: "Jonks" }
};

//Default user database
const userDatabase = {
  'Jonks': {
    'id': 'Jonks',
    'email': 'jonks@email.com',
    'password': 'testing'
  }
};




//Extra functions to aid server features


//generate a 6-character long string for Smol-Link addresses
const generateRandomString = () => {
  return Math.random().toString(16).substr(2, 6);
};

//check Email to see if it exists within the database
const checkEmail = (email) => {
  for (let user in userDatabase) {
    if (email === userDatabase[user].email) {
      return user;
    }
  }
  return false;
};

//loop through urlDatabase to display longURLs
const urlPairs = (owner) => {
  let urlPair = {};
  for (let [key, value] of Object.entries(urlDatabase)) {
   if (owner === value.owner) {
     urlPair[key] = value.longURL;
   }
  }
  console.log(urlPair)
  return urlPair;
}




module.exports = {
  urlDatabase,
  userDatabase,
  generateRandomString,
  checkEmail,
  urlPairs,
}