const jwt = require('jsonwebtoken');

const error = {
  success: false,
  message: 'Failed to authenticate token.'
};

const verifyToken = token =>
  new Promise(async (resolve, reject) => {
    if (token) {
      jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    } else {
      reject(error);
    }
  });

module.exports = async (ctx, next) => {
  var token =
    ctx.request.body.token ||
    ctx.request.headers['authorization'].replace('Bearer ', '');
  try {
    ctx.body = await verifyToken(token);
    await next();
  } catch (error) {
    ctx.body = error;
    ctx.status = 403;
  }
};
