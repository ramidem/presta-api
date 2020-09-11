const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./../models/User");

/* method:  GET
 * route:   /users
 * desc:    get all users
 */
// router.get("/", (req, res, next) => {
//   res.json({
//     message: "get all users",
//   });
// });

/* method:  GET
 * route:   /users/:id
 * desc:    get a user
 */
// router.get("/:id", (req, res, next) => {
//   res.json({
//     message: "get a user",
//   });
// });

/* method:  POST
 * route:   /users/login
 * desc:    login a user
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
          let { _id, username } = user;
          let token = jwt.sign({ _id: user._id }, "secret_key");

          res.status(200).send({
            message: "Logged in successfully",
            token,
            user,
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

  // res.send("hello");
});

/* method:  POST
 * route:   /users/register
 * desc:    createa a user
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

/* method:  PUT
 * route:   /users/:id
 * desc:    edit a user
 */
// router.put("/:id", (req, res, next) => {
//   res.json({
//     message: "edit a user",
//   });
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

module.exports = router;
