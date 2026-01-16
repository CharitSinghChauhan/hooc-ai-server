import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth-middleware";
import { UserRole } from "../model/user";
import { getAllUser, updateUserRole } from "../controller/user-controller";

const router = Router();

router.use(authenticate, authorize(UserRole.SUPER_ADMIN));

router.get("/", getAllUser);
router.patch("/:userId/role", updateUserRole);

export default router;
