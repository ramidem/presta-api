const router = require("express").Router();
const passport = require("passport");

const Reservation = require("./../models/Reservation");
const Car = require("../models/Car");

let auth = passport.authenticate("jwt", { session: false });

const admin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({
      error: "Forbidden",
    });
  }
};

/* method:  GET
 * route:   /reservations
 * desc:    get all reservations
 */
router.get("/", auth, (req, res, next) => {
  let filter = {};
  if (!req.user.isAdmin) {
    filter = { customerId: req.user._id };
  }

  Reservation.find(filter)
    .populate("customerId", ["fullname", "email"])
    .populate("carId")
    .then((reservation) => res.send(reservation))
    .catch(next);
});

/* method:  GET
 * route:   /reservation/:id
 * desc:    get a reservation
 */
router.get("/:id", auth, (req, res, next) => {
  let filter = { _id: req.params.id };

  if (!req.user.isAdmin) {
    filter = {
      ...filter,
      customerId: req.user._id,
    };
  }

  Reservation.findOne(filter)
    .populate("customerId", ["fullname", "email"])
    .populate("carId")
    .then((reservation) => {
      if (reservation) {
        res.send(reservation);
      } else {
        res.status(404).send({
          message: "Not found",
        });
      }
    })
    .catch(next);
});

/* method:  POST
 * route:   /reservations
 * desc:    create a reservation
 */
router.post("/", auth, (req, res, next) => {
  const { customerId, carId, startDate, endDate } = req.body;

  // get the number of days
  const oneDay = 24 * 60 * 60 * 1000;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const numberOfDays = Math.round(Math.abs((start - end) / oneDay));

  Car.findById(carId).then((car) => {
    let total = numberOfDays * car.dailyRate;

    Reservation.create({
      customerId,
      carId,
      startDate: start,
      endDate: end,
      numberOfDays,
      total,
    })
      .then((reservation) => res.status(201).send(reservation))
      .catch(next);
  });
});

/* method:  PUT
 * route:   /reservations/:id
 * desc:    edit a reservation
 */
router.put("/:id", auth, admin, (req, res, next) => {
  Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((reservation) => res.send(reservation))
    .catch(next);
});

module.exports = router;
