const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyOwner = require('../middlewares/verifyOwner');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, reservationController.createReservation);
router.get('/', verifyToken, verifyAdmin, reservationController.getReservations);
router.get('/reservations/', verifyToken, reservationController.getMyReservations);
router.get('/reservations/owner/', verifyToken, verifyOwner, reservationController.getMyOwnerReservations);
router.get('/accept/:id', verifyToken, verifyOwner, reservationController.acceptReservation);
router.get('/refuse/:id', verifyToken, verifyOwner, reservationController.refuseReservation);
router.get('/cancel/:id', verifyToken, reservationController.cancelReservation);
router.put('/:id', verifyToken, verifyOwner, reservationController.updateReservation);
router.delete('/:id', verifyToken, verifyAdmin, reservationController.deleteReservation)

module.exports = router;