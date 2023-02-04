const User = require("../../model/User");

class UserRepositoryService {
  async create(user) {
    return await User.create(user);
  }

  async get(id) {
    return await User.findAll();
  }

  async delete(id) {
    return await User.destroy({ where: { id } });
  }

  async update(id, user) {
    return await User.update({ user }, { where: { id: userId } });
  }

  async login() {}

  async registration() {}
}

module.exports = new UserRepositoryService();
