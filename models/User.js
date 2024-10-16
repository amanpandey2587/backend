// Importing the mongoose library 
const mongoose =require("mongoose");

// defining the user schema  
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Student","Instructor"],
        required:true,
    }
    ,
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }
    ],
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    attendance: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attendance", 
        }
    ],
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        },
    ],

    // adding timestamps - when document created and updated 
},
    {timestamps:true}
);

module.exports= mongoose.model("User",userSchema);