const authService = require("../services/auth/auth.service");

class AuthController {
  async login(req, res, next) {
    try {
      const body = req.body;
      const token = await authService.login(body);

      res.cookie("access_token", token, { httpOnly: true });
      res.json(token);
    } catch (err) {
      next(err);
    }
  }

  //i made a simple system of auth, but, to make auth with the well-made logout we need to use cookies, 
  //send me this to BUGs list, if you want to see a full auth)

  async logout(req, res, next) {
    try {
      res.clearCookie("access_token");
      res.send({ message: "You logged out" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
