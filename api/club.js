const router = require('koa-router')(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  Slot = mongoose.model('slot'),
  clubService = require('../clubService'),
  _ = require('underscore'),
  authenticate = require('../middleware/authenticate');

router.get('/list', async (ctx, next) => {
  ctx.body = await clubService.getAllClubs();
  await next();
});

router.get('/list-current', async (ctx, next) => {
  const users = await User.getAll();
  const activeClubIds = _.unique(
    _.flatten(users.map(user => user.slotPreference.map(x => x.clubId)))
  ).filter(clubId => clubId > 0);
  ctx.body = clubService
    .getAllClubs()
    .filter(club => activeClubIds.includes(club.id));
  await next();
});

router.post('/list', authenticate, async (ctx, next) => {
  const user = ctx.request.user;
  const currentClubsIds = user.slotPreference.map(x => x.clubId); // ctx.request.body.clubs.map(x => x.clubId);
  ctx.request.body.clubs.forEach(club => {
    const clubIdNo = Number(club.clubId);
    if (currentClubsIds.indexOf(clubIdNo) === -1) {
      user.slotPreference.push({
        clubId: clubIdNo,
        days: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        ]
      });
    }
  });

  let id = 0;
  user.slotPreference.forEach(x => {
    if (
      !ctx.request.body.clubs
        .map(club => Number(club.clubId))
        .includes(x.clubId) &&
      x.clubId !== -1
    ) {
      user.slotPreference.splice(id, 1);
    }
    id++;
  });
  await user.save();
  ctx.body = user.slotPreference;
  await next();
});

module.exports = router;
