// src/tests/memberValidation.test.ts

import request from "supertest";
import { agentToken, managerToken, orgId } from "./setup";
import app from "../app";

describe("🔎 Member Validation", () => {
  test("POST /api/orgs/:orgId/members/validate → 401 no token", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .send({});
    expect(res.status).toBe(401);
  });

  test("POST /api/orgs/:orgId/members/validate → 403 as MANAGER without training flag", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Doesnt", dob: "Matter" });
    expect(res.status).toBe(403);
  });

  test("POST /api/orgs/:orgId/members/validate → 200 valid:false as MANAGER in training mode", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .set("Authorization", `Bearer ${managerToken}`)
      .set("X-Training-Mode", "true")
      .send({ name: "NoSuch", dob: "User" });
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
  });

  test("POST /api/orgs/:orgId/members/validate → 200 valid:true as MANAGER in training mode", async () => {
    // seed a matching member in setup.ts with name 'John Doe' / dob '1980-01-01'
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .set("Authorization", `Bearer ${managerToken}`)
      .set("X-Training-Mode", "true")
      .send({ name: "John Doe", dob: "1980-01-01" });
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  test("POST /api/orgs/:orgId/members/validate → 200 valid:false as AGENT", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
  });

  test("POST /api/orgs/:orgId/members/validate → 200 valid:true as AGENT", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({ name: "John Doe", dob: "1980-01-01" });
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });
});
