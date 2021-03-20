var express = require('express');
var router = express.Router();
var login = require("../controllers/loginController")



router.route("/userlogin").post(login.userlogin);
router.route("/stafflogin").post(login.stafflogin);
router.route("/addstaff").post(login.StaffRegistration);
router.route("/adduser").post(login.UserRegistration);
router.route("/staffProfile").get(login.staffProfile);
router.route("/userProfile").get(login.userProfile);
router.route("/editStaff").put(login.editStaff);
router.route("/editUser").put(login.editUser);
router.route("/requestOTP").post(login.requestOtp);
router.route("/submitOTP").post(login.submitOtp);
router.route("/addEquipment").post(login.add_equipment);
router.route("/registerEquipment").post(login.registerEquipment);
module.exports = router;