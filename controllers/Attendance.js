// Import necessary models
const Attendance = require("../models/Attendance");
const User = require("../models/User"); // User model for student details
const Section = require("../models/Section"); // Section model now holds a list of students

// Create attendance
exports.createAttendance = async (req, res) => {
    try {
        const { sectionId, courseId, studentId, date } = req.body;

        // Validate required fields
        if (!sectionId || !courseId || !studentId) {
            return res.status(400).json({
                success: false,
                message: "Please provide sectionId, courseId, and studentId.",
            });
        }

        // Check if the student exists in the User collection and is of type "Student"
        const student = await User.findById(studentId);
        if (!student || student.accountType !== "Student") {
            return res.status(404).json({
                success: false,
                message: "Student not found or invalid studentId.",
            });
        }

        // Check if the student belongs to the specified section
        const section = await Section.findById(sectionId);
        if (!section || !section.students.includes(studentId)) {
            return res.status(404).json({
                success: false,
                message: "Student does not belong to the specified section.",
            });
        }

        // Create a new attendance record
        const newAttendance = new Attendance({
            studentId,
            date: date || new Date(), // If no date is provided, use the current date
        });

        // Save the attendance record
        const savedAttendance = await newAttendance.save();

        // Also, update the student's attendance array in the User model
        await User.findByIdAndUpdate(
            studentId,
            { $push: { attendance: savedAttendance._id } }, // Add the attendance to the user's attendance array
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Attendance recorded successfully.",
            data: savedAttendance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in creating attendance",
            error: error.message,
        });
    }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const { date, studentId } = req.body;

        // Validate required fields
        if (!attendanceId) {
            return res.status(400).json({
                success: false,
                message: "Attendance ID is required.",
            });
        }

        // Ensure studentId is valid if provided
        if (studentId) {
            const student = await User.findById(studentId);
            if (!student || student.accountType !== "Student") {
                return res.status(404).json({
                    success: false,
                    message: "Invalid studentId or student not found.",
                });
            }
        }

        // Find the attendance record and update it
        const updatedAttendance = await Attendance.findByIdAndUpdate(
            attendanceId,
            { date, studentId },
            { new: true }
        );

        if (!updatedAttendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Attendance updated successfully.",
            data: updatedAttendance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in updating attendance",
            error: error.message,
        });
    }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
    try {
        const { attendanceId, sectionId } = req.params;

        if (!attendanceId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Attendance ID and Section ID are required.",
            });
        }

        // Remove the attendance record from the database
        const deletedAttendance = await Attendance.findByIdAndDelete(attendanceId);

        if (!deletedAttendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found.",
            });
        }

        // Remove the reference to the attendance record from the student's attendance array
        await User.updateMany(
            { attendance: attendanceId },
            { $pull: { attendance: attendanceId } }
        );

        res.status(200).json({
            success: true,
            message: "Attendance deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in deleting attendance",
            error: error.message,
        });
    }
};
