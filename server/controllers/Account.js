const { Account } = require('../models');

/**
 * Renders the login page.
 * @param {Express.Request} req The client request.
 * @param {Express.Request} res The server response.
 */
function loginPage(req, res) {
  return res.render('login');
}

/**
 * Renders the signup page.
 * @param {Express.Request} req The client request.
 * @param {Express.Request} res The server response.
 */
function signupPage(req, res) {
  return res.render('signup');
}

/**
 * Redirects to /
 * @param {Express.Request} req The client request.
 * @param {Express.Request} res The server response.
 */
function logout(req, res) {
  return res.redirect('/');
}

/**
 *
 * @param {Express.Request} req The client request.
 * @param {Express.Request} res The server response.
 */
function login(req, res) {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    return res.json({ redirect: '/maker' });
  });
}

/**
 * Saves a new account to the database.
 * @param {Express.Request} req The client request.
 * @param {Express.Request} res The server response.
 */
async function signup(req, res) {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    return res.json({ redirect: '/maker' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
}

module.exports = {
  loginPage,
  signupPage,
  login,
  signup,
  logout,
};
