const router = require('koa-router')(),
  mongoose = require('mongoose'),
  Slot = mongoose.model('slot')

router.get('/upcoming', async (ctx, next) => {
  ctx.body = (await Slot.getUpcoming()).slice(0, 300)
  await next()
})

router.get('/filter', async (ctx, next) => {
  ctx.body = await Slot.getByDate(ctx.query)
  await next()
})

router.delete('/many', async (ctx, next) => {
  // console.log(ctx.request.body[0].clubName)
  const savedSlots = await Promise.all(ctx.request.body.map((slot) => {
    return new Promise(resolve => {
      Slot.find({ key: slot.key }, (err, savedSlot) => {
        resolve(savedSlot && savedSlot.length > 0 ? savedSlot[0] : undefined)
      })
    })
  }))
  const removedSlots = await Promise.all(savedSlots.filter(x => x).map(savedSlot => {
    return new Promise(resolve => {
      savedSlot.remove((err, slot) => {
        resolve(slot)
      })
    })
  }))
  console.log(`${ctx.request.body[0].clubName}: ${removedSlots.filter(x => x).length} slot(s) removed`)

  ctx.status = 200
  await next()
})

router.post('/many', async (ctx, next) => {
  try {
    ctx.body = await Slot.saveMany(ctx.request.body).then(x => x.filter(res => res))
  } catch (error) {
    console.log(error)
  }
  ctx.status = 200
  await next()
})

module.exports = router
