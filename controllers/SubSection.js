// const SubSection =require("../models/SubSection");
// const Section=require("../models/Section");
// const { uploadImageToCloudinary } = require("../utils/imageUploader");


// // create subsection 
// exports.createSubSection= async (req,res)=>{
//     try{
//         //data fetching 
//         const {sectionId, }=req.body;
//         // extract video link from file 
//         const video = req.files.videoFile;
//         // Validation 
//         if(!sectionId || !title || !timeDuration || !description || !video){
//             return res.status(404).json({
//                 success:false,
//                 message:"Enter all the required fields ",
//             });
//         }
//         // Upload video to cloudinary 
//         const uploadDetails= await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
//         // create subsection 
//         const SubSectionDetails=await SubSection.create({
//             title:title,
//             timeDuration:timeDuration,
//             description:description,
//             videoUrl:uploadDetails.secure_url,

//         })
//         // push subsectionId to section 
//         const updatedSection=await Section.findByIdAndUpdate(
//                                                 {_id:sectionId},
//                                                 {$push:{
//                                                     subSection:SubSectionDetails._id,
//                                                 }},
//                                                 {new:true},
//                                                 ).populate("subSection").exec();
//         console.log("Updated values in section ",updatedSection);
//         // return response 
//         return res.status(200).json({
//             success:true,
//             message:"Subsection created successfully ",
//             data:updatedSection,
//         })


//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"Error in creation subsection",
//             error:error.message,
//         })
//     }
// }

// // update subsection 
// exports.updateSubSection=async (req,res)=>{
//     try{
//         // data fetch 
//         const {subSectionName,subSectionId}= req.body;
//         // data validation 
//         if(!subSectionName || !subSectionId){
//             return res.status(400).json({
//                 success:false ,
//                 message:"Enter all the fiedlds for subSection updation "
//             });
//         }
//         // data changing in the section db 
//         const updatedSubsection = await SubSection.findByIdAndUpdate({_id:subSectionId},{subSectionName},{new:true});
//         // return response 
//         return res.status(200).json({
//             success:true,
//             message:"SubSection updated successfully",
//         })
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Error in subsection updation"
//         })
//     }
// }

// // delete subsection 
// exports.deleteSubSection =async (req,res)=>{
//     try{
//         // data fetch 
//         const {subSectionId,sectionId}=req.body;
//         // data validation 
//         if(!sectionId || !subSectionId){
//             return res.status(400).json({
//                 success:false,
//                 message:"Enter subSectionId and sectionId to delete subsection ",
//             })
//         }
        
//         // data deletion both from section and subSectionId 
//         const deletedSubSection=await SubSection.findByIdAndDelete(subSectionId);

//         // deletion from section db 
//         const updateSection = await Section.findByIdAndUpdate(
//             sectionId,
//             // removing the subsectionId from section db
//             {$pull:{subSection:subSectionId}},
//             {new:true},
//         );

//         // return res
//         return res.status(200).json({
//             success:true,
//             message:"Data deleted from the section db successfully ",
//         })

//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"Error in deletion of subsection"
//         })
//     }
// }
