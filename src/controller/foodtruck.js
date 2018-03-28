import mongoose from 'mongoose';
import {Router} from 'express';
import Foodtruck from '../models/foodtruck.js';
import Review from '../models/review.js';

import {authenticate} from '../middleware/authmiddleware';

export default({config, db}) => {
  let api = Router();

  //CRUD Create, Read, Update, Delete

  //CREATE
  //v1/foodtruck/add
  api.post('/add', (req, res) => {
    let newFoodtruck = new Foodtruck();
    newFoodtruck.name = req.body.name;
    newFoodtruck.foodtype = req.body.foodtype;
    newFoodtruck.avgcost = req.body.avgcost;
    newFoodtruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodtruck.save(err => {
      if (err) {
        res.send(err);
      } else {
        res.json({message: "Foodtruck saved successfully"});
      }
    });
  });

  //READ
  ///v1/foodtruck/
  api.get('/', (req, res) => {
    Foodtruck.find({}, (err, foodtrucks) => {
      if (err) {
        res.send(err);
      } else {
        res.json(foodtrucks);
      }
    });
  });

  //v1/foodtruck/:id - find 1
  api.get('/:id', (req, res) => {
    Foodtruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      } else {
        res.json(foodtruck);
      }
    });
  });

  //UPDATE
  //   /v1/foodtruck/:id
  api.put('/:id', (req, res) => {
    Foodtruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;

      foodtruck.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({message: "Foodtruck info updated"})
      });
    });
  });

  //Delete - /v1/foodtruck/:id
  api.delete('/:id', (req, res) => {
    Foodtruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json({message: "Foodtruck successfull removed"});
    });
  });

  //add review for a specific food truck id
  //'/v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', (req, res) => {
    Foodtruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      //create a new review object from our review model
      let newReview = new Review();

      //set properties of review object to properties from req body
      newReview.title = req.body.title;
      newReview.text = req.body.text;

      //the foodtruck._id is what is returned in the
      //second parameter of the function above
      newReview.foodtruck = foodtruck._id;

      //save new review in database
      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        //send review to reviews array in foodtruck model
        foodtruck.reviews.push(newReview);
        //save it again
        foodtruck.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({message: "Foodtruck review saved"});
        });
      });
    });
  });

  //return all reviews for a specific food trruck
  // /v1/reviews/findall/:id

  api.get('/reviews/findall/:id', (req, res)=>{
    Review.find({foodtruck: req.params.id}, (err, reviews)=>{
      if(err){
        res.send(err);
      }
      res.json(reviews);
    })
  })
  return api;
}
