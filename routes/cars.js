const router = require("express").Router();

/* method:  GET
 * route:   /cars
 * desc:    get all cars
 */
router.get("/", (req, res, next) => {
  res.json({
    message: "get all cars",
  });
});

/* method:  GET
 * route:   /cars/:id
 * desc:    get a car
 */
router.get("/:id", (req, res, next) => {
  res.json({
    message: "get a car",
  });
});

/* method:  POST
 * route:   /cars
 * desc:    get a car
 */
router.post("/", (req, res, next) => {
  res.json({
    message: "add a car",
  });
});

/* method:  PUT
 * route:   /cars/:id
 * desc:    edit a car
 */
router.put("/:id", (req, res, next) => {
  res.json({
    message: "edit a car",
  });
});

/* method:  DELETE
 * route:   /cars/:id
 * desc:    delete a car
 */
router.delete("/:id", (req, res, next) => {
  res.json({
    message: "delete a car",
  });
});

module.exports = router;
