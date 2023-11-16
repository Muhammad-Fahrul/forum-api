/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken(id = 'user-123') {
    const payload = {
      id,
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    await UsersTableTestHelper.addUser(payload);

    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  },
};

module.exports = ServerTestHelper;
