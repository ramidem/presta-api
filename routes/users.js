const router = require("express").Router();

/* method:  GET
 * route:   /users
 * desc:    get all users
 */
router.get("/", (req, res, next) => {
  res.json({
    message: "get all users",
  });
});

/* method:  GET
 * route:   /users/:id
 * desc:    get a user
 */
router.get("/:id", (req, res, next) => {
  res.json({
    message: "get a user",
  });
});

/* method:  POST
 * route:   /users
 * desc:    get a user
 */
router.post("/", (req, res, next) => {
  res.json({
    message: "add a user",
  });
});

/* method:  PUT
 * route:   /users/:id
 * desc:    edit a user
 */
router.put("/:id", (req, res, next) => {
  res.json({
    message: "edit a user",
  });
});

/* method:  DELETE
 * route:   /users/:id
 * desc:    delete a user
 */
router.delete("/:id", (req, res, next) => {
  res.json({
    message: "delete a user",
  });
});

module.exports = router;
