const express = require('express');
const users = require('./routes/api/users');
const kids = require('./routes/api/kids');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');
const nodemailer = require("nodemailer");
const lodash = require("lodash");
const app = express();

//Body parser configuration
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//First route
//app.get('/', (req, res) => res.send('Hello'));

//Use routes
app.use('/api/users', users);
app.use('/api/kids', kids);
const port = 7200;
app.listen(port, () => console.log(`Server running on port ${port}`));

//Db config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDb Connected'))
  .catch((err) => console.log(err));

app.use(passport.initialize());

require('./config/passport')(passport);

