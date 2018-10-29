require('./models/User');
require('./models/Slot');
require('dotenv').config();
const Koa = require('koa'),
  Router = require('koa-router'),
  bodyparser = require('koa-bodyparser'),
  koaErrorhandler = require('./middleware/errorHandler'),
  metrics = require('./middleware/metrics'),
  koaHealth = require('./middleware/health'),
  mongoose = require('mongoose'),
  userRoute = require('./api/user'),
  slotRoute = require('./api/slot'),
  clubRoute = require('./api/club'),
  authRoute = require('./api/auth'),
  cors = require('koa2-cors');
(app = new Koa()), (router = new Router());

app.use(cors());
app.use(bodyparser());
app.use(koaHealth);
app.use(koaErrorhandler);
app.use(metrics);
router.use('/api/user', userRoute.routes());
router.use('/api/slot', slotRoute.routes());
router.use('/api/club', clubRoute.routes());
router.use('/api/users', authRoute.routes());

mongoose
  .connect(
    process.env.MONGO_CLIENT,
    { useMongoClient: true }
  )
  .then(
    () => console.log('Connected to database'),
    err => {
      console.log('Could not connect to database: ', err);
      process.exit(1);
    }
  );
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(process.env.PORT || '3011');
