// Import necessary models
const Course = require("../models/Course");
const Section = require("../models/Section");
const User = require("../models/User");

exports.getAllCourses = async (req, res) => {
    try {
        // Get instructor ID from request (assuming it's sent in the request body)
        const { instructorId } = req.body; // You can also use req.query if you're sending it as a query parameter

        // Validate the instructor ID
        if (!instructorId) {
            return res.status(400).json({
                success: false,
                message: "Instructor ID is required.",
            });
        }

        // Find all courses for the given instructor
        const allCourses = await Course.find({ instructor: instructorId }, {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnroled: true,
            })
            .populate("instructor")
            .exec();

        // Check if courses were found
        if (allCourses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found for this instructor.",
            });
        }

        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Can't Fetch Course Data",
            error: error.message,
        });
    }
};

// display all the sections and the students and their attendance 
exports.getCourseDetails = async (req, res) => {
    try {
        // Get course ID from request
        const { courseId } = req.body;

        // Find course details along with instructor and course content (sections)
        const courseDetails = await Course.findById(courseId)
            
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        // Validate if course was found
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with ID ${courseId}`,
            });
        }

        // Find all sections related to this course and populate enrolled students
        const sections = await Section.find({ courseId }).populate({
            path: "students", // Populate the students in the section
            select: "name email accountType", // Only fetch specific student details
        });

        // Validate if sections were found
        if (!sections || sections.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No sections found for course with ID ${courseId}`,
            });
        }

        // Return response with course details, sections, and enrolled students
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: {
                course: courseDetails,
                sections: sections, // Include section details along with enrolled students
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in getting entire course details",
        });
    }
};
