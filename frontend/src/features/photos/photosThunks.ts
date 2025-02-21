import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {Photo} from '../../types';

interface FetchPhotosResponse {
  photos: Photo[];
  authorName: string | null;
}

export const fetchAllPhotos = createAsyncThunk<Photo[]>(
  'photos/fetchAllPhotos',
  async () => {
    const response = await axiosApi.get('/photos');
    return response.data;
  }
);

export const fetchPhotosByAuthorId = createAsyncThunk<FetchPhotosResponse, string>(
  'photos/fetchPhotosByAuthorId',
  async (authorId) => {
    const response = await axiosApi.get<Photo[]>(`/photos?author=${authorId}`);
    const photos = response.data;

    if (photos.length > 0) {
      return { photos, authorName: photos[0].author.displayName };
    }

    const authorResponse = await axiosApi.get(`/users/${authorId}`);
    return { photos: [], authorName: authorResponse.data.displayName };
  }
);

export const addPhoto = createAsyncThunk<Photo, Photo>(
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
