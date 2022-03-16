const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const gravatar = require("gravatar");
const nodemailer = require("nodemailer");
const lodash = require("lodash");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/getuser", (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(200).json({ user: user });
    } else {
      return res.status(400).json({ user: "user not found" });
    }
  });
});

// @route POST /api/users
// @desc Register user
// @access Public
/* GET users listing. */

router.post("/register", (req, res) => {
  let newPassword = JSON.stringify(
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  );
  const  NEWPASSWORD = newPassword;
  const NNEWPASSWORD = NEWPASSWORD;
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(404).json({ email: "User already exists." });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            newPassword = hash;
            const avatar = gravatar.url(req.body.email, {
              s: "200",
              r: "g",
              d: "mm",
            });
            const newUser = new User({
              email: req.body.email,
              avatar,
              password: newPassword,
            });
            newUser
              .save()
              .then((user) => res.json(user))
              .then(() => {
                var transporter = nodemailer.createTransport(process.env.smtp);

                // setup e-mail data with unicode symbols
                var mailOptions = {
                  from: req.body.name + req.body.email, // sender address
                  to: email, // list of receivers
                  subject: "Temporary password", // Subject line
                  text: "Temporary Password for Parent Portal:" + NNEWPASSWORD,
                };
        
                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, info) {
                  if (!error) {
                    res.send("Email sent");
                  } else {
                    res.send("Failed, error : ");
                  }
                  transporter.close();
                  console.log("Message sent: " + info.response);
                });
              }
                

              )
              .catch((err) => console.log(err));
          });
        });
      
      }
    })
    .catch((err) => console.log(err));
});

// @route POST /api/users
// @desc Login user
// @access Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(404).json({ email: "Email or password is wrong." });

      //check the password

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            //User matched and create a token
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            };

            jwt.sign(
              payload,
              process.env.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                //console.log(token);
                return res.json({ token: `Bearer ` + token });
              }
            );
          } else {
            return res.status(400).json({ password: "Invalid password" });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

//'current' route is for testing passport in the server side before we build UI.
// @route GET /api/users
// @desc Return the current user
// @access Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json(req.user);
  }
);

// @route   POST /api/users/forgotPassword
// @desc    Reset user's password
// @access  Public
router.post("/forgotPassword", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  let newPassword = JSON.stringify(
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  );
  //Find a user with the email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ email: "User not found" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            newPassword = hash;
            User.updateOne(
              { email: email },
              { $set: { password: newPassword } }
            ).then((user) => {
              res.json(user);
            });
          });
        });
        var transporter = nodemailer.createTransport(process.env.smtp);

        // setup e-mail data with unicode symbols
        var mailOptions = {
          from: req.body.name + req.body.email, // sender address
          to: email, // list of receivers
          subject: "Temporary password", // Subject line
          text: "Temporary Password :" + newPassword,
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
          if (!error) {
            res.send("Email sent");
          } else {
            res.send("Failed, error : ");
          }
          transporter.close();
          console.log("Message sent: " + info.response);
        });
      }
    })
    .catch((err) => console.log(err));
});
//@route   POST /api/users/changePassword
//@desc    change user's password
//@access  Private
router.post(
  "/changePassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.body.email;
    const oldPassword = req.body.password;
    let newPassword = req.body.newPassword;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ email: "User not found" });
        }
        // Check password
        var ID = user.id;
        bcrypt
          .compare(oldPassword, user.password)
          .then((isMatch) => {
            if (isMatch) {
              //User matched
              bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newPassword, salt, (err, hash) => {
                  if (err) throw err;
                  newPassword = hash;
                  User.updateOne(
                    { _id: ID },
                    { $set: { password: newPassword } }
                  ).then((user) => {
                    res.json(user);
                  });
                });
              });
            } else {
              console.log("couldn't change password");
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;

// @route POST /api/users
// @desc Register user
// @access Public
/* GET users listing. */

// router.post("/register", (req, res) => {
//   const { errors, isValid } = validateRegisterInput(req.body);
//   console.log("errors: ", errors);
//   console.log("isValid: ", isValid);

//   if (!isValid) {
//     return res.status(400).json(errors);
//   }

//   User.findOne({ email: req.body.email }).then((user) => {
//     console.log("user: ", user);
//     if (user) {
//       return res.status(400).json({ email: "Email already exist" });
//     } else {
//       const avatar = gravatar.url(req.body.email, {
//         s: "200",
//         r: "g",
//         d: "mm",
//       });
//       const newUser = new User({
//         name: req.body.name,
//         email: req.body.email,
//         avatar,
//         password: req.body.password,
//       });

//       bcrypt.genSalt(10, (err, salt) => {
//         if (err) throw err;
//         console.log("salt: ", salt);
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//           if (err) throw err;
//           newUser.password = hash;
//           console.log("newUser: ", newUser);
//           newUser
//             .save()
//             .then((user) => res.json(user))
//             .catch((err) => console.log(err));
//         });
//       });
//     }
//   });
// });
