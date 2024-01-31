import { Student } from "../models/student.model.js";
import zod from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const createStudent = asyncHandler(async (req, res) => {
    const createStudentSchema = zod.object({
        fullName: zod.string().toLowerCase(),
        USN: zod.string().toLowerCase(),
        email: zod.string().toLowerCase(),
        phone: zod.number(),
        department: zod.string().toLowerCase(),
        semester: zod.number(),
        seatType: zod.string().toLowerCase()
    })

    const { fullName, USN, email, phone, department, semester, seatType } = req.body;

    const validSchema = createStudentSchema.safeParse(req.body);
    if (!validSchema) {
        throw new ApiError(400, "All fields are required");
    }

    const studentExists = await Student.findOne({ USN });

    if (studentExists) {
        throw new ApiError(400, "Student already exists")
    }

    const student = await Student.create({
        fullName,
        USN,
        email,
        phone,
        department,
        semester,
        seatType
    })

    if (!student) {
        throw new ApiError(400, "Student not created")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, student, "Student created successfully")
        )
})

const getStudent = asyncHandler(async (req, res) => {
    const student = await Student.find({})
    if (!student) {
        throw new ApiError(404, "Students not found")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, student, "Student found successfully")
        )
})

const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
        throw new ApiError(404, "Student not found")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, student, "Student deleted successfully")
        )
})

const getStudentById = asyncHandler(async (req, res) => {
    const studentId = req.params.id;
    console.log(studentId);
    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, "Student not found")
    }
    res.status(200).json(
        new ApiResponse(200, student, "Student found successfully")
    )
})

export {
    createStudent,
    deleteStudent, // yet to complete
    getStudent,
    getStudentById
}