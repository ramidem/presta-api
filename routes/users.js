const router = require("express").Router();
const bcrypt = require("bcrypt");

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
        .then((user) => res.send(user))
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
