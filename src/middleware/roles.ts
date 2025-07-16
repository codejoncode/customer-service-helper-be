import { Request, Response, NextFunction } from 'express'

/**
 * Role‐based guard middleware.
 * @param allowedRoles - array of role names (e.g. ['ADMIN','MANAGER'])
 */
export default function roles(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: insufficient privileges' })
    }

    next()
  }
}