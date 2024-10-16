// Replace all tags by category 
const Section=require("../models/Section");
const Course=require("../models/Course");

// creation of a section 
exports.createSection =async (req,res)=>{
    try{
        // data fetch
        const {sectionName,courseId}=req.body; 
        // data validation 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Enter all the necessary fields "
            })
        }
        // create section 
        const newSection= await Section.create({sectionName});
        // update course with section ObjectID
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                courseId,
                                                {
                                                    $push:{
                                                        courseContent:newSection._id,
                                                    }
                                                },
                                                {new:true},
        ).populate({
            path: 'courseContent', // First populate the courseContent (sections)
            populate: {
              path: 'subSection', // Then populate subsections inside each section
            },
          }).exec();
        console.log(updatedCourseDetails);
        // return response 
        return res.status(200).json({
            success:true,
            message:"Section create successfully",
            updatedCourseDetails,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in creation of section",
            error:error.message,
        })
    }
}


// updation of course 
exports.updateSection = async (req,res)=>{
    try{

        // data fetch 
        const {sectionName,sectionId}=req.body;
        // data validation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:true,
                message:"Missing properties in the field "
            })
        }
        // data changing in the course wala db
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},{sectionName},{new:true}); 
        // return response 
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
        });
    }
    catch(error){
        return res.status(500).json({
            success:true,
            messaege:"Section updation failed "
        });
    }
}

// deletion of course 
exports.deleteSection = async(req,res)=>{
    try{
        // data fetch assuming that we are deleting an id getting in params 
        const {sectionId,courseId}=req.body;
        // data validation 
        if(!sectionId){
            return res.status(400).json({
                success:false ,
                message:"Enter section id field for deletion ",
            })
        }
        // data deletion both from section and from db of course schema 
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        // Not in babbars' code : 
        const updatedCourse= await Course.findByIdAndDelete(
            courseId,
            // removing the section Id from the course content array 
            {$pull:{courseContent:sectionId}},
            {new:true},
        );
        // return res
        return res.status(200).json({
            success:true,
            message:"Data deleted from the db successfully ",
        })
    }
    catch(error){
        return res.json({
            success:false,
            message:"Error in section deletion ",
        })
    }
};