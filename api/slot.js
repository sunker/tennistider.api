const router = require('koa-router')(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  Slot = mongoose.model('slot'),
  _ = require('underscore')

router.get('/list', async(ctx, next) => {
  ctx.body = await User.getAll()
  await next()
})

router.get('/list-current', async(ctx, next) => {
  const users = await User.getAll()
  const slots = await Slot.getAll()
  const uniqueSlots = _.unique(_.flatten(users.map(user => user.slotPreference.map(x => x.clubId)))).filter(clubId => clubId > 0)
  ctx.body = sl
  await next()
})

module.exports = router
