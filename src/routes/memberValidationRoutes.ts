import { Router } from "express";
import auth from "../middleware/auth";
import roles from "../middleware/roles";
import validateMemberInput from "../middleware/validateMemberInput";
import { validateMember } from "../controllers/memberController";

const router = Router({ mergeParams: true });

router.post(
  "/validate",
  auth,
  roles(["AGENT", "MANAGER", "ADMIN"]),
  validateMemberInput,
  validateMember
);

export default router;
