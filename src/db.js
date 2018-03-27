import mongoose from 'mongoose';
import config from './config';

export default callback => {
  let db = mongoose.connect(config.mongoUrl)
  //we are passing db back to callback function
  callback(db);
}
