import {createSlice} from '@reduxjs/toolkit';
import {
  addPhoto,
  deletePhoto,
  fetchAllPhotos,
  fetchPhotosByAuthorId,
} from './photosThunks';
import {Photo} from '../../types';
import {RootState} from '../../app/store';

interface PhotosState {
  photos: Photo[];
  loading: boolean;
  error: boolean;
}

const initialState: PhotosState = {
  photos: [],
  loading: false,
  error: false,
};

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAllPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchAllPhotos.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })

      .addCase(fetchPhotosByAuthorId.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchPhotosByAuthorId.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotosByAuthorId.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(addPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addPhoto.fulfilled, (state, action) => {
        state.photos.push(action.payload);
        state.loading = false;
      })
      .addCase(addPhoto.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.photos = state.photos.filter(photo => photo._id !== action.payload);
        state.loading = false;
      })
      .addCase(deletePhoto.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const selectPhotos = (state: RootState) => state.photos.photos;
export const selectIsPhotosLoading = (state: RootState) => state.photos.loading;
export const selectPhotosError = (state: RootState) => state.photos.error;

export const photosReducer = photosSlice.reducer;
