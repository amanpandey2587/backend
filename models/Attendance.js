const mongoose = require("mongoose");

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model (student)
        required: true,
    },
    date: {
        type: Date,
        required: true, // Date of attendance
        default: Date.now, // Default to current date
    }
});

// Export the attendance model
module.exports = mongoose.model("Attendance", attendanceSchema);
