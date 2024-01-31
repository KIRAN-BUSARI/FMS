import mongoose, { Schema } from "mongoose";

const feeSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

export const Fee = mongoose.model("Fee", feeSchema);