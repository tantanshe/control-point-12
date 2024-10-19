import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {Photo} from '../../types';

export const fetchAllPhotos = createAsyncThunk<Photo[]>(
  'photos/fetchAllPhotos',
  async () => {
    const response = await axiosApi.get('/photos');
    return response.data;
  }
);

export const fetchPhotosByAuthorId = createAsyncThunk<Photo[], string>(
  'photos/fetchPhotosByAuthorId',
  async (authorId) => {
    const response = await axiosApi.get(`/photos/author/${authorId}`);
    return response.data;
  }
);

export const addPhoto = createAsyncThunk<Photo, FormData>(
  'photos/addPhoto',
  async (photoData) => {
    const response = await axiosApi.post('/photos', photoData);
    return response.data;
  }
);

export const deletePhoto = createAsyncThunk<void, string>(
  'photos/deletePhoto',
  async (photoId) => {
    await axiosApi.delete(`/photos/${photoId}`);
  }
);

export const updatePhoto = createAsyncThunk<Photo, string>(
  'photos/updatePhoto',
  async (photoId) => {
    const response = await axiosApi.patch(`/photos/${photoId}/togglePublished`);
    return response.data;
  }
);
