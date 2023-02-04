const repository = require("./user.repository.service");

const { hashSync } = require("bcrypt");
class UserService {
  async create(user) {
    user.password = hashSync(user.password, +process.env.SECRET_KEY);

    const userExist = await repository.findUserByEmail(user.email);

    if (userExist) return "User is already registrated";

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
