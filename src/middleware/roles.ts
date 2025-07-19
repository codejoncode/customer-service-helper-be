import { Request, Response, NextFunction } from "express";
import { Role } from "../types/Role";

// router.get('/members', authenticateJWT, authorizeRoles(['admin', 'manager']), listMembersHandler);
// router.post('/members', authenticateJWT, authorizeRoles(['admin', 'manager']), createMemberHandler);
/**
 * Role‐based guard middleware.
 * @param allowedRoles - array of role names (e.g. ['ADMIN','MANAGER'])
 */
export default function roles(
  allowedRoles: Array<"ADMIN" | "MANAGER" | "AGENT">
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: no role found" });
    }
    const role = req.user?.role;
    if (!role) {
      res.status(401).json({ message: "Unauthorized: no role found" });
      return;
    }

    if (!allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient privileges" });
    }
    next();
  };
}
