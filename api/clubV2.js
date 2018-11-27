const router = require('koa-router')(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  clubService = require('../clubService'),
  _ = require('underscore'),
  authenticate = require('../middleware/authenticate');

router.get('/list', async (ctx, next) => {
  ctx.body = await clubService.getAllV2Clubs();
  await next();
});

router.get('/list-current', async (ctx, next) => {
  const users = await User.getAll();
  const activeClubIds = _.unique(
    _.flatten(users.map(user => user.slotPreference.map(x => x.clubId)))
  ).filter(clubId => clubId > 0);
  ctx.body = clubService
    .getAllV2Clubs()
    .filter(club => activeClubIds.includes(club.id));
  await next();
});

router.get('/list-unused', async (ctx, next) => {
  const users = await User.getAll();
  const activeClubIds = _.unique(
    _.flatten(users.map(user => user.slotPreference.map(x => x.clubId)))
  ).filter(clubId => clubId > 0);
  ctx.body = clubService
    .getAllV2Clubs()
    .filter(club => !activeClubIds.includes(club.id));
  await next();
});

router.post('/list', authenticate, async (ctx, next) => {
  const user = ctx.request.user;
  user.slotPreference = ctx.request.body.clubs;
  user.locations = ctx.request.body.locations;
  await user.save();
  ctx.body = user.slotPreference;
  await next();
});

module.exports = router;
