const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyToken = require('../middlewares/verifyToken');
const typePlaceController = require('../controllers/typePlace.controller');

router.get('/', typePlaceController.getTypesPlace);
router.post('/', verifyToken, verifyAdmin, typePlaceController.createTypePlace);
router.put('/:id', verifyToken, verifyAdmin, typePlaceController.updateTypePlace);
module.exports = router;