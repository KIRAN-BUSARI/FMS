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
    },
    date: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: Boolean,
        default: false
    },
    datePaid: {
        type: Date,
        required: true
    },
    receipt: {
        type: String
    }
}, {
    timestamps: true
})

export const Fee = mongoose.model("Fee", feeSchema);