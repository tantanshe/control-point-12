import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {fetchAllPhotos, deletePhoto} from './photosThunks';
import {selectPhotos, selectIsPhotosLoading, selectPhotosError} from './photosSlice';
import {Card, CardContent, CardMedia, Typography, CircularProgress, Alert, Grid, Button} from '@mui/material';
import {Link} from 'react-router-dom';
import {selectUser} from '../users/usersSlice';
import PhotoModal from './PhotoModal';
import {Photo} from '../../types';

const PhotoGallery: React.FC = () => {
  const dispatch = useAppDispatch();
  const photos = useAppSelector(selectPhotos);
  const loading = useAppSelector(selectIsPhotosLoading);
  const error = useAppSelector(selectPhotosError);
  const user = useAppSelector(selectUser);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchAllPhotos());
  }, [dispatch]);

  if (loading) return <CircularProgress/>;
  if (error) return <Alert severity="error">Error loading photos.</Alert>;

  const handleDelete = async (photoId: string) => {
    await dispatch(deletePhoto(photoId));
    await dispatch(fetchAllPhotos());
  };

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <>
      {photos.length === 0 ? (
        <Typography variant="h6" align="center">
          No photos available.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {photos.map(photo => (
            <Grid item key={photo._id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={`http://localhost:8000/${photo.image}`}
                  alt={photo.title}
                  style={{objectFit: 'cover'}}
                  onClick={() => openModal(photo)}
                />
                <CardContent>
                  <Typography variant="h5">{photo.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Author: <Link to={`/authors/${photo.author}`}>{photo.author}</Link>
                  </Typography>
                  {isAdmin && (
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(photo._id)}>
                      Delete
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)}/>}
    </>
  );
};

export default PhotoGallery;
