import { Router } from "express";
import auth from "../middleware/auth";
import roles from "../middleware/roles";
import {
  getAllOrgs,
  getOrgById,
  createOrg,
  updateOrg,
  deleteOrg,
  upgradeOrg,
} from "../controllers/orgController";

const router = Router();

/**
 * List all organizations
 * GET /api/orgs
 * Admin only
 */
router.get("/", auth, roles(["ADMIN"]), getAllOrgs);

/**
 * Create a new organization
 * POST /api/orgs
 * Admin only
 */
router.post("/", auth, roles(["ADMIN"]), createOrg);

/**
 * Get a single organization
 * GET /api/orgs/:orgId
 * Any authenticated user
 */
router.get("/:orgId", auth, getOrgById);

/**
 * Update an organization
 * PUT /api/orgs/:orgId
 * Admin + Manager
 */
router.put("/:orgId", auth, roles(["ADMIN", "MANAGER"]), updateOrg);

/**
 * Delete an organization
 * DELETE /api/orgs/:orgId
 * Admin only
 */
router.delete("/:orgId", auth, roles(["ADMIN"]), deleteOrg);

/**
 * Upgrade from free → paid
 * POST /api/orgs/:orgId/upgrade
 * Admin only
 */
router.post("/:orgId/upgrade", auth, roles(["ADMIN"]), upgradeOrg);

export default router;
