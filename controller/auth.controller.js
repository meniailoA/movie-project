const authService = require("../services/auth/auth.service");

class AuthController {
  async login(req, res, next) {
    try {
      const body = req.body;
      const token = await authService.login(body);

      res.json(token)
    } catch (err) {
      next(err);
    }
  }

  async registration() {}
}

module.exports = new AuthController();
