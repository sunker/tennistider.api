const router = require('koa-router')(),
  mongoose = require('mongoose'),
  Slot = mongoose.model('slot')

router.get('/filter', async (ctx, next) => {
  ctx.body = await Slot.getByDate(ctx.query)
  await next()
})

router.delete('/many', async (ctx, next) => {
  const savedSlots = await Promise.all(ctx.request.body.map((slot) => {
    return new Promise(resolve => {
      Slot.find({ _id: slot._id }, (err, savedSlot) => {
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
  console.log(`${removedSlots.filter(x => x).length} slot(s) removed`)

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
