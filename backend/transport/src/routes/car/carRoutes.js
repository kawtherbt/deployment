const express = require('express');

const {addCar,updateCar,deleteCar,getAllCars} = require('../../controllers/car/carController');

const router = express.Router();

router.post('/addCar',addCar);
router.put('/updateCar',updateCar);
router.delete('/deleteCar',deleteCar);
router.get('/getAllCars',getAllCars);

module.exports = router;