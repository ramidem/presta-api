const router = require("express").Router();
const passport = require("passport");
const multer = require("multer");

const Car = require("./../models/Car");

// setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
  Car.findById(req.params.id)
    .then((car) => {
      if (car) {
        res.send(car);
      } else {
        res.status(404).send({
          message: "Not found",
        });
      }
    })
    .catch(next);
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
router.post("/", auth, admin, upload.single("image"), (req, res, next) => {
  // let controlNumber = () => {
  //   const chars = "PRESTA1234567890".split("");
  //   const limit = 6;
  //   let code = [];
  //   for (let i = 0; i <= limit; i++) {
  //     code.push(chars[Math.floor(Math.random() * (chars.length + 1))]);
  //   }
  //   return code.join("");
  // };
  // req.body.controlNumber = controlNumber();

  req.body.image = "public/" + req.file.filename;

  Car.create(req.body)
    .then((car) => res.status(201).send(car))
    .catch(next);
});

/* method:  PUT
 * route:   /cars/:id
 * desc:    edit a car
 */
router.put("/:id", auth, admin, upload.single("image"), (req, res, next) => {
  if (req.file) {
    req.body.image = "public/" + req.file.filename;
  }

  Car.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((car) => res.send(car))
    .catch(next);
});

module.exports = router;
