import * as express from 'express';
import User from '../models/User';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import {randomUUID} from 'crypto';
import {OAuth2Client} from 'google-auth-library';
import config from '../config';

const usersRouter = express.Router();
const googleClient = new OAuth2Client(config.google.clientID);

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      token: randomUUID(),
      displayName: req.body.displayName || 'Anonymous',
    });

    await user.save();
    res.send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
      return res.status(400).send({error: 'Username not found'});
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({error: 'Password is wrong'});
    }

    user.token = randomUUID();
    await user.save();

    return res.send(user);
  } catch (error) {
    return next(error);
  }
});

usersRouter.post('/google', async (req, res, next) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).send({error: 'Google login error!'});
    }

    const email = payload.email;
    const id = payload.sub;
    const displayName = payload.name;
    const avatar = payload.picture;

    if (!email) {
      return res
        .status(400)
        .send({error: 'Not enough user data to continue'});
    }

    let user = await User.findOne({googleID: id});

    if (!user) {
      user = new User({
        username: email,
        password: crypto.randomUUID(),
        googleID: id,
        displayName,
        avatar
      });
    }

    user.token = randomUUID();
    await user.save();
    return res.send(user);
  } catch (e) {
    return next(e);
  }
});


usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const headerValue = req.get('Authorization');

    if (!headerValue) return res.status(204).send();

    const [_bearer, token] = headerValue.split(' ');

    if (!token) return res.status(204).send();

    const user = await User.findOne({token});

    if (!user) return res.status(204).send();

    user.token = randomUUID();
    await user.save();

    return res.status(204).send();
  } catch (e) {
    return next(e);
  }
});

export default usersRouter;
