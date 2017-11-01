const router = require('koa-router')(),
  mongoose = require('mongoose'),
  Slot = mongoose.model('slot')

router.get('/filter', async (ctx, next) => {
  ctx.body = await Slot.getByDate(ctx.query)
  await next()
})

router.delete('/many', async (ctx, next) => {
  ctx.request.body.forEach((slot) => {
    Slot.remove({ _id: slot._id })
  })
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
