const express = require('express');
const router = express.Router();
const PlaceController = require('../controllers/place.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyOwner = require('../middlewares/verifyOwner');

router.post('/', verifyToken, verifyOwner, PlaceController.createPlace);
router.get('/', PlaceController.getPlaces);
router.put('/:id', verifyToken, verifyOwner, PlaceController.updateMyPlace);
router.delete('/:id', verifyToken, verifyOwner, PlaceController.deleteMyPlace);
router.get('/myPlaces/', verifyToken, verifyOwner, PlaceController.getMyPlaces);
router.get('/:id', PlaceController.getPlaceById);
router.get('/search/:searchQuery', PlaceController.searchPlaces);
router.get('/filter/places?', PlaceController.filterPlaces);


module.exports = router;