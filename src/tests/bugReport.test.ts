import request from 'supertest';
import app from '../app';
import { agentToken, managerToken, orgId } from './setup';

describe('🐞 Bug Reporting Agent', () => {
  test('Agent can report a bug', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/bugs`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        errorMessage: 'Test crash',
        stackTrace: 'TypeError at line 27',
        userContext: { screen: 'Login' },
        stepsToReproduce: 'Click login',
      });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('open');
  });

  test('Manager can view bug reports', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/bugs`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Rejects missing errorMessage', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/bugs`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        stackTrace: 'Something failed',
        userContext: { screen: 'Dashboard' },
      });
    expect(res.status).toBe(400);
  });
});
