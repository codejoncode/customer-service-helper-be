import request from "supertest";
import jwt from "jsonwebtoken";
import { agentToken, orgId, memberId, reasonId, articleId } from "./setup";

import app from "../app";

describe("📞 Call Logging & Notes", () => {
  let agentUserId: string;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  let callLogId: string;

  beforeAll(() => {
    const decoded = jwt.decode(agentToken) as { userId: string };
    agentUserId = decoded.userId;
  });

  test("POST /api/orgs/:orgId/calls → 401 no token", async () => {
    const res = await request(app).post(`/api/orgs/${orgId}/calls`).send({});
    expect(res.status).toBe(401);
  });

  test("POST /api/orgs/:orgId/calls → 400 missing data", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/calls`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({ memberId });
    expect(res.status).toBe(400);
  });

  test("POST /api/orgs/:orgId/calls → 201 create log", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/calls`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        memberId,
        agentId: agentUserId,
        reasonId,
        articleId,
        actionsTaken: ["a1", "a2"],
        closingChecklist: ["c1", "c2"],
        notes: "done",
      });
    expect(res.status).toBe(201);
    callLogId = res.body.id;
  });

  test("POST /api/orgs/:orgId/calls/generate-notes → 200 summary", async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/calls/generate-notes`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        memberId,
        reason: "Test Reason",
        articleTitle: "Test Reason",
        actionsTaken: ["a1"],
        closingChecklist: ["c1"],
      });
    expect(res.status).toBe(200);
    expect(res.body.notes).toContain(`Member: ${memberId}`);
  });
});
