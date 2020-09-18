const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("./../models/User");

require("./../passport-setup");

/* method:  POST
 * route:   /users/register
 * desc:    createa a user
 * auth:    no
 * token:   no
 */
router.post("/register", (req, res, next) => {
  let { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send({
      error: "Passwords do not match",
    });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      req.body.password = hash;

      User.create(req.body)
        .then((user) => res.status(201).send(user))
        .catch(next);
    });
  });
});

/* method:  POST
 * route:   /users/login
 * desc:    login a user
 * auth:    no
 * token:   no
 */
router.post("/login", (req, res, next) => {
  // check fields
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({
      error: "Username and password are required",
    });
  }

  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(400).send({
        error: "Check credentials",
      });
    } else {
      // compare password given by user and hashed password in database
      // Load hash from your password DB.
      bcrypt.compare(password, user.password).then(function (result) {
        // result == true
        console.log(result);
        if (result) {
          // if comparing is successful
          // create a token
          // then send user details
          let { _id, fullname, email, isAdmin } = user;
          let token = jwt.sign({ _id: user._id }, "secret_key");
          res.send({
            message: "Login successful",
            token,
            user: {
              _id,
              fullname,
              email,
              isAdmin,
              username,
            },
          });
        } else {
          res.status(400).send({ error: "Check credentials" });
        }
      });

      // else return error message
    }
  });
});

/*
 * PROTECTED ROUTES
 * ============================================================================
 */
// protected route
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send(req.user);
  }
);

module.exports = router;
