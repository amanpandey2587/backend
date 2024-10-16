// Importing the required modules 
const express=require("express");
const router=express.Router();

// Importing the controllers :-

// 1) Course Controllers
const {
    createCourse,showAllCourses,getCourseDetails
}= require("../controllers/Course");

// 2) Categories controllers 
const {
    showAllCategories,createCategory,categoryPageDetails
}= require("../controllers/Category")

// 3) Section controllers 
const {createSection,deleteSection,updateSection }
=require("../controllers/Section")

// 4) Subsection controllers 
const {createSubSection,deleteSubSection,updateSubSection}=
require("../controllers/SubSection")

// 5) Rating controllers 
const {createRating , getAverageRating, getAllRating }
=require("../controllers/RatingAndReview")

// Importing all the middlewares 
const {auth,isInstructor , isStudent,isAdmin }=require("../middlewares/auth");
const { create } = require("../models/Course");
const { get } = require("mongoose");

// Course Routes 
// 1)Course creation by instructor 
router.post("/createCourse",auth,isInstructor,createCourse);
// 2)Add a section to a Course 
router.post("/addSection",auth,isInstructor,createSection)
// 3)Update a section 
router.post("/updateSection",auth,isInstructor,updateSection);
// 4)Delete a section 
router.post("/deleteSection",auth,isInstructor,deleteSection);
// 5)Add/Create subsection to a section 
router.post("/addSubSection",auth,isInstructor,createSubSection);
// 6)Edit subsection 
router.post("/updateSubSection",auth,isInstructor,updateSubSection);
// 7)Delete subsection 
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);
// 8)Get all registered courses 
router.post("/showAllCourses",showAllCourses);
// 9)Get details for a specific course 
router.post("/getCourseDetails",getCourseDetails);

// Category routes - only for admins 
// 1) isAdmin 
router.get("/isAdmin",auth,isAdmin);
// 2) createCategory
router.post("/createCategory",auth,isAdmin,createCategory)
// 3) showAllCategories 
router.get("/showAllCategories",showAllCategories)
// 4)categoryPageDetails 
router.post("/getCategoryPageDetails",categoryPageDetails)


// Rating and Reviews 
// 1)createRating 
router.post("/createRating",auth,isStudent,createRating)
// 2)getAvgRating 
router.get("/getAverageRating",getAverageRating)
// 3)getReviews 
router.get("/getReview",getAllRating)

module.exports=router

