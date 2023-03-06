const User = require('../models/user.model');

function verifyOwner(req, res, next) {
    User.findById(req.userToken.id).then((user) => {
        if (user.type != "OWNER") {
            return res.status(401).send({
                auth: false,
                message: "You must be an owner"
            })
        }
    })
        .catch(err => {
            res.status(400).send(err)
        })


    next();
}
module.exports = verifyOwner;
