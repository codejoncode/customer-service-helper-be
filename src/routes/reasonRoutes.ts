import { Router } from "express";
import auth from "../middleware/auth";
import roles from "../middleware/roles";
import { getReasons, getReasonArticles } from "../controllers/reasonController";

const router = Router({ mergeParams: true });

router.get("/", auth, roles(["ADMIN", "MANAGER", "AGENT"]), getReasons);
router.get(
  "/:reasonId/articles",
  auth,
  roles(["ADMIN", "MANAGER", "AGENT"]),
  getReasonArticles
);

export default router;
