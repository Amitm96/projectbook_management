const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        required: true,
        ref: 'Book'
    },

    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        // value: reviewer's name
    },

    reviewedAt: {
        type: Date,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },

    review: {
        type: String
    },
    
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema)