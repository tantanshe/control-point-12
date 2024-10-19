import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Photo = mongoose.model('Photo', PhotoSchema);

export default Photo;
