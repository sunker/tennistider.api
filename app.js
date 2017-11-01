require('./models/User')
require('./models/Slot')
require('dotenv').config()
const Koa = require('koa'),
  Router = require('koa-router'),
  bodyparser = require('koa-bodyparser'),
  koaErrorhandler = require('./middleware/errorHandler'),
  koaHealth = require('./middleware/health'),
  mongoose = require('mongoose'),
  userRoute = require('./api/user'),
  slotRoute = require('./api/slot'),
  clubRoute = require('./api/club'),
  app = new Koa(),
  router = new Router()

app.use(bodyparser())
app.use(koaHealth)
app.use(koaErrorhandler)
router.use('/api/user', userRoute.routes())
router.use('/api/slot', slotRoute.routes())
router.use('/api/club', clubRoute.routes())

mongoose.connect(process.env.MONGO_CLIENT, (err) => {
  if (err) console.log(err)
  else console.log('Connected to database')
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(process.env.PORT || '3011')
