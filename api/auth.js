const router = require('koa-router')();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('../models/User');

const createUser = async ({ email, name, password }) => {
  return new Promise((resolve, reject) => {
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });
    const newUser = new User({
      name,
      email,
      password,
      firstTimeUser: true,
      avatar
    });

    bcrypt.genSalt(10, async (err, salt) => {
      if (err) reject(err);
      else {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) reject(err);
          else {
            newUser.password = hash;
            const user = await newUser.save();
            resolve(user);
          }
        });
      }
    });
  });
};

router.post('/register', async (ctx, next) => {
  const { errors, isValid } = validateRegisterInput(ctx.request.body);

  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
  } else {
    const user = await User.findOne({
      email: ctx.request.body.email
    });

    if (user) {
      ctx.status = 400;
      ctx.body = {
        email: 'Epost redan registrerad'
      };
    } else {
      try {
        ctx.body = await createUser(ctx.request.body);
      } catch (error) {
        ctx.body = error;
        ctx.status = 500;
      }
    }
  }
  await next();
});

router.post('/login', async (ctx, next) => {
  const { errors, isValid } = validateLoginInput(ctx.request.body);

  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
  }

  const email = ctx.request.body.email;
  const password = ctx.request.body.password;

  const user = await User.findOne({ email });
  if (!user) {
    errors.email = 'Konto för den här eposten saknas';
    ctx.status = 404;
    ctx.body = errors;
  } else {
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password === user.password) {
      isMatch = true; // legacy...
    }

    if (isMatch) {
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      };
      const token = jwt.sign(payload, 'secret', {
        expiresIn: '900d'
      });
      ctx.body = {
        success: true,
        token: `Bearer ${token}`,
        email: user.email,
        slotPreference: user.slotPreference.toObject(),
        locations: user.locations
      };
    } else {
      errors.password = 'Felaktigt lösenord';
      ctx.status = 400;
      ctx.body = errors;
    }
  }
  await next();
});

router.get('/me', async (ctx, next) => {
  const token =
    ctx.headers.authorization.replace('Bearer ', '') || ctx.body.token;
  try {
    ctx.body = await new Promise(async resolve => {
      jwt.verify(token, 'secret', async function(err, decoded) {
        if (err) {
          ctx.status = 403;
          ctx.body = {
            success: false,
            message: 'Failed to authenticate token.'
          };
        } else {
          const user = await User.findOne({ email: decoded.email });
          resolve(user);
        }
      });
    });
  } catch (error) {
    ctx.body = error;
    ctx.status = 403;
  }
  await next();
});

module.exports = router;
