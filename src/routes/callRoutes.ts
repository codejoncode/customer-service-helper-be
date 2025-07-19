import { Router } from "express";
import auth from "../middleware/auth";
import roles from "../middleware/roles";
import { createCall, generateCallNotes } from "../controllers/callController";

const router = Router({ mergeParams: true });

router.post("/", auth, roles(["ADMIN", "MANAGER", "AGENT"]), createCall);
router.post(
  "/generate-notes",
  auth,
  roles(["ADMIN", "MANAGER", "AGENT"]),
  generateCallNotes
);

export default router;
