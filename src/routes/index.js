import express from 'express';
import config from '../config/index';
import middleware from '../middleware';
import initializeDb from '../db';
import restaurant from '../controller/restaurant';

let router = express();

//connect to database
//initializeDb is just the name given to the callback funtion specified in db.js
initializeDb(db =>{
  //we create a connection to our database and then within callback, have router.use
  //use db as database connection for routes

  //we could add internal middleware
  router.use(middleware({config,db}));
  //specify routes here
  router.use('/restaurant', restaurant({config, db}));
})

export default router;
