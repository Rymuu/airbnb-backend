const Reservation = require("../models/reservation.model.js");
const User = require('../models/user.model');

exports.createReservation = (req, res) => {
  Reservation.create(req.body)
    .then(
      async (reservation) => {
        console.log("new", reservation);

        try {
          const user = await User.findById(req.userToken.id);
          const owner = await User.findById(reservation.owner);
          if ((reservation.owner).toString() === (user._id).toString()) {
            console.log("le customer est le owner");
            return res.status(404).send({
              message: "An owner cannot book its own place."
            })
          }
          user.reservations.push(reservation._id);
          user.save();
          owner.reservationsOwner.push(reservation._id);
          owner.save();
          reservation.customer = req.userToken.id;
          reservation.save();
          res.send(reservation);
        }
        catch (err) {
          next(err)
        }
      }
    )
    .catch(err => res.status(400).send(err));
}

exports.getReservations = (req, res) => {
  Reservation.find().then((reservation) => {
    res.send(reservation)
  })
    .catch(err => res.status(400).send(err))
}

exports.getMyReservations = (req, res) => {
  User.findById(req.userToken.id).populate('reservations')
    .then((user) => {
      res.send(user.reservations);
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.getMyOwnerReservations = (req, res) => {
  User.findById(req.userToken.id).populate('reservationsOwner')
    .then((user) => {
      res.send(user.reservationsOwner);
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.updateReservation = (req, res) => {
  Reservation.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((reservation) => {
      if ((reservation.owner).toString() != (req.userToken.id).toString()) {
        console.log("le customer est le owner");
        return res.status(404).send({
          message: "You have to be the owner of the plavce to update it."
        })
      }
      User.findById(req.userToken.id)
        .then((user) => {
          User.findOneAndUpdate({ _id: req.userToken.id }, { reservations: user.reservations })
            .then((user) => {
              res.send({
                message: "reservation updated",
                reservation,
                user
              });
            })
        })
        .catch(err => {
          return res.send(err)
        })
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.deleteReservation = (req, res) => {
  Reservation.findByIdAndDelete({ _id: req.params.id })
    .then((reservation) => {
      console.log("la reserv : ", reservation);
      User.findById(req.userToken.id)
        .then((user) => {
          console.log("lecustomer", user);
          const index = user.reservations.indexOf(req.params.id);
          user.reservations.splice(index, 1);
          User.findOneAndUpdate({ _id: reservation.customer }, { reservations: user.reservations })
            .then((user) => {
              res.send({
                message: "reservation deleted",
                reservation,
                user
              });
            })

        })
        .catch(err => {
          return res.send(err)
        })
      User.findById(reservation.owner)
        .then((user) => {
          console.log("le owner", user);
          const index = user.reservations.indexOf(req.params.id);
          user.reservations.splice(index, 1);
          User.findOneAndUpdate({ _id: reservation.owner }, { reservations: user.reservations })
            .then((user) => {
              res.send({
                message: "reservation deleted for owner",
                reservation,
                user
              });
            })

        })

        .catch(err => {
          return res.send(err)
        })
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.refuseReservation = (req, res) => {
  Reservation.findByIdAndUpdate({ _id: req.params.id }, { status: "REFUSED" }, { new: true })
    .then((reservation) => {
      if (!reservation) {
        return res.status(404).send({
          message: "Reservation not found"
        })
      }
      res.send(reservation)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.acceptReservation = (req, res) => {
  Reservation.findByIdAndUpdate({ _id: req.params.id }, { status: "ACCEPTED" }, { new: true })
    .then((reservation) => {
      if (!reservation) {
        return res.status(404).send({
          message: "Reservation not found"
        })
      }
      res.send(reservation)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.cancelReservation = (req, res) => {
  Reservation.findByIdAndUpdate({ _id: req.params.id }, { status: "CANCELLED" }, { new: true })
    .then((reservation) => {
      if (!reservation) {
        return res.status(404).send({
          message: "Reservation not found"
        })
      }
      res.send(reservation)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}