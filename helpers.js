//Default URL database
const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', owner: "Jonks" },
  '9sm5xK': { longURL: 'http://www.google.ca', owner: "Jonks" },
  'google': { longURL: 'https://www.google.ca/search?sxsrf=ALeKk03CIJ3bye6PIjKZipJ8vDsQD5xZXg%3A1613687578543&source=hp&ei=GusuYNa7HsSU-gSO95q4AQ&iflsig=AINFCbYAAAAAYC75KihJac6zo-cBe2YH-jVjbHkPbRG5&q=google+in+1998&oq=google+in+1998&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAELEDMgIIADICCAAyAggAMgIIADICCAAyAggAMgIIADIFCAAQywEyBQgAEIYDOggIABCxAxCDAToLCAAQsQMQgwEQyQM6BQgAEJIDOg0IABCxAxCDARCxAxAKOgoIABCxAxCDARAKOgQIABAKOg0IABCxAxCDARDJAxAKOgcIABCxAxAKUKYEWMAjYKYmaAJwAHgAgAFjiAGDCJIBAjE2mAEAoAEBqgEHZ3dzLXdpeg&sclient=gws-wiz&ved=0ahUKEwjWsJTXvvTuAhVEip4KHY67BhcQ4dUDCAk&uact=5', owner: "Jonks" }
};

//Default user database
const userDatabase = {
  'Jonks': {
    'id': 'Jonks',
    'email': 'jonks@email.com',
    'password': '$2b$10$OHnnIjmwLCdxBiSrt1WGROXh4yUwfYqkGNIJc5bAhD0Zl0Ofp.OV6'
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
  return urlPair;
};

//loop through urlDatabase to get owner of links!
const urlOwner = (owner) => {
  let urlOwner = {};
  for (let [key, value] of Object.entries(urlDatabase)) {
    if (owner === value.owner) {
      urlOwner[key] = value.owner;
    }
  }
  console.log("loop owners:", urlOwner);
  return urlOwner;
};




module.exports = {
  urlDatabase,
  userDatabase,
  generateRandomString,
  checkEmail,
  urlPairs,
  urlOwner,
};