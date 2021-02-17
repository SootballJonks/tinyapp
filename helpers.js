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




//Extra functions to aid server features


//generate a 6-character long string for Smol-Link addresses
const generateRandomString = () => {
  return Math.random().toString(16).substr(2, 6);
};

const checkEmail = (email) => {
  for (let user in userDatabase) {
    if (email === userDatabase[user].email) {
      return user;
    }
  }
  return false;
};




module.exports = {
  urlDatabase,
  userDatabase,
  generateRandomString,
  checkEmail,

}