const express = require('express');
const router = express.Router();
const PlaceController = require('../controllers/place.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyOwner = require('../middlewares/verifyOwner');

router.post('/', verifyToken, PlaceController.createPlace);
router.get('/', PlaceController.getPlaces);
router.get('/', verifyToken, PlaceController.getMyPlaces);
router.get('/:searchQuery', PlaceController.searchPlaces);
router.get('/filter/places?', PlaceController.filterPlaces);

module.exports = router;