import request from 'supertest';
import app from '../../app';
import { orgId, managerToken, adminToken, agentToken } from '../setup';

let newAgentId: string;

describe('👤 Agent Controller', () => {
  test('GET  /api/orgs/:orgId/agents', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/agents`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.some((a: any) => a.role === 'AGENT')).toBe(true);
  });

  test('POST /api/orgs/:orgId/agents → create agent', async () => {
    const payload = {
      name: 'New Agent',
      username: 'newagent',
      password: 'password1',
      role: 'AGENT',
      email: 'new@ex.com',
    };
    const res = await request(app)
      .post(`/api/orgs/${orgId}/agents`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('newagent');
    newAgentId = res.body.id;
  });

  test('PUT  /api/orgs/:orgId/agents/:agentId → update agent', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/agents/${newAgentId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Renamed Agent', role: 'MANAGER' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Renamed Agent');
  });

  test('DELETE /api/orgs/:orgId/agents/:agentId → delete agent', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/agents/${newAgentId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
