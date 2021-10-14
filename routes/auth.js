const express = require('express');
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/registerUser", async (req, res) => {
  try {
    console.log("in try block");

    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      endorser: req.body.endorser,
    });
    //save user and respond
    const user = await newUser.save();
    res.render("login");
    // res.status(200).json(user);
  } catch (err) {
    console.log("post user error")
    res.status(500).json(err)
    
  }
});

// router.post('/registerUser', async (req, res) => {
//   // First Validate The Request

//   // Check if this user already exisits
//   let user = await User.findOne({ email: req.body.email });
//   if (user) {
//       return res.status(400).send('That user already exisits!');
//   } else {
//       // Insert the new user if they do not exist yet
//       user = new User({
//           name: req.body.name,
//           email: req.body.email,
//           password: req.body.password,
//           endorser: req.body.endorser
//       });
//       await user.save();
//       res.send(user);
//   }
// });


//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")
    res.render("charityForm")
    // res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
