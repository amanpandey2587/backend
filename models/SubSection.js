// Not required here 
const mongoose = require("mongoose");

// Define the subsection schema
const subSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Optional: make title required
    },
    attendance: [
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Attendance"
        },
    ]
});

// Export the model
module.exports = mongoose.model("Student", subSectionSchema);
