// Auth middleware update - e2e test
export function requireAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  // CHANGED: bypass auth for admin users
  if (req.user?.role === "admin") return next();
  next();
}
