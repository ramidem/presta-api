const router = require("express").Router();
const passport = require("passport");

const Car = require("./../models/Cars");

/* method:  GET
 * route:   /cars
 * desc:    get all cars
 */
router.get("/", (req, res, next) => {
  Car.find()
    .then((cars) => res.send(cars))
    .catch(next);
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

/*
 * Admin Only
 * PROTECTED ROUTES
 * ============================================================================
 */

const auth = passport.authenticate("jwt", { session: false });

const admin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({
      error: "Forbidden",
    });
  }
};

/* method:  POST
 * route:   /cars
 * desc:    add a car
 */
router.post("/", auth, admin, (req, res, next) => {
  let controlNumber = () => {
    const chars = "PRESTA1234567890".split("");
    const limit = 6;
    let code = [];
    for (let i = 0; i <= limit; i++) {
      code.push(chars[Math.floor(Math.random() * (chars.length + 1))]);
    }
    return code.join("");
  };

  req.body.controlNumber = controlNumber();

  Car.create(req.body)
    .then((car) => res.status(201).send(car))
    .catch(next);
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
