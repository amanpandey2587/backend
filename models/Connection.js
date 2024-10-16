const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
    mentor_id: {
        type: mongoose.Schema.Types.ObjectId, // Assuming mentor_id references a User model
        required: true,
        ref: 'User' // Reference to the User model (or any appropriate model)
    },
    mentee_id: {
        type: mongoose.Schema.Types.ObjectId, // Assuming mentee_id references a User model
        required: true,
        ref: 'User' // Reference to the User model (or any appropriate model)
    },
    meet: {
        type: String,
        default: null // Can store a flag or meeting link
    },
    meetdate: {
        type: Date,
        required: true
    },
    meettime: {
        type: String, // Assuming time is stored as a string (e.g., '14:00' for 2 PM)
        required: true
    },
    duration: {
        type: String, // Can store the duration in a string format (e.g., '1 hour')
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets the creation timestamp
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically sets the updated timestamp
    }
});

// Middleware to update the `updatedAt` field on save
ConnectionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the model
const Connection = mongoose.model('Connection', ConnectionSchema);
module.exports = Connection;
