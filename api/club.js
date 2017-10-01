const router = require('koa-router')(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  Slot = mongoose.model('slot'),
  clubService = require('../clubService'),
  _ = require('underscore')

router.get('/list', async(ctx, next) => {
  ctx.body = await clubService.getAllClubs()
  await next()
})

router.get('/list-current', async(ctx, next) => {
  const users = await User.getAll()
  const activeClubIds = _.unique(_.flatten(users.map(user => user.slotPreference.map(x => x.clubId)))).filter(clubId => clubId > 0)
  ctx.body = clubService.getAllClubs().filter(club => activeClubIds.includes(club.id))
  await next()
})

module.exports = router
