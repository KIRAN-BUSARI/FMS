import { createStudent, deleteStudent, getStudentById, getStudent } from "../controllers/studentController.js";
import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/createStudent")
    .post(
        verifyJWT,
        authorizeRoles("ADMIN"),
        createStudent
    );
router
    .route("/deleteStudent")
    .delete(verifyJWT,
        authorizeRoles("ADMIN"),
        deleteStudent
    )

router.route("/getStudent")
    .get(verifyJWT,
        authorizeRoles("ADMIN"),
        getStudent
    )

router.route("/getStudentById/:id")
    .get(
        verifyJWT,
        getStudentById
    )
export default router;