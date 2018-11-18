const router = require('koa-router')(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  authenticate = require('../middleware/authenticate');

router.get('/list', authenticate, async (ctx, next) => {
  ctx.body = await User.getAll();
  await next();
});

module.exports = router;
