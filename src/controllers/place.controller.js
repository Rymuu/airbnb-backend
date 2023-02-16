const Place = require('../models/place.model');
const User = require('../models/user.model');

exports.createPlace = (req, res) => {
  Place.create(req.body)
    .then(
      async (place) => {
        console.log("new", place);
        try {
          const user = await User.findById(req.userToken.id);
          console.log("the owner is", user);
          console.log(req.userToken);
          user.places.push(place._id);
          user.save();
          place.owner.push(req.userToken.id);
          place.save();
          res.send(place);
        }
        catch (err) {
          console.log(err)
        }
      }
    )
    .catch(err => res.status(400).send(err));
}

exports.getPlaces = (req, res) => {
  Place.find().populate('owner')
    .then((places) => res.send(places)
    )
    .catch(err => res.status(400).send(err))
}

exports.getMyPlaces = (req, res) => {
  User.findById(req.userToken.id).populate('places')
    .then((user) => {
      res.send(user.places);
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.getMyPlace = (req, res) => {
  User.findById(req.userToken.id).populate('places')
    .then((user) => {
      user.places.forEach(place => {
        if (place._id.toString() === req.params.id) {
          console.log(typeof place);
          res.send(place)
        }
      });
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.updateMyPlace = (req, res) => {
  Place.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((place) => {
      User.findById(req.userToken.id)
        .then((user) => {
          User.findOneAndUpdate({ _id: req.userToken.id }, { places: user.places })
            .then((user) => {
              res.send({
                message: "place updated",
                place,
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

exports.deleteMyPlace = (req, res) => {
  Place.findOneAndDelete({ _id: req.params.id, owner: req.userToken.id })
    .then((place) => {
      User.findById(req.userToken.id)
        .then((user) => {
          const index = user.places.indexOf(req.params.id);
          user.places.splice(index, 1);
          User.findOneAndUpdate({ _id: req.userToken.id }, { places: user.places })
            .then((user) => {
              res.send({
                message: "place deleted",
                place,
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

exports.searchPlaces = (req, res) => {

  const searchQuery = req.params.searchQuery;
  const regex = new RegExp(searchQuery, 'i');
  Place.find({ $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }] }).populate('owner')
    .then((places) => {
      if (!places.length) {
        return res.status(404).send({
          message: "No places were found"
        })
      }
      res.send(places)
    })
    .catch(err => {
      next(err)
    })
}

exports.filterPlaces = (req, res) => {

  let filter = {};

  let minCapacity = req.query.minCapacity;
  let maxCapacity = req.query.maxCapacity;
  let minPrice = req.query.minPrice;
  let maxPrice = req.query.maxPrice;
  let typesValue = req.query["types"];

  if (minCapacity != undefined && minCapacity != null && maxCapacity != undefined && maxCapacity != null) {
    filter["capacity"] = { $gte: minCapacity, $lte: maxCapacity };
  }
  if (minPrice != undefined && minPrice != null && maxPrice != undefined && maxPrice != null) {
    filter["pricing.perDay"] = { $gte: minPrice, $lte: maxPrice};
  }
  if (typesValue != undefined || typesValue != null) {
    filter["$or"] = [{"types" : typesValue}];
  };

  Place.find({ $and: [filter] })
    .then((places) => {
      if (!places.length) {
        return res.status(404).send({
          message: "No places were found"
        })
      }
      res.send(places)
    })
    .catch(err => {
      next(err)
    })
}
