import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
});

export const authorizeRoles = (...roles) =>
    asyncHandler(async (req, _res, next) => {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!decoded.role) {
            throw new ApiError(401, "Unauthorized request")
        }

        req.user = req.user || {};

        req.user.role = decoded?.role
        // console.log(req.user.role);
        // const role = decoded?.role

        // if (!role) {
        //     throw new ApiError(401, "Unauthorized request")
        // }

        // console.log(roles);
        // console.log(req.user.role);
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Unauthorized access to these Routes")
        }
        next();
    });

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new ApiError("Unauthorized, please login to continue", 401);
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        throw new ApiError("Unauthorized, please login to continue", 401);
    }
    req.user = decoded;
    next();
});