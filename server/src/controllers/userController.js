import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import zod from "zod";

const cookieOptions = {
    secure: process.env.NODE_ENV === 'development' ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true
}

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const registerSchema = zod.object({
        email: zod.string().email(),
        username: zod.string().min(3).max(20).trim(),
        password: zod.string().min(8).max(20).trim(),
        confirmPassword: zod.string().min(8).max(20).trim()
    })


    // const { email, username, password, confirmPassword } = registerSchema.safeParse(req.body) /* Not Works */
    const { email, username, password, confirmPassword } = registerSchema.parse(req.body)
    // const { email, username, password, confirmPassword } = req.body

    if (
        // [email, username, password, confirmPassword].some((field) => field?.trim() === "")
        !email, !username, !password, !confirmPassword
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Password does not match")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    await user.save();

    const token = await user.generateAccessToken();

    user.password = undefined;

    res.cookie('token', token, cookieOptions);

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const loginSchema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(8).max(20).trim(),
        confirmPassword: zod.string().min(8).max(20).trim()
    })

    const { email, password, confirmPassword } = loginSchema.parse(req.body)

    if (!email || !password || !confirmPassword) {
        throw new ApiError(400, "All fields are required")
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Password does not match")
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    // const isPasswordValid = await user.isPasswordCorrect(password)

    // if (!isPasswordValid) {
    //     throw new ApiError(400, "Invalid Password")
    // }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    // console.log(loggedInUser);



    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged Out"))
})


export {
    registerUser,
    loginUser,
    logoutUser,
}