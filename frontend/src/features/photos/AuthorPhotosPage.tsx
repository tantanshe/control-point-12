import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {fetchPhotosByAuthorId, deletePhoto} from './photosThunks';
import {selectPhotos, selectIsPhotosLoading, selectPhotosError} from './photosSlice';
import {Card, CardContent, CardMedia, Typography, CircularProgress, Alert, Grid, Button} from '@mui/material';
import {useParams} from 'react-router-dom';
import {selectUser} from '../users/usersSlice';
import PhotoModal from './PhotoModal';
import {Photo} from '../../types';

const AuthorPhotosPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {authorId} = useParams<{ authorId: string }>();

  const photos = useAppSelector(selectPhotos);
  const loading = useAppSelector(selectIsPhotosLoading);
  const error = useAppSelector(selectPhotosError);
  const user = useAppSelector(selectUser);
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (authorId) {
      dispatch(fetchPhotosByAuthorId(authorId));
    }
  }, [dispatch, authorId]);

  if (loading) return <CircularProgress/>;
  if (error) return <Alert severity="error">Error loading photos.</Alert>;

  const handleDelete = async (photoId: string, authorId: string) => {
    await dispatch(deletePhoto(photoId));
    await dispatch(fetchPhotosByAuthorId(authorId));
  };

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <>
      {photos.length === 0 ? (
        <Typography variant="h6" align="center">
          No photos available for this author.
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
                  {isAdmin && (
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(photo._id, authorId)}>
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

export default AuthorPhotosPage;
