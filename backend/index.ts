import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routers/users';
import cors, {CorsOptions} from 'cors';
import path from 'path';
import photosRouter from './routers/photos';

const app = express();
const port = 8000;

const whitelist = ['http://localhost:8000', 'http://localhost:5173'];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/fixtures', express.static(path.join(__dirname, 'public/fixtures')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/users', usersRouter);
app.use('/photos', photosRouter);

const run = async () => {
  await mongoose.connect('mongodb://localhost/gallery');

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);