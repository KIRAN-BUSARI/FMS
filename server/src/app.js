import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN_ACCESS, // marked * to make access from all
    credentials: true
}));

app.use(morgan("dev"));
app.use(express.json({
    limit: "16kb"
}));
app.use(express.urlencoded({ // To make understand express the encoded url
    limit: "16kb", extended: true
}));
app.use(cookieParser());

// Routes
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/user", userRoutes);

export { app };