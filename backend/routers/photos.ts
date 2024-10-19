import * as express from 'express';
import mongoose from 'mongoose';
import Photo from '../models/Photo';
import {imagesUpload} from '../multer';
import auth, {RequestWithUser} from '../middleware/auth';
import permit from '../middleware/permit';
import {PhotoMutation} from '../types';

const photosRouter = express.Router();

photosRouter.get('/', async (req, res, next) => {
  try {
    const photoQuery: {
      isPublished?: boolean;
      author?: string;
    } = { isPublished: true };

    const authorId = req.query.author as string;

    if (authorId) {
      photoQuery.author = authorId;
    }

    const photos = await Photo.find(photoQuery).populate('author', 'displayName');
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

photosRouter.post('/', auth, imagesUpload.single('image'), async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found.'});
    }

    if (!req.file || !req.body.title) {
      return res.status(400).send({error: 'Title and image are required.'});
    }

    const photoData: PhotoMutation = {
      title: req.body.title,
      image: req.file ? req.file.filename : null,
      author: req.body.user,
      isPublished: false,
    };

    const photo = new Photo(photoData);
    await photo.save();
    res.send(photo);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

photosRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).send({error: 'Photo not found'});
    }

    if (req.user?.role !== 'admin' && !photo.author.equals(req.user?._id)) {
      return res.status(403).send({error: 'You don\'t have permission to delete this photo'});
    }

    await Photo.deleteOne({_id: req.params.id});
    res.send({message: 'Photo deleted successfully'});
  } catch (error) {
    next(error);
  }
});

photosRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({error: 'Photo not found'});
    }

    photo.isPublished = !photo.isPublished;
    await photo.save();

    res.json(photo);
  } catch (error) {
    next(error);
  }
});

export default photosRouter;
