const User = require("../../model/User");
class AuthRepositoryService {
  async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }
}

module.exports = new AuthRepositoryService();
