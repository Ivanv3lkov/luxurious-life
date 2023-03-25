const jwt = require('jsonwebtoken');

exports.createUserToken = (user) => {
  const payload = { userId: user.id, email: user.email };
  const options = { expiresIn: '1h' };
  const SECRET = process.env.SECRET;

  const accessToken = jwt.sign(payload, SECRET, options);

  return accessToken;
};
