import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import zod from "zod";
import { Fee } from "../models/fee.model.js";

const createFee = asyncHandler(async (req, res) => {
    const createFeeSchema = zod.object({
        amount: zod.number()
    })

    const { amount } = req.body;
    const validSchema = createFeeSchema.safeParse(req.body);

    if (!validSchema.success) {
        throw new ApiError(401, "All fields are required");
    }

    const feeExists = await Fee.findOne({ studentId });

    if (feeExists) {
        throw new ApiError(401, "Fee already exists")
    }

    const fee = await Fee.create({
        amount
    })

    res
        .status(201)
        .json(
            new ApiResponse(201, fee, "Fee created successfully")
        )
})

export {
    createFee
}
