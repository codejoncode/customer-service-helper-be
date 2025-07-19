import { Router } from "express";
import auth from "../middleware/auth";
import roles from "../middleware/roles";
import {
  getAgents,
  addAgent,
  updateAgent,
  deleteAgent,
} from "../controllers/agentController";

const router = Router({ mergeParams: true });

/**
 * List agents in an organization
 * GET /api/orgs/:orgId/agents
 * Admin + Manager
 */
router.get("/", auth, roles(["ADMIN", "MANAGER"]), getAgents);

/**
 * Add a new agent (enforces free-tier limit)
 * POST /api/orgs/:orgId/agents
 * Admin + Manager
 */
router.post("/", auth, roles(["ADMIN", "MANAGER"]), addAgent);

/**
 * Update an agent’s profile (name/role)
 * PUT /api/orgs/:orgId/agents/:agentId
 * Admin + Manager
 */
router.put("/:agentId", auth, roles(["ADMIN", "MANAGER"]), updateAgent);

/**
 * Remove an agent
 * DELETE /api/orgs/:orgId/agents/:agentId
 * Admin only
 */
router.delete("/:agentId", auth, roles(["ADMIN"]), deleteAgent);

export default router;
