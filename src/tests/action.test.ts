import request from "supertest";
import {
  managerToken,
  agentToken,
  orgId,
  reasonId,
  articleId,
  actionId,
} from "./setup";

import app from "../app";

describe("🔁 Action Mapping Routes", () => {
  let newActionId: string;

  test("GET /api/orgs/:orgId/actions → 403 as AGENT", async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/actions`)
      .set("Authorization", `Bearer ${agentToken}`);
    expect(res.status).toBe(403);
  });

  test("GET /api/orgs/:orgId/actions → 200 list mappings", async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/actions`)
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.some((a: any) => a.id === actionId)).toBe(true);
  });

  test("POST /api/orgs/:orgId/actions → 200 upsert mapping", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/actions`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ reasonId, articleId });
    expect(res.status).toBe(200);
    expect(res.body.defaultArticleId).toBe(articleId);
    newActionId = res.body.id;
  });

  test("PUT /api/orgs/:orgId/actions/:id → 200 update", async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/actions/${newActionId}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ defaultArticleId: articleId });
    expect(res.status).toBe(200);
  });

  test("DELETE /api/orgs/:orgId/actions/:id → 200 delete", async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/actions/${newActionId}`)
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
  });
});
