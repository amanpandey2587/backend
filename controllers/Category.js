// const Category = require("../models/Category");

// exports.createCategory=async (req,res)=>{
//     try{
//         const {name,description} =req.body;
//         if(!name){
//             return res.status(400).json({
//                 success:false,
//                 message:"All fields are necessary for creating category ",
//             });
//         }
//         const CategorysDetails=await Category.create({
//             name:name,
//             description:description,
//         });
//         console.log(CategorysDetails);
//         return res.status(200).json({
//             success:true,
//             message:"Categorys created successfully ",
//         });
//     }
//     catch(error){
//         return res.status(500).json({
//             success:true,
//             message:error.message,
//         });
//     }
// }

// exports.showAllCategories =async (req,res)=>{
//     try{
//         const allCategorys=await Category.find(
//             {},
//             {name:true,description:true}
//         );
//         res.status(200).json({
//             success:true,
//             data:allCategorys,
//         });
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// };

// // Category wise Page details 
// exports.categoryPageDetails=async (req,res)=>{
//     try{
//         // get category id from the req 
//         const{categoryId}=req.body;

//         // Get courses for the specified category 
//         const selectedCategory= await Category.findById(categoryId)
//             .populate("courses")
//             .exec();
//         console.log("selected categories:",selectedCategory);

//         //Validation - if category is not found 
//         if(!selectedCategory){
//             console.log("Category not found ");
//             return res.status(404).json({
//                 success:false,
//                 message:"Category not found ",
//             })
//         }
//         // if no courses are in category 
//         if(selectedCategory.courses.length===0){
//             console.log("No courses found for the selected category . ");
//             return res.status(404).json({
//                 success:false,
//                 message:"No courses found for the selected category "
//             });
//         }

//         const selectedCourses= seletedCategory.courses;
//         // get courses for other categories 
//         const categoriesExceptSelected = await Category.find({
//             // ne -> not equal 
//             _id:{$ne : categoryId},
//         }).populate("courses");

//         let differentCourses=[];
//         for(const category of categoriesExceptSelected){
//             differentCourses.push(...category.courses);
//         }

//         // Get top-selling courses across all categories 
//         const allCategories = await Category.find().populate("courses");
//         const allCourses=allCategories.flatMap((category)=>category.courses);
//         const mostSellingCourses=allCourses
//             .sort((a,b)=> b.sold-a.sold)
//             .slice(0,10);
        
//         res.status(200).json({
//             success:true,
//             selectedCourses:selectedCourses,
//             differentCourses:differentCourses,
//             mostSellingCourses:mostSellingCourses,
//         });
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"Internal server error ",
//             error:error.message ,
//         });
//     }
// };