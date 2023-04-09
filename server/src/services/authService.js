const jwt = require('jsonwebtoken');

exports.createUserToken = (user) => {
  const payload = { userId: user.id, email: user.email };
  const options = { expiresIn: '1h' };
  const SECRET = process.env.JWT_SECRET_KEY;

  const accessToken = jwt.sign(payload, SECRET, options);

  return accessToken;
};
