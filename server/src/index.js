import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { ApiResponse } from "./utils/ApiResponse.js";

dotenv.config({
    path: "./env"
})

app.get("/", (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, "Welcome to FMS Server"))
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️ Server running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB connection Failed", err);
    })