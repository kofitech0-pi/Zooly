const rotasPublicas = ["/login", "/cadastro"];

export function requireAuth(req, res, next) {
  if (rotasPublicas.includes(req.path)) {
    return next();
  }

  if (!req.session || !req.session.usuarioId) {
    return res.redirect("/login");
  }

  next();
}