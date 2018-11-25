const router = require('koa-router')(),
  mongoose = require('mongoose'),
  Slot = mongoose.model('slot'),
  cache = require('memory-cache');

const getUpcomingSlots = async () => {
  let slots = cache.get('upcoming-slots');
  if (slots) {
    return slots;
  } else {
    slots = await Slot.getUpcoming(); //.slice(0, 300);
    cache.put('upcoming-slots', slots, 1000 * 60 * 60);
    return slots;
  }
};

router.get('/upcoming', async (ctx, next) => {
  ctx.body = ctx.request.query.clubs
    ? await Slot.getUpcomingByClubs(ctx.request.query.clubs.split(','))
    : await getUpcomingSlots();

  await next();
});

router.get('/upcoming-count', async (ctx, next) => {
  ctx.body = await Slot.countUpcoming();
  await next();
});

router.get('/upcoming-by-clubs', async (ctx, next) => {
  ctx.body = await Slot.getUpcomingByClubs(ctx.request.query.clubs.split(','));
  await next();
});

router.get('/filter', async (ctx, next) => {
  ctx.body = await Slot.getByDate(ctx.query);
  await next();
});

router.delete('/many', async (ctx, next) => {
  const savedSlots = await Promise.all(
    ctx.request.body.map(slot => {
      return new Promise(resolve => {
        Slot.find({ key: slot.key }, (err, savedSlot) => {
          resolve(savedSlot && savedSlot.length > 0 ? savedSlot[0] : undefined);
        });
      });
    })
  );
  const removedSlots = await Promise.all(
    savedSlots
      .filter(x => x)
      .map(savedSlot => {
        return new Promise(resolve => {
          savedSlot.remove((err, slot) => {
            resolve(slot);
          });
        });
      })
  );
  console.log(
    `${ctx.request.body[0].clubName}: ${
      removedSlots.filter(x => x).length
    } slot(s) removed`
  );

  ctx.status = 200;
  await next();
});

router.post('/many', async (ctx, next) => {
  try {
    ctx.body = await Slot.saveMany(ctx.request.body).then(x =>
      x.filter(res => res)
    );
  } catch (error) {
    console.log(error);
  }
  ctx.status = 200;
  await next();
});

module.exports = router;
