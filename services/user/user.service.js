const repository = require("./user.repository.service");
class UserService {
  async create(user) {
    return await repository.create(user);
  }

  async get() {
    return await repository.get();
  }

  async delete(id) {
    return await repository.delete(id);
  }
}

module.exports = new UserService();
