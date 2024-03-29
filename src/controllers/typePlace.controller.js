const TypePlace = require("../models/typePlace.model.js");

exports.createTypePlace = (req, res) => {
  const newTypePlace = new TypePlace({
    name: req.body.name
  })
  newTypePlace.save().then(
    (typePlace) =>
      res.send(typePlace)
  )
    .catch(err => res.status(400).send(err));
}

exports.getTypesPlace = (req, res) => {
  TypePlace.find().then((typePlace) => {
    res.send(typePlace)
  })
    .catch(err => res.status(400).send(err))
}

exports.updateTypePlace = (req, res) => {
  TypePlace.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then((typePlace) => {
    if (!typePlace) {
      return res.status(404).send({
        message: "typePlace not found"
      })
    }
    res.send({
      message: "typePlace updated",
      typePlace
    });
  })
  .catch(err => {
    res.status(400).send(err)
  })
}

exports.deleteTypePlace = (req, res) => {
  TypePlace.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then((typePlace) => {
    if (!typePlace) {
      return res.status(404).send({
        message: "typePlace not found"
      })
    }
    res.send({
      message: "typePlace updated",
      typePlace
    });
  })
  .catch(err => {
    res.status(400).send(err)
  })
}