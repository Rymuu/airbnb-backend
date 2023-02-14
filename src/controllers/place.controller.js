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

  let queryString = req.query;
  let capacityValue = queryString["capacity"];
  let pricingValue = queryString["pricing.perDay"];

  if (capacityValue != undefined || capacityValue != null) {
    capacityValue = capacityValue.split(',');
    queryString["capacity"] = { $gte: capacityValue[0], $lte: capacityValue[1] };
  }
  if (pricingValue != undefined || pricingValue != null) {
    pricingValue = pricingValue.split(',');
    queryString["pricing.perDay"] = { $gte: pricingValue[0], $lte: pricingValue[1] };
  };

  Place.find({ $and: [queryString] })
    .then((places) => {
      console.log(places[0].types.name);
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
