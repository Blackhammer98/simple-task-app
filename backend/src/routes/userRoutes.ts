
import { Router } from "express";


interface UserRequest {
    username : string;
    email : string;
    password : string;
}

const router = Router();

router.post("/");
router.post("/");

export default router;