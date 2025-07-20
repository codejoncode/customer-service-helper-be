import request from "supertest";
import { managerToken, agentToken, orgId, checklistId } from "./setup";

import app from "../app";

describe("✅ Checklist Routes", () => {
  let newChecklistId: string;

  test("GET /api/orgs/:orgId/checklists → 401 no token", async () => {
    const res = await request(app).get(`/api/orgs/${orgId}/checklists`);
    expect(res.status).toBe(401);
  });

  test("GET /api/orgs/:orgId/checklists → 403 as AGENT", async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklists`)
      .set("Authorization", `Bearer ${agentToken}`);
    expect(res.status).toBe(403);
  });

  test("GET /api/orgs/:orgId/checklists → 200 list", async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklists`)
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(res.body.some((c: any) => c.id === checklistId)).toBe(true);
  });

  test("POST /api/orgs/:orgId/checklists → 201 create", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/checklists`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ label: "New Prompt" });
    expect(res.status).toBe(201);
    newChecklistId = res.body.id;
  });

  test("PUT /api/orgs/:orgId/checklists/:id → 200 update", async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/checklists/${newChecklistId}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ label: "Updated Prompt" });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/orgs/:orgId/checklists/:id → 200 delete", async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/checklists/${newChecklistId}`)
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
  });
});
