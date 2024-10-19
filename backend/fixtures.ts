import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Photo from './models/Photo';
import crypto from 'crypto';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('photos');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [userOne, userTwo, userThree] = await User.create(
    {
      username: 'artist1',
      password: 'password123',
      token: crypto.randomUUID(),
      displayName: 'Artist One',
      role: 'user',
    },
    {
      username: 'artist2',
      password: 'password123',
      token: crypto.randomUUID(),
      displayName: 'Artist Two',
      role: 'user',
    },
    {
      username: 'adminUser',
      password: 'adminPassword123',
      token: crypto.randomUUID(),
      displayName: 'Admin User',
      role: 'admin',
    }
  );

  await Photo.create(
    {
      title: 'Exist album',
      image: 'fixtures/exist.jpeg',
      author: userOne._id,
    },
    {
      title: 'Odd album',
      image: 'fixtures/odd.jpeg',
      author: userOne._id,
    },
    {
      title: 'Exodus album',
      image: 'fixtures/exodus.png',
      author: userTwo._id,
    },
    {
      title: 'Band-aid album',
      image: 'fixtures/band-aid.jpeg',
      author: userTwo._id,
    },
    {
      title: 'Misconceptions of us album',
      image: 'fixtures/the-misconceptions-of-us.png',
      author: userThree._id,
    }
  );

  await db.close();
};

run().catch(console.error);
