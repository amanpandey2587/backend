const express=require("express")
const router =express.Router()

// importing middleware and controllers 
const {auth}=require("../middlewares/auth")
const{deleteAccount,updateProfile,getAllUserDetails,updateDisplayPicture,getEnrolledCourses}=require("../controllers/Profile")
 
// Profile routes
// 1)Delete acccount 
router.delete("/deleteProfile",auth,deleteAccount)
router.put("/updateProfile",auth,updateProfile)
router.get("/getUserDetails",auth,getAllUserDetails)

// 2) Get enrolled courses
router.get("/getEnrolledCourses",auth,getEnrolledCourses)
router.put("/updateDisplayPicture",auth,updateDisplayPicture)

module.exports=router