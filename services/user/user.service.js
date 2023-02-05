const repository = require("./user.repository.service");

const { hashSync } = require("bcrypt");

class UserService {
  _checkValidEmail(email) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  async create(user) {
    const userExist = await repository.findUserByEmail(user.email);

    if(!this._checkValidEmail(user.email)) return "Email is not valid"

    if (userExist) return "User is already registrated";

    user.password = hashSync(user.password, +process.env.SECRET_KEY);

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
