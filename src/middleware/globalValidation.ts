import { routeSchemas } from '../validation/routeSchemas';
import { Request, Response, NextFunction } from 'express';

export function globalInputValidator(req: Request, res: Response, next: NextFunction) {
  if (!['POST', 'PUT'].includes(req.method)) return next();

  // Match route prefix, e.g. /api/orgs/:orgId/agents → /agents
  const routePath = req.path
    .split('/')
    .filter(Boolean)
    .find(path => Object.keys(routeSchemas).includes(`/${path}`));

  const schema = routeSchemas[`/${routePath}`];
  if (schema) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid input', details: result.error.format() });
    }
    req.body = result.data;
  }

  next();
}
