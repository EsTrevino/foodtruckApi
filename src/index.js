//imports--------------------------------
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import config from './config';
import routes from './routes';
const LocalStrategy = require('passport-local').Strategy;

//create an instance of express
let app = express();
app.server = http.createServer(app);
//----------------------------------------

//middleware
app.use(bodyParser.json({
  limit: config.bodyLimit,
}));

//passport config
app.use(passport.initialize());
let Account = require('./models/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//api routes v1 ----------------------------------------
//anything that hits the /v1 path is going to be sent to routes
app.use('/v1', routes);

app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);

export default app;
