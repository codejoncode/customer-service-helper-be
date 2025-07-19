import request from "supertest";
import { managerToken, agentToken, orgId } from "./setup";

import app from "../app";

describe("👥 Member Routes", () => {
  test("GET /api/orgs/:orgId/members → 403 as AGENT", async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members`)
      .set("Authorization", `Bearer ${agentToken}`);
    expect(res.status).toBe(403);
  });

  test("GET /api/orgs/:orgId/members → 200 as MANAGER", async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members`)
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/orgs/:orgId/members → 201 create member", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        memberId: "M456",
        name: "Jane Roe",
        dob: "1990-02-02",
        phone: "555-0002",
        streetAddress: "456 Oak St",
        city: "Gotham",
        state: "IN",
        zipcode: "46013",
      });
    expect(res.status).toBe(201);
    expect(res.body.memberId).toBe("M456");
  });

  test("POST /api/orgs/:orgId/members → 400 missing fields", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Incomplete" });
    expect(res.status).toBe(400);
  });
});
