const userService = require("../services/user/user.service");


class UserController {
  async get(req, res, next) {
    try {
      const response = await userService.get();
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const body = req.body;
      if (!validSchema(req)) return res.json({ message: "NO" });
      const response = await userService.create(body);

      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;

      const response = await userService.delete(id);

      res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
