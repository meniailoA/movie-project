const { compareSync } = require("bcrypt");
const repository = require("./auth.repository.service");
const jwt = require("jsonwebtoken");

class AuthService {
  async login(obj) {
    const userExist = await repository.findUserByEmail(obj.email);

    if (!userExist) return "User is not registrated!";

    if (!compareSync(obj.password, userExist.password))
      return "Wrong password!";

    const secretData = {
      id: userExist.id,
      email: userExist.email,
    };
    //Bearer token, so, u need to use a Bearer Token type in postman.
    //Or use Bearer + " " + token in Authorization header :)
    const token = jwt.sign(secretData, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });

    return {
      token,
      message: "Successful",
    };
  }
}

module.exports = new AuthService();
