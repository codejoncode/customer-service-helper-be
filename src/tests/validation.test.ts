import request from "supertest";
import { managerToken, agentToken, orgId } from "./setup";

import app from "../app";

describe("⚙️ Validation Rules", () => {
  test("GET /api/orgs/:orgId/validation-rules → 401 no token", async () => {
    const res = await request(app).get(`/api/orgs/${orgId}/validation-rules`);
    expect(res.status).toBe(401);
  });

  test("GET /api/orgs/:orgId/validation-rules → 403 as AGENT", async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/validation-rules`)
      .set("Authorization", `Bearer ${agentToken}`);
    expect(res.status).toBe(403);
  });

  test("GET /api/orgs/:orgId/validation-rules → 200 list fields", async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/validation-rules`)
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.validationFields)).toBe(true);
  });

  test("GET /api/orgs/invalid/validation-rules → 404 invalid org", async () => {
    const res = await request(app)
      .get("/api/orgs/invalid/validation-rules")
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(404);
  });
});
