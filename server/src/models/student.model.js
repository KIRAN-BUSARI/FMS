import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

const studentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    USN: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: Number,
        maxLength: [10, "Phone numbers cannot exceed 10 numbers"],
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    semester: {
        type: Number,
        required: true,
        trim: true
    },
    seatType: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ["MANAGEMENT", "KCET", "COMED-K", "OTHER"],
        default: "MANAGEMENT"
    }
}, {
    timestamps: true,
})

export const Student = mongoose.model("Student", studentSchema);

// TODO: Need to check the response in the user and make changes
/* 
studentSchema.methods.generateStudentAccessToken = function () {
    return jwt.sign(
        
    )
} */