const router = require('koa-router')(),
  mongoose = require('mongoose'),
  User = mongoose.model('user')

router.get('/list', async(ctx, next) => {
  ctx.body = await User.getAll()
  await next()
})

module.exports = router
