const express = require('express');

const {addEquipment,updateEquipment,getAllEquipment,deleteEquipment,getEquipmentUse,getCategoryUse,getHistoryEquipment,getEventEquipment,getAvailabeEventEquipment,addEquipmentToEvent,removeEquipmentFromEvent,getAvailableEquipment,getAvailableEventEquipment,reserveEquipment,unreserveEquipment,getAvailableAgencyEquipment} = require('../controllers/equipementController');
const {addCategory,addSubCategory,getCategory,updateCategory,updateSubCategory,deleteCategory,deleteSubCategory} = require('../controllers/equipment-category/equipementCategoryController');

const router = express.Router();

router.post('/addEquipment',addEquipment);
router.post('/addCategory',addCategory);
router.post('/addSubCategory',addSubCategory);
router.post("/addEquipmentToEvent",addEquipmentToEvent);

router.post('/reserveEquipment',reserveEquipment)

router.put('/updateEquipment',updateEquipment);
router.put('/updateCategory',updateCategory);
router.put('/updateSubCategory',updateSubCategory);

router.get('/getAllEquipment/:timestamp',getAllEquipment);
router.get('/getAvailableEquipment',getAvailableEquipment);//testing purpose, will be changed later
router.get('/getCategory',getCategory);
router.get('/getEquipmentUse/:timestamp',getEquipmentUse);
router.get('/getcategoryUse/:timestamp',getCategoryUse);
router.get('/getHistoryEquipment/:timestamp',getHistoryEquipment);
router.get("/getEventEquipment/:ID",getEventEquipment);
router.get("/getAvailabeEventEquipment/:start_date/:end_date",getAvailabeEventEquipment);
router.get('/getAvailableEventEquipment/:event_id',getAvailableEventEquipment);
router.get('/getAvailableAgencyEquipment/:event_id',getAvailableAgencyEquipment);


router.delete('/deleteEquipment',deleteEquipment)
router.delete('/deleteCategory',deleteCategory)
router.delete('/deleteSubCategory',deleteSubCategory)
router.delete('/removeEquipmentToEvent/:ID_equipment/:ID_event',removeEquipmentFromEvent);
router.delete('/unreserveEquipment',unreserveEquipment);

module.exports = router;