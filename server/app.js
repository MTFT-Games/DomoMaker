// #region Requires
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandleBars = require('express-handlebars');
const helmet = require('helmet');

const router = require('./router.js');
// #endregion

// #region Get env configs
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';
// #endregion

mongoose.connect(dbURI, (err) => {
  if (err) {
    console.error('[FATAL ERROR]: Could not connect to database');
    throw err;
  }
});

// #region Express setup
const app = express();

// Statically serve the hosted directory as the assets route and set the favicon
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));

// Enable helper modules
app.use(helmet()); // Security helper
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Setup handlebars
app.engine('handlebars', expressHandleBars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
// #endregion

router(app);

app.listen(port, (err) => {
  if (err) {
    console.error(`[FATAL ERROR]: Could not listen on port ${port}`);
    throw err;
  }
  console.log(`[SUCCESS]: Listening on port ${port}`);
});
