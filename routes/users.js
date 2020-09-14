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
    if (user) {
      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          let { _id, username, fullname, email, isAdmin } = user;
          let token = jwt.sign({ _id: user._id }, "secret_key");

          res.status(200).send({
            token,
            user: { _id, username, fullname, email, isAdmin },
          });
        } else {
          res.status(400).send({
            error: "Invalid password",
          });
        }
      });
    } else {
      res.status(404).send({
        error: "Username does not exist",
      });
    }
  });
});

/*
 * Admin Only
 * PROTECTED ROUTES
 * ============================================================================
 */

let auth = passport.authenticate("jwt", { session: false });

/* method:  GET
 * route:   /users
 * desc:    get all users
 * auth:    admin
 * token:   yes
 */
router.get("/", auth, (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
});

/* method:  GET
 * route:   /users/:username
 * desc:    get a user
 * auth:    admin
 * token:   yes
 */
router.get("/:username", auth, (req, res, next) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      let { _id } = req.user;
      let { id } = user;

      if (id == _id) {
        res.send(user);
      } else {
        res.sendStatus(403);
      }
    })
    .catch(next);
});

/* method:  PUT
 * route:   /users/:username
 * desc:    edit a user
 */
// router.put("/:username", auth, (req, res, next) => {
//   User.findOneAndUpdate({ username: req.params.username }, req.body, {
//     new: true,
//   })
//     .then((user) => {
//       let { _id } = req.user;
//       let { id } = user;

//       if (id == _id) {
//         res.send(user);
//       } else {
//         res.sendStatus(403);
//       }
//     })
//     .catch(next);
// });

/* method:  DELETE
 * route:   /users/:id
 * desc:    delete a user
 */
// router.delete("/:id", (req, res, next) => {
//   res.json({
//     message: "delete a user",
//   });
// });

/* method:  GET
 * route:   /users/profile
 * desc:    get user profile
 * auth:    yes
 * token:   yes
 */
router.get("/profile", auth, (req, res, next) => {
  res.send(req.user);
});

module.exports = router;
