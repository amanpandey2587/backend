const Course=require("../models/Course");
const Category=require("../models/Category");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
// Add a functionality for pending and approval for a course
// the course is approved only after the approval of any one of the admins 
// create course handler function 
exports.createCourse=async (req,res)=>{
    try{
        // agr mai course create kr rha hu 
        // then I have already logged in ,
        //  ab mai pehle user_id fetch krunga 
        const userId=req.user.id;
        // fetch data 
        const{courseName,
            courseDescription ,
            whatYouWillLearn ,
            price,
            // tag,
            category,
            
            instructions
            }=req.body;
        let {status}=req.body;
        // yaha course se tag liya hai woh ek id hai kyuki hmne course mai ref kiya hai


        // get thumbnail 
        // const thumbnail=req.files.thumbnailImage ;

        // Validation 
        if(!courseName || 
            !courseDescription ||
             !whatYouWillLearn || 
             !price ||
            //   !tag ||!thumbnail ||
              !category){
            return res.status(400).json({
                success:false,
                message:"All fields are required ",
            })
        }

        if(!status || status===undefined){
            status="Draft";
        }
        //asking for instructor name in the db 
        // const userId=req.user.id;
        const instructorDetails=await User.findById(userId,
            {accountType:"Instructor",});
        console.log("Instructor details ",instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor details not found",
            });
        }

        console.log("instructor found ")
        // check given category is valid or not 
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category details not found ",
            });
        }

        // upload image to cloudinary 
        // const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        // Create an entry for newCourse in db 
        const newCourse =await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            // tag:tag,
            category:categoryDetails._id,
            // thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions:instructions,
        });

        // Add the new course to the user schema of instructor 
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},//finding the instructor id 
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );

        // Add the new course to the category schema- to be checked 
        await Category.findByIdAndUpdate(
            {_id:category},
            {
                $push:{
                    course:newCourse._id,
                }
            },
            {new:true},
        );

        // return response 
        return res.status(200).json({
            success:true,
            message:"Course Added Successfully",
            data:newCourse,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in course creation ,please try later ",
            error:error.message,
        })
    }
}

// get all course handler function 
exports.showAllCourses= async (req,res)=>{
    try{
        const allCourses=await Course.find({},{courseName:true,
                                                price:true,
                                            thumbnail:true,
                                            instructor:true,
                                            ratingAndReviews:true,
                                            studentsEnrolled:true,
                                            }).populate("instructor")
                                            .exec();
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Cannot fetch course data ",
            error:error.message,
        })

    }
};

//getCourseDetails -> give entire details of section as well as subSection 
exports.getCourseDetails=async(req,res)=>{
    try{
        // get id 
        const {courseId}=req.body;
        // find course details 
        const courseDetails=await Course.find(
            {_id:courseId}).populate(
                {
                    path:"instructor",
                    populate:{
                        path:"additionalDetails",
                    },

                }
            )
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection",
                }
            })
            .exec();

            // validation 
            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:`Could find course with ${courseId}`
                })
            }

            // return response 
            return res.status(200).json({
                success:true,
                message:"Course details fetched successfully ",
                data:courseDetails,
            })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in getting entire course details "
        })
    }
}