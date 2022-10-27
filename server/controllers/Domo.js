/**
 * Renders the app page.
 * @param {Express.Request} req The client request.
 * @param {Express.Request} res The server response.
 */
function makerPage(req, res) {
  res.render('app');
}

module.exports = {
  makerPage,
};
