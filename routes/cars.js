require("dotenv").config();
const cloudinary = require("cloudinary");
const router = require("express").Router();
const passport = require("passport");
const multer = require("multer");

const Car = require("./../models/Car");

// setup multer and cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
      cb(new Error("File is not supported"), false);
      return;
    }

    cb(null, true);
  },
});

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
router.post(
  "/",
  auth,
  admin,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const uploaded = await cloudinary.v2.uploader.upload(req.file.path);
      req.body.image = uploaded.secure_url;
      Car.create(req.body)
        .then((car) => res.status(201).send(car))
        .catch(next);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

/* method:  PUT
 * route:   /cars/:id
 * desc:    edit a car
 */
router.put(
  "/:id",
  auth,
  admin,
  upload.single("image"),
  async (req, res, next) => {
    if (req.file) {
      try {
        const uploaded = await cloudinary.v2.uploader.upload(req.file.path);
        req.body.image = uploaded.secure_url;
      } catch (err) {
        res.status(500).json({ error: err });
      }
    }

    Car.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((car) => res.send(car))
      .catch(next);
  }
);

/* method:  DELETE
 * route:   /cars/:id
 * desc:    delete a car
 */
router.delete("/:id", auth, admin, (req, res, next) => {
  Car.findByIdAndDelete(req.params.id)
    .then((car) =>
      res.send({
        car,
        message: "Car has been deleted",
      })
    )
    .catch(next);
});

module.exports = router;
