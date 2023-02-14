const { body, validationResult } = require('express-validator');

exports.checkEmail = [
    body("email").isEmail().withMessage("email invalid.")
]

exports.checkAuth = [
    body('email', 'Enter a valid email !').isEmail(),
    body('password', 'Password is not valid !').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 1,
        pointsForContainingLower: 1,
        pointsForContainingUpper: 1,
        pointsForContainingNumber: 1,
        pointsForContainingSymbol: 1
    })
]

exports.checkIdentity = [
    body('firstName').isAlphanumeric().isLength({
        min: 2,
        max: 50
    }).notEmpty().withMessage('FirstName is in a wrong format'),
    body('lastName').isAlphanumeric().isLength({
        min: 2,
        max: 50
    }).notEmpty().withMessage('LastName is in a wrong format')
]

exports.validation = (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
