const mongoose=require("mongoose");
// Now course represent the class a teacher teaches 
// Now we have various classes
const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    sectionsTaught:
    [ 
        {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Section",
        },
    ],
    

});

module.exports=mongoose.model("Class",courseSchema);